import { criarPreReserva, obterDisponibilidade } from "../services/agenda.service.js"

export function consultarDisponibilidade(req, res) {
  const { formato, data } = req.query
  res.json(obterDisponibilidade({ formato, data }))
}

export function criarPreReservaController(req, res) {
  const { leituraId, formato, agendamento } = req.body

  if (!leituraId || !formato || !agendamento) {
    return res.status(400).json({
      erro: "Informe leituraId, formato e agendamento."
    })
  }

  const preReserva = criarPreReserva(req.body)

  res.status(201).json({
    sucesso: true,
    mensagem: "Pré-reserva criada em modo teste.",
    preReserva
  })
}
