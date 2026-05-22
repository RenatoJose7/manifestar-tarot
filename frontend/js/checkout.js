const resumoPedido = document.getElementById("resumo-pedido")
const subtotalPedido = document.getElementById("subtotal-pedido")
const descontoPedido = document.getElementById("desconto-pedido")
const totalPedido = document.getElementById("total-pedido")
const cupomCodigo = document.getElementById("cupom-codigo")
const aplicarCupom = document.getElementById("aplicar-cupom")
const cupomMensagem = document.getElementById("cupom-mensagem")
const finalizarPagamento = document.getElementById("finalizar-pagamento")
const pagamentoMensagem = document.getElementById("pagamento-mensagem")

let pedidoAtual = null
let descontoAtual = 0
let totalAtual = 0

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor)
}

function formatarFormato(formato) {
  return formato === "audio" ? "Áudio" : "Videochamada"
}

function obterPedidoAtual() {
  const pedido = localStorage.getItem("pedidoLeituraAtual")
  return pedido ? JSON.parse(pedido) : null
}

function renderizarTotais() {
  const subtotal = Number(pedidoAtual?.preco || 0)
  totalAtual = Math.max(subtotal - descontoAtual, 0)
  subtotalPedido.textContent = formatarMoeda(subtotal)
  descontoPedido.textContent = formatarMoeda(descontoAtual)
  totalPedido.textContent = formatarMoeda(totalAtual)
}

function renderizarResumo() {
  const respostas = Object.values(pedidoAtual.dadosFormulario || {})
    .map(
      (resposta) => `
        <div class="resumo-item">
          <span>${resposta.label}</span>
          <strong>${resposta.valor || "-"}</strong>
        </div>
      `
    )
    .join("")

  const agenda = (pedidoAtual.agendamento?.sessoes || [])
    .map(
      (sessao) => `
        <div class="resumo-item">
          <span>Sessão ${sessao.numero}</span>
          <strong>${sessao.data}${sessao.horario ? ` às ${sessao.horario}` : ""}</strong>
        </div>
      `
    )
    .join("")

  resumoPedido.innerHTML = `
    <h2>${pedidoAtual.leituraNome}</h2>
    <div class="resumo-lista">
      <div class="resumo-item">
        <span>Categoria</span>
        <strong>${pedidoAtual.categoria}</strong>
      </div>
      <div class="resumo-item">
        <span>Formato</span>
        <strong>${formatarFormato(pedidoAtual.formato)}</strong>
      </div>
      <div class="resumo-item">
        <span>Status</span>
        <strong>Pré-reserva pendente de pagamento</strong>
      </div>
    </div>

    <div class="resumo-secao">
      <h2>Agenda</h2>
      <div class="agenda-lista">${agenda}</div>
    </div>

    <div class="resumo-secao">
      <h2>Respostas</h2>
      <div class="respostas-lista">${respostas}</div>
    </div>
  `

  renderizarTotais()
}

async function aplicarCupomNoPedido() {
  cupomMensagem.textContent = ""
  descontoAtual = 0

  if (!cupomCodigo.value.trim()) {
    cupomMensagem.textContent = "Digite um cupom para aplicar."
    renderizarTotais()
    return
  }

  try {
    const resultado = await validarCupom(cupomCodigo.value, pedidoAtual.preco, "leituras")
    descontoAtual = resultado.desconto || 0
    cupomMensagem.textContent = resultado.mensagem
  } catch (erro) {
    cupomMensagem.textContent = "Não foi possível validar o cupom."
  }

  renderizarTotais()
}

async function finalizarPedidoTeste() {
  pagamentoMensagem.textContent = ""

  if (!pedidoAtual.consentimentoAceito) {
    pagamentoMensagem.textContent = "O consentimento precisa ser aceito antes do pagamento."
    return
  }

  try {
    const resposta = await criarPedido({
      leituraId: pedidoAtual.leituraId,
      formato: pedidoAtual.formato,
      dadosFormulario: pedidoAtual.dadosFormulario,
      agendamento: pedidoAtual.agendamento,
      consentimento: pedidoAtual.consentimentoAceito,
      valor: {
        subtotal: pedidoAtual.preco,
        desconto: descontoAtual,
        total: totalAtual
      }
    })

    pagamentoMensagem.textContent = `${resposta.mensagem}. Pagamento será integrado com Mercado Pago depois.`
  } catch (erro) {
    pagamentoMensagem.textContent = "Pagamento será integrado com Mercado Pago depois."
  }
}

function iniciarCheckout() {
  pedidoAtual = obterPedidoAtual()

  if (!pedidoAtual) {
    resumoPedido.innerHTML = `<p>Nenhum pedido encontrado. Volte para a lista de leituras e escolha um método.</p>`
    finalizarPagamento.disabled = true
    return
  }

  renderizarResumo()
}

aplicarCupom.addEventListener("click", aplicarCupomNoPedido)
finalizarPagamento.addEventListener("click", finalizarPedidoTeste)
document.addEventListener("DOMContentLoaded", iniciarCheckout)
