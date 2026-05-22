const listaLeituras = document.getElementById("lista-leituras")
const statusLeituras = document.getElementById("leituras-status")

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor)
}

function encurtarTexto(texto, limite = 142) {
  if (!texto || texto.length <= limite) {
    return texto || ""
  }

  return `${texto.slice(0, limite).trim()}...`
}

function renderizarCard(leitura) {
  return `
    <article class="card-leitura-interna">
      <div class="card-simbolo" aria-hidden="true">✦</div>
      <h2>${leitura.nome}</h2>
      <span class="card-categoria">${leitura.categoria}</span>
      <p class="card-descricao">${encurtarTexto(leitura.descricao)}</p>
      <div class="card-meta">
        <span><strong>${formatarMoeda(leitura.preco)}</strong></span>
        <span>${leitura.duracao}</span>
      </div>
      <a class="botao-card" href="./leitura.html?id=${leitura.id}">Saiba mais</a>
    </article>
  `
}

async function carregarLeituras() {
  try {
    const leituras = await buscarLeituras()
    listaLeituras.innerHTML = leituras.map(renderizarCard).join("")
    statusLeituras.textContent = leituras.length ? "" : "Nenhuma leitura encontrada."
  } catch (erro) {
    statusLeituras.textContent = "Não foi possível carregar as leituras. Verifique se o backend está rodando."
  }
}

document.addEventListener("DOMContentLoaded", carregarLeituras)
