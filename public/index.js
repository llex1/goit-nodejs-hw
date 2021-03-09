const DOM = {
  btnShowAll: document.querySelector("#show-all"),
  btnClear: document.querySelector("#clear"),
  btnFind: document.querySelector("#find"),
  outField: document.querySelector("#out-field"),
  inputSearch: document.querySelector("#input-search"),
};

document.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "show-all":
      showAll();
      break;
    case "clear":
      clear();
      break;
    case "find":
      find();
      break;
  }
});

async function showAll() {
  const request = await fetch("http://127.0.0.1:8080/contacts", {
    method: "GET",
    mode: "cors",
    header: {
      "Content-Type": "aplication/json",
    },
  });
  const data = await request.json();
  data.forEach((el) => {
    DOM.outField.insertAdjacentHTML(
      "beforeend",
      `<div>${JSON.stringify(el)}</div>`
    );
  });
}

function clear() {
  DOM.outField.innerHTML = "";
  DOM.inputSearch.value = null;
}

async function find() {
  const request = await fetch(
    `http://127.0.0.1:8080/contacts/${DOM.inputSearch.value}`,
    {
      method: "GET",
      mode: "cors",
      header: {
        "Content-Type": "aplication/json",
      },
    }
  );
  DOM.outField.innerHTML = JSON.stringify(await request.json());
}
