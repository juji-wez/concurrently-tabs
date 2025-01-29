import type { ArgsObject } from '../lib/types.js'


export const content = ({ args }:{ args: ArgsObject[] }) => {
  
  return `<main>
        <nav>
          ${args.map((v,i) => {
            return `<button class="arg" 
              data-name="${v.name}"
              data-cmd="${v.cmd}" 
              data-index="${i}">${v.name || v.cmd}</button>`
          }).join('')}
          <button class="all">All</button>
        </nav>
        <div class="content"></div>
      </main>`
}