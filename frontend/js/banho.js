const detalheBanho = document.getElementById("detalhe-banho")

function obterBanhoIdDaUrl() {
  return new URLSearchParams(window.location.search).get("id")
}

function montarMensagemPedido(banho, quantidade) {
  return [
    "Olá, Paola! Vim pelo site Manifestar Tarot.",
    `Tenho interesse no ${banho.nome}.`,
    `Quantidade: ${quantidade}.`,
    "Pode me passar o valor, frete e próximos passos?"
  ].join("\n")
}

function atualizarResumoPedido(banho) {
  const quantidadeInput = document.getElementById("quantidade-banho")
  const quantidadeResumo = document.getElementById("resumo-quantidade")
  const botaoPedido = document.getElementById("botao-pedido-banho")
  const quantidade = Math.max(Number(quantidadeInput?.value || 1), 1)

  if (quantidadeResumo) {
    quantidadeResumo.textContent = `${quantidade} kit${quantidade > 1 ? "s" : ""}`
  }

  if (botaoPedido) {
    const texto = montarMensagemPedido(banho, quantidade)
    botaoPedido.href = `https://wa.me/5511976507194?text=${encodeURIComponent(texto)}`
  }
}

function renderizarBanho(banho) {
  const composicao = banho.ingredientes.length
    ? `
      <section class="banho-card-detalhe">
        <h2>Composição do banho</h2>
        <ul class="ingredientes-lista">
          ${banho.ingredientes.map((ingrediente) => `<li>${ingrediente}</li>`).join("")}
        </ul>
      </section>
    `
    : ""

  detalheBanho.innerHTML = `
    <div class="banho-topo">
      <p class="section-kicker">${banho.categoria}</p>
      <h1>${banho.nome}</h1>
      <p class="banho-descricao">${banho.descricao}</p>
      ${banho.forca ? `<p class="banho-forca">${banho.forca}</p>` : ""}
    </div>

    <div class="banho-grid">
      ${composicao}

      <aside class="banho-card-detalhe pedido-box">
        <p>Pedido</p>
        <h2>Detalhamento</h2>

        <label class="quantidade-campo" for="quantidade-banho">
          Quantidade
          <input id="quantidade-banho" type="number" min="1" value="1">
        </label>

        <div class="pedido-resumo">
          <div>
            <span>Produto</span>
            <strong>${banho.nome}</strong>
          </div>
          <div>
            <span>Quantidade</span>
            <strong id="resumo-quantidade">1 kit</strong>
          </div>
          <div>
            <span>Valor</span>
            <strong>A confirmar</strong>
          </div>
          <div>
            <span>Entrega</span>
            <strong>Frete a calcular</strong>
          </div>
        </div>

        <a id="botao-pedido-banho" class="botao-principal" href="#" target="_blank" rel="noopener noreferrer">
          Solicitar pedido
        </a>

        <p class="pedido-observacao">
          O cálculo de frete e pagamento será integrado em uma próxima etapa.
        </p>
      </aside>
    </div>
  `

  const quantidadeInput = document.getElementById("quantidade-banho")
  quantidadeInput?.addEventListener("input", () => atualizarResumoPedido(banho))
  atualizarResumoPedido(banho)
}

function carregarBanho() {
  const id = obterBanhoIdDaUrl()
  const banho = buscarBanhoPorId(id)

  if (!banho) {
    detalheBanho.innerHTML = `<p class="estado-pagina">Banho não encontrado.</p>`
    return
  }

  renderizarBanho(banho)
}

document.addEventListener("DOMContentLoaded", carregarBanho)
