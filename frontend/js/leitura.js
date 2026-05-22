const detalheLeitura = document.getElementById("detalhe-leitura")

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor)
}

function formatarFormato(formato) {
  return formato === "audio" ? "Áudio" : "Videochamada"
}

function obterIdDaUrl() {
  return new URLSearchParams(window.location.search).get("id")
}

function renderizarLeitura(leitura) {
  const observacao = leitura.observacao
    ? `<p class="observacao"><strong>Observação:</strong> ${leitura.observacao}</p>`
    : ""

  detalheLeitura.innerHTML = `
    <div class="leitura-topo">
      <p class="section-kicker">${leitura.categoria}</p>
      <h1>${leitura.nome}</h1>
      <p class="leitura-descricao">${leitura.descricao}</p>
      ${observacao}
    </div>

    <div class="leitura-grid">
      <section class="leitura-card">
        <h2>Tópicos</h2>
        <ul class="topicos-lista">
          ${leitura.topicos.map((topico) => `<li>${topico}</li>`).join("")}
        </ul>
      </section>

      <aside class="leitura-card preco-box">
        <p>Valor</p>
        <p class="preco">${formatarMoeda(leitura.preco)}</p>
        <p class="duracao">${leitura.duracao}</p>
        <div class="formatos-lista">
          <strong>Formatos disponíveis</strong>
          ${leitura.formatosDisponiveis.map((formato) => `<span>${formatarFormato(formato)}</span>`).join("")}
        </div>
        <a class="botao-principal" href="./formulario.html?id=${leitura.id}">Agendar</a>
      </aside>
    </div>
  `
}

async function carregarLeitura() {
  const id = obterIdDaUrl()

  if (!id) {
    detalheLeitura.innerHTML = `<p class="estado-pagina">Leitura não informada.</p>`
    return
  }

  try {
    const leitura = await buscarLeituraPorId(id)
    renderizarLeitura(leitura)
  } catch (erro) {
    detalheLeitura.innerHTML = `<p class="estado-pagina">Leitura não encontrada.</p>`
  }
}

document.addEventListener("DOMContentLoaded", carregarLeitura)
