/** @jsx jsx */
/** @jsxImportSource hono/jsx */
/** @jsxFrag hono/jsx */

import type { FC } from 'hono/jsx'
import type { ArgsObject } from '../lib/types.js'


export const Content: FC<{ args: ArgsObject[] }> = ({ args }) => {

  return (<>
    <main>
      <nav>
        {args.map((v,i) => {
          return <button class="arg" 
            data-name={v.name} 
            data-cmd={v.cmd} 
            data-index={i}>{v.name || v.cmd}</button>
        })}
        <button class={'all'}>All</button>
      </nav>
      <div class="content"></div>
    </main>
  </>)
}