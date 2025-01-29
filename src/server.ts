
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { layout } from './components/layout.js'
import { content } from './components/content.js'
import type { Proc } from './lib/run-commands.js'
import { serveStatic } from '@hono/node-server/serve-static'
import { streamSSE } from 'hono/streaming'
import { streamProc } from './lib/stream-proc.js'
import { HTTPException } from 'hono/http-exception'

import { dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import consola from 'consola'
    
const __dirname = dirname(fileURLToPath(import.meta.url));
const relativePath = relative(process.cwd(), __dirname);


export function server({
  port = 3000,
  procs
}:{
  port?: number,
  procs: Proc[]
}){

  const app = new Hono()
  
  app.get('/', (c) => {
    return c.html(layout(content({ args: procs.map(v => v.arg) })))
  })

  app.use('/static/*', serveStatic({ root: `./${relativePath}` }))

  app.get('/log/:id', async (c) => {
    const { id } = c.req.param()
    const proc = procs[ Number(id) ]
    if(!proc) throw new HTTPException(404, { message: `log ${id} not found.` })

    const { passthrough, exit } = streamProc(proc)

    let data = ''
    return streamSSE(c, async (stream) => {

      passthrough.on('data',(chunk) => {
        data += chunk.toString('utf8')
      })

      let exited = false

      stream.onAbort(() => {
        consola.info('aborting connection')
        exit()
        stream.close()
        exited = true
      })

      while (true) {
        if(exited) break;
        
        if(data) {
          await stream.writeSSE({ data })
          data = ''
        }

        if(!exited) {
          await stream.sleep(500)
        }
      }

    },async (err, stream) => {
      stream.writeln('An error occurred!')
      console.error(err)
    })
  })
  
  return serve({
    fetch: app.fetch,
    port
  })

}

