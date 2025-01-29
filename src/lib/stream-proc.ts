
import { createReadStream, type ReadStream } from "fs";
import type { Proc } from "./run-commands.js";
import { PassThrough } from "stream";
import { watch } from "chokidar";

export function streamProc(proc: Proc ){

  let bytesRead = 0
  const passthrough = new PassThrough()
  let active: ReadStream | null = null;
  let ended = false

  function onEnd(){
    if(ended) return;

    const watcher = watch(proc.filename, {
      persistent: true,
      ignoreInitial: true
    })

    watcher.on('change',() => {
      if(ended) return;
      watcher.close()
      createStream()
    })
  }
  
  function createStream(){
    if(ended) return;

    active = createReadStream(proc.filename, { start: bytesRead })
    active.on('end',() => {
      if(!active) return;
      bytesRead += active.bytesRead
      active = null
      onEnd()
    })

    active.pipe(passthrough,{ end: false })

  }

  createStream()


  // on exit
  return {
    passthrough,
    exit: () => {
      ended = true
      if(active) active.close()
      if(passthrough) passthrough.end()
    }
  }

  

}
