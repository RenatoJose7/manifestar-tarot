export function criarPedido(req, res) {
  const { leituraId, formato, dadosFormulario, agendamento, consentimento, valor } = req.body

  if (!leituraId || !formato || !dadosFormulario || !agendamento || !consentimento || !valor) {
    return res.status(400).json({
      erro: "Pedido incompleto. Envie leituraId, formato, dadosFormulario, agendamento, consentimento e valor."
    })
  }

  const pedido = {
    id: `pedido_${Date.now()}`,
    leituraId,
    formato,
    dadosFormulario,
    agendamento,
    consentimento,
    valor,
    statusPagamento: "teste_sem_pagamento_real",
    criadoEm: new Date().toISOString()
  }

  res.status(201).json({
    sucesso: true,
    mensagem: "Pedido recebido em modo teste",
    pedido
  })
}
