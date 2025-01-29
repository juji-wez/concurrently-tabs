import type { ArgsObject } from "./types.js";
import childProcess from 'child_process';
import os from 'os'
import path from "path";
import { createWriteStream } from "fs";
import randomstring from 'randomstring'
import { TransformBytes } from "./transform-bytes.js";
import consola from "consola";

export type Proc = {
  subProcess?: childProcess.ChildProcessWithoutNullStreams,
  filename: string
  arg: ArgsObject
}

export function runCommands(args: ArgsObject[]){

  const procs: Proc[] = []
  const tmp = os.tmpdir()

  args.forEach((arg: ArgsObject) => {

    const main = arg.cmd.split(' ')
		const subProcess = childProcess.spawn(main[0], main.slice(1),  { shell: true, stdio: 'pipe' });
    const filename = path.join(tmp, `ct_${randomstring.generate()}`)
    const writer = createWriteStream(filename)
    const transformBytesOut = new TransformBytes(false)
    const transformBytesErr = new TransformBytes(true)

    consola.info(`running command`)
    consola.info(arg)
    // consola.info(`filename: ${filename}`)
    
		subProcess.stdout.pipe(transformBytesOut).pipe(writer);
		subProcess.stderr.pipe(transformBytesErr).pipe(writer);
		procs.push({
      subProcess,
      filename,
      arg
    })

  })

  return procs

}