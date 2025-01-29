import type { ArgsObject } from "./types.js";

export function parseCommandLine(){

  let args: string[] = process.argv.slice(2)
  const isHelp = args.find(v => v === '-h' || v === '--help')
  
  if(isHelp){
    console.log(
`
  Usage
    $ concurrently-tabs [...commands]

  Examples
    $ concurrently-tabs 'ls -la .' 'echo "asdf"'

`
    )
  
    process.exit();
  }


  const argsObjs = args.map(v => {
    const split = v.split(']:')
    return split.length === 1 ? {
      name: '',
      cmd: split[0] || ''
    } : split[0] && split[1] ? {
      name: split[0].substring(1),
      cmd: split[1]
    } : null
  }).filter(v => v) as ArgsObject[]

  return argsObjs

}
