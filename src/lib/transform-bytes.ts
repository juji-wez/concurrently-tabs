import { Transform, type TransformCallback } from 'stream';

function formatTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Create a Transform stream that converts Buffer data to string
// adds some data while at it
export class TransformBytes extends Transform {
  
  isError = false
  lastIsClean = true

  constructor(isError: boolean) {

    
    // Call the parent class constructor
    super();
    this.isError = !!isError

  }

  // Implement the _transform method
  _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
    try {
      
      // Convert the chunk (Buffer) to a string
      const stringData = chunk.toString('utf-8').split('\n')
        .map((v,i,a) => {

          const c = v && this.lastIsClean ? `${formatTime(new Date())}|${this.isError?'1':'0'}|${v}` : v
          if (i === (a.length -1) && v) this.lastIsClean = false
          else this.lastIsClean = true
          return c

        })
        .join('\n');
      
      this.push(stringData); // Push the transformed data to the readable side
      callback(); // Indicate the transformation is complete
    
    } catch (error: any) {
      callback(error); // Handle errors during transformation
    }
  }
}

