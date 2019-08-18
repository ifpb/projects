const card = document.querySelector('.container-row')
const getJson = '.disciplinas'
const inputs = Array.from(document.querySelectorAll('input'))


fetch('data/disciplinas.json')
    .then(res => res.json())
    .then(json => {
        jsoncar = json
        criar(json)
        const button = document.querySelector('.btn1')
        const button2 = document.querySelector('.btn2')
        const button3 = document.querySelector('.btn3')
        const button4 = document.querySelector('.btn4')
        const button5 = document.querySelector('.btn5')
        const button6 = document.querySelector('.btn6')
        button.addEventListener('click', ()=>{filtrar(json)})
        button2.addEventListener('click', ()=>{filtrar2(json)})
        button3.addEventListener('click', ()=>{filtrar3(json)})
        button4.addEventListener('click', ()=>{filtrar4(json)})
        button5.addEventListener('click', ()=>{filtrar5(json)})
        button6.addEventListener('click', ()=>{filtrar6(json)})


        // const filtro_periodo = periodo => jsoncar.filter(p => p.periodo = periodo)
        
    })
    .catch(erro => error())

function error(){
    alert('ERRO')
}


inputs.map(i => {
    i.addEventListener('keyup', () => {
        filtrar(...inputs.map(i => i.value || ''))
    })
})

function filtrar (periodo){
    const filtro = disciplinas.filter(i => {
        return i.periodo >= periodo
  
    })
    exibiri(filtro)
}



function exibiri(project){
    view.innerHTML = ''
    project.map(i => view.insertAdjacentHTML('beforeend', criar(i)))
}


function criar(cards){
    const view = cards
        .map(i => exibir(i))
        .join('')
    card.innerHTML = view
}

function filtrar(cards) {
    const view = cards
        .filter(c=> c.periodo == 1)
        .map(i => exibir(i))
        .join('')
    card.innerHTML = view
}
function filtrar2(cards) {
    const view = cards
        .filter(c=> c.periodo == 2)
        .map(i => exibir(i))
        .join('')
    card.innerHTML = view
}
function filtrar3(cards) {
    const view = cards
        .filter(c=> c.periodo == 3)
        .map(i => exibir(i))
        .join('')
    card.innerHTML = view
}
function filtrar4(cards) {
    const view = cards
        .filter(c=> c.periodo == 4)
        .map(i => exibir(i))
        .join('')
    card.innerHTML = view
}
function filtrar5(cards) {
    const view = cards
        .filter(c=> c.periodo == 5)
        .map(i => exibir(i))
        .join('')
    card.innerHTML = view
}
function filtrar6(cards) {
    const view = cards
        .filter(c=> c.periodo == 6)
        .map(i => exibir(i))
        .join('')
    card.innerHTML = view
}

function exibir(dis){
    const div = `<div class="card card-body m-1" style="width: 18rem;">
    <div class="card-body/*">
      <h5 class="card-title">${dis.nome}</h5>
      <p class="card-text" style="margin-bottom: 0">Código: ${dis.cod}</p>
      <p class="card-text" style="margin-bottom: 0">Período: ${dis.periodo}</p>
      <p class="card-text" style="margin-bottom: 0">Requisito: ${dis.requisito}</p>
      <p class="card-text" style="margin-bottom: 0">Carga Horária Total: ${dis.cht}</p>
      <p class="card-text" style="margin-bottom: 0">Carga Horárial Semana: ${dis.chs}</p>
      <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
      <button class="btn btn-outline-secondary" type="button">Aprovado</button>
      <button class="btn btn-outline-secondary" type="button">Cursando</button>
      <button class="btn btn-outline-secondary" type="button">Reprovado</button>
    </div>
  </div>`
  return div
}