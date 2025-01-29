
let data = {}

function setGrid( num, htmlElm ){

  const width = window.innerWidth
  const height = window.innerHeight
  let rowcol = null;

  if(num === 1){
    rowcol = { row: 1, col: 1 }
  }

  if(num === 2){
    rowcol = width < height ? { row: 2, col: 1 } : { row: 1, col: 2 }
  }

  if(num > 2){
    rowcol = width < height ? { row: num, col: 1 } : { row: Math.ceil(num/2), col: 2 }
  }

  if(!rowcol){
    htmlElm.style.setProperty('--grid-cols', '1fr')
    htmlElm.style.setProperty('--grid-rows', '1fr')
    htmlElm.style.setProperty('--grid-col-num', `${rowcol.col}`)
  }

  else{
    htmlElm.style.setProperty('--grid-cols', `${[...new Array(rowcol.col)].map(_ => '1fr').join(' ')}`)
    htmlElm.style.setProperty('--grid-rows', `${[...new Array(rowcol.row)].map(_ => '1fr').join(' ')}`)
    htmlElm.style.setProperty('--grid-col-num', `${rowcol.col}`)
  }

}

function getArg( args, index ){
  const arg = args.find(v => v.index === (index*1))
  return arg
}

export function ui( store ){

  const content = document.querySelector('.content')
  let lastActiveLength = 0
  window.addEventListener('resize',() => {
    lastActiveLength && setGrid( lastActiveLength, content )
  })

  const argElms = document.querySelectorAll('.arg')
  console.log(argElms)
  const args = [...argElms].map(v => {
    return {
      cmd: v.dataset.cmd,
      name: v.dataset.name,
      index: v.dataset.index * 1
    }
  })

  store.addListener(( active ) => {

    lastActiveLength = active.length

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

      const t = document.createElement('div')
      t.classList.add('text-title')
      const arg = getArg( args, v )
      t.innerHTML = arg.name ? arg.name + `<span>${arg.cmd}</span>` : `<span>${arg.cmd}</span>`
      s.appendChild(t)

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