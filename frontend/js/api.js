const API_URL = "http://localhost:3000"

async function requisitarApi(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, opcoes)
  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao comunicar com a API.")
  }

  return dados
}

async function buscarLeituras() {
  return requisitarApi("/leituras")
}

async function buscarLeituraPorId(id) {
  return requisitarApi(`/leituras/${id}`)
}

async function buscarCamposDaLeitura(id) {
  return requisitarApi(`/leituras/${id}/campos`)
}

async function consultarDisponibilidade(formato, data) {
  return requisitarApi(`/agendamentos/disponibilidade?formato=${formato}&data=${data}`)
}

async function criarPreReserva(payload) {
  return requisitarApi("/agendamentos/pre-reserva", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
}

async function criarPedido(payload) {
  return requisitarApi("/pedidos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
}

async function validarCupom(codigo, subtotal, tipoPedido = "leituras") {
  return requisitarApi("/cupons/validar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ codigo, subtotal, tipoPedido })
  })
}
