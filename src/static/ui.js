
let data = {}

function setGrid( num, htmlElm ){

  // const width = window.innerWidth
  // const height = window.innerHeight
  let rowcol = null;

  if(num === 1){
    rowcol = { row: 1, col: 1 }
  }

  if(num === 2){
    rowcol = { row: 1, col: 2 }
  }

  if(num > 2){
    rowcol = { row: Math.ceil(num/2), col: 2 }
  }

  if(!rowcol)
    htmlElm.setAttribute('style', [
      `--grid-cols: 1fr`,
      `--grid-rows: 1fr`
    ].join(';'));
  else
    htmlElm.setAttribute('style', [
      `--grid-cols: ${[...new Array(rowcol.col)].map(_ => '1fr').join(' ')}`,
      `--grid-rows: ${[...new Array(rowcol.row)].map(_ => '1fr').join(' ')}`
    ].join(';'));

}

export function ui( store ){

  const content = document.querySelector('.content')

  store.addListener(( active ) => {

    // set grid
    setGrid( active.length, content )

    // remove 
    Object.keys(data).forEach((index) => {
      if(!active.includes(index*1)){

        data[`${index}`].listenLeftOver && 
          document.removeEventListener(
            `c-tabs-leftover[${index}]`, 
            data[`${index}`].listenLeftOver
          );
        
        data[`${index}`].listenIncoming && 
          document.removeEventListener(
            `c-tabs-row[${index}]`, 
            data[`${index}`].listenIncoming
          );
        
        data[`${index}`].clusterize && 
          data[`${index}`].clusterize.destroy();
        
        document.querySelector(`.text-scroll[data-index="${index}"]`).remove()

        data[`${index}`].observer && 
          data[`${index}`].observer.disconnect();

        delete data[`${index}`]

      }
    })

    active.forEach( v => {

      if(data[`${v}`]) return;

      // add elems
      const s = document.createElement('div')
      s.dataset.index = v
      s.classList.add('text-scroll')

      const c = document.createElement('div')
      c.classList.add('text-content')
      s.appendChild(c)

      content.appendChild(s)
      
      let scrolled = false
      let _dato
      function onDataAdded(){
        if(scrolled) return;
        if(_dato) clearTimeout(_dato)
          _dato = setTimeout(() => {
          const maxScrollTop = s.scrollHeight - s.clientHeight;
          s.scrollTo({
            top: maxScrollTop,
            behavior: 'smooth'
          })
        },50)
      }

      // incoming data
      function listenIncoming(e){
        data[`${v}`].clusterize.append([e.detail.row])
        onDataAdded()
      }

      function listenLeftOver(e){
        console.log('ohoh, a leftover: ', e.detail.leftover)
      }

      data[`${v}`] = { 
        listenLeftOver, 
        listenIncoming, 
        clusterize: new Clusterize({
          scrollElem: s,
          contentElem: c,
        })
      }

      document.addEventListener(`c-tabs-leftover[${v}]`, listenLeftOver)
      document.addEventListener(`c-tabs-row[${v}]`, listenIncoming)

      // on scroll handler
      let _scto;
      s.addEventListener('scroll',() => {
        if(_scto) clearTimeout(_scto)
        const maxScrollTop = s.scrollHeight - s.clientHeight;
        if(s.scrollTop >= maxScrollTop){
          scrolled = false
        }else{
          scrolled = true
          _scto = setTimeout(() => {
            scrolled = false
          },5000)
        }
      })

    })

  })


}