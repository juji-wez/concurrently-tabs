
export function buttons(store){

  const btns = document.querySelectorAll('button.arg')
  const allBtn = document.querySelector('button.all')
  let datasets = []

  store.addListener(( indexes ) => {
    btns.forEach(b => b.classList.remove('active'))
    indexes.forEach(
      i => document.querySelector(`button.arg[data-index="${i}"]`)
          .classList.add('active')
    )
  })

  btns.forEach(btn => {

    const idx = btn.dataset.index * 1
    datasets.push(idx)

    btn.addEventListener('click', () => {

      if(store.active.includes(idx)){
        const i = store.active.findIndex(v => v === idx)
        const active = [
          ...store.active.slice(0,i),
          ...store.active.slice(i+1)
        ]
        store.active = active
      }
      else{
        const active = [
          ...store.active,
          idx,
        ]
        store.active = active
      }
    })

  })

  allBtn.addEventListener('click',() => {
    store.active = datasets
  })

  setTimeout(() => {
    btns[1].click()
  },10)

}