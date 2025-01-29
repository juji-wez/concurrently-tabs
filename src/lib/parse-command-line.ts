import type { ArgsObject } from "./types.js";

export function parseCommandLine(){

  let args: string[] = process.argv.slice(2)
  const isHelp = args.find(v => v === '-h' || v === '--help') || args.length === 0
  
  if(isHelp){
    console.log(
`
help
----

  About:
    concurrently, but sends the output to a browser

  Usage:
    concurrently-tabs [...commands]

  Example:
    concurrently-tabs 'ls -la .' 'echo "asdf"' '[list]:ls -la'

    '[list]:ls -la' will be shown as 'list' in the tab, and it will run 'ls -la'
  
  Keyboard Shortcuts:
    [ctrl=] or [ctrl+] Zoom In
    [ctrl-] Zoom Out
    [ctrl0] normalize
`
    )
  
    process.exit();
  }


  const argsObjs = args.map(v => {
    const split = v.split(']:')
    return split.length === 1 && !split[0].match(/^\[/) ? {
      name: '',
      cmd: split.join(']:') || ''
    } : split[0] && split[0].match(/^\[/) && split[1] ? {
      name: split[0].substring(1),
      cmd: split.slice(1).join(']:')
    } : null
  }).filter(v => v) as ArgsObject[]

  return argsObjs

}
