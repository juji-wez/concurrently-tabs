import { parseCommandLine } from "./lib/parse-command-line.js";
import { runCommands } from "./lib/run-commands.js";
import { consola } from "consola";
import { unlinkSync } from "fs";
import getPort from "get-port";
import { server } from './server.js'
import { addExitCallback } from 'catch-exit';
import { addMem } from "./lib/memory.js";

const params = parseCommandLine()

consola.info('Running commands')
const procs = runCommands(params)
addMem('args', procs.map(v => v.arg))

const port = await getPort({port: [5420, 6420, 7420]})

const app = server({ port, procs })
consola.info(`dev console at http://localhost:${port}`)

async function onExit(){
  consola.info('exiting...')
	procs.map(v => v.subProcess && v.subProcess.kill('SIGTERM'))
  procs.map(v => unlinkSync(v.filename))
  app.close()
  consola.info('exit task done')
	process.exit()
}

addExitCallback((signal) => {
  onExit()
})

// await open(`http://localhost:${port}`)
