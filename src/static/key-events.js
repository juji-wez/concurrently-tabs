

let defaultSize = 0.7;
let currentSize = 0.7;

function largerFont(){
  currentSize += .05
  document.querySelector('.content').style.setProperty('--font-size', `${currentSize}rem`)
  localStorage.setItem("currentSize", `${currentSize}`);
}

function smallerFont(){
  currentSize -= .05
  document.querySelector('.content').style.setProperty('--font-size', `${currentSize}rem`)
  localStorage.setItem("currentSize", `${currentSize}`);
}

function reset(){
  currentSize = defaultSize
  document.querySelector('.content').style.setProperty('--font-size', `${currentSize}rem`)
  localStorage.setItem("currentSize", `${currentSize}`);
}

function setSize(n){
  currentSize = n
  document.querySelector('.content').style.setProperty('--font-size', `${currentSize}rem`)
  localStorage.setItem("currentSize", `${n}`);
}

export function keyEvents(){

  const size = localStorage.getItem("currentSize");
  if(size && Number(size)){
    console.log('setting size', size)
    setSize(Number(size))
  }

  document.addEventListener('keyup',(e) => {

    const keyName = e.key
    const ctrl = e.ctrlKey

    if(ctrl && (keyName === '=' || keyName === '+')){
      largerFont()
    }

    if(ctrl && (keyName === '-')){
      smallerFont()
    }

    if(ctrl && (keyName === '0')){
      reset()
    }

  })

}