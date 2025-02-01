import { AnsiUp } from '/static/ansi_up.js'


export function connect( store ){

  const connected = {}
  const ansi_up = new AnsiUp();

  store.addListener(( indexes ) => {

    indexes.forEach( index => {

      if(connected[`${index}`]) return;

      const evtSource = new EventSource(`/log/${index}`); 
      connected[`${index}`] = evtSource

      evtSource.onerror = (event) => {
        console.error(event)
      };

      evtSource.onmessage = (event) => {
        
        let lastType = ''
        let lastTime = ''
        event.data.split('\n').forEach(v => {
          const [ time, type, ...rest ] = v.split('|')

          if(time && !type) {
            document.dispatchEvent(new CustomEvent(`c-tabs-leftover[${index}]`,{
              detail: {
                leftover: time
              }
            }))
          }

          else if(time && type){

            document.dispatchEvent(new CustomEvent(`c-tabs-row[${index}]`,{
              detail: {
                row: `<div class="text-data ${type === '1'?'error':''}">
                  <div class="text-data-time ${lastTime === time && lastType === type?'trns':''}">${time}</div>
                  <div class="text-data-content"><pre>${ansi_up.ansi_to_html(rest.join('|'))}</pre></div>
                </div>`
              }
            }))

            lastType = type
            lastTime = time
          }

        })

      }

    })

    // remove unused
    Object.keys(connected).forEach((index) => {
      if(!indexes.includes(index*1)){
        const evtSource = connected[`${index}`]
        evtSource.close()
        delete connected[`${index}`]
      }
    })

  })
  // const evtSource = new EventSource('/sse');



}