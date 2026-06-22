const listaBanhos = document.getElementById("lista-banhos")

function renderizarBanhos() {
  if (!listaBanhos) {
    return
  }

  listaBanhos.innerHTML = banhosEnergeticos
    .map((banho) => `
      <article class="banho-card">
        <p class="banho-card-categoria">${banho.categoria}</p>
        <h2>${banho.nome}</h2>
        <p>${banho.descricao}</p>
        <a class="botao-principal" href="./banho.html?id=${banho.id}">Ver detalhes</a>
      </article>
    `)
    .join("")
}

document.addEventListener("DOMContentLoaded", renderizarBanhos)
