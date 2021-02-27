const DOM = {
  btnShowAll: document.querySelector('#show-all'),
  btnClear: document.querySelector('#clear'),
  outField: document.querySelector('#out-field'),
}

DOM.btnShowAll.addEventListener('click', async (e)=>{
  const request = await fetch('http://127.0.0.1:8080/contacts', {
    method: 'GET',
    mode: 'cors',
    header: {
      'Content-Type':'aplication/json'
    },
  })
  const data = await request.json()
  data.forEach(el => {
    DOM.outField.insertAdjacentHTML('beforeend', `<div>${JSON.stringify(el)}</div>`)
  })
})

DOM.btnClear.addEventListener('click', ()=>{
  DOM.outField.innerHTML = '';
})