const checkboxConsentimento = document.getElementById("aceite-consentimento")
const botaoConsentimento = document.getElementById("continuar-consentimento")
const erroConsentimento = document.getElementById("consentimento-erro")

function obterPedidoAtual() {
  const pedido = localStorage.getItem("pedidoLeituraAtual")
  return pedido ? JSON.parse(pedido) : null
}

botaoConsentimento.addEventListener("click", () => {
  const pedido = obterPedidoAtual()

  if (!pedido) {
    erroConsentimento.textContent = "Nenhum pedido de leitura foi encontrado."
    return
  }

  if (!checkboxConsentimento.checked) {
    erroConsentimento.textContent = "Marque o aceite para continuar."
    return
  }

  pedido.consentimentoAceito = true
  localStorage.setItem("pedidoLeituraAtual", JSON.stringify(pedido))
  window.location.href = "./checkout.html"
})
