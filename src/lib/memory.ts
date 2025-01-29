


let mem: {[key: string]: any} = {}

export function addMem( address: string, item: any ){
  mem[address] = item
}

export function getMem( address: string ){
  return mem[ address ] || null
}