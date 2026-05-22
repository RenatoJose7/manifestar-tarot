import {
  STATUS_AGENDAMENTO,
  agendamentos,
  horariosVideochamada
} from "../data/agendamentos.js"

function criarId(prefixo) {
  return `${prefixo}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function dataEhFimDeSemana(data) {
  const dia = new Date(`${data}T12:00:00`).getDay()
  return dia === 0 || dia === 6
}

function agendamentoAtivo(item) {
  return ![STATUS_AGENDAMENTO.EXPIRADO, STATUS_AGENDAMENTO.CANCELADO].includes(item.status)
}

function normalizarSessoes(agendamento) {
  if (Array.isArray(agendamento?.sessoes)) {
    return agendamento.sessoes
  }

  if (Array.isArray(agendamento)) {
    return agendamento
  }

  if (agendamento?.data) {
    return [agendamento]
  }

  return []
}

export function obterDisponibilidade({ formato, data }) {
  if (!formato || !data) {
    return {
      disponivel: false,
      mensagem: "Informe formato e data."
    }
  }

  if (dataEhFimDeSemana(data)) {
    return {
      disponivel: false,
      mensagem: "Sábado e domingo estão indisponíveis para agendamento.",
      horarios: []
    }
  }

  if (formato === "audio") {
    const reservasNoDia = agendamentos
      .filter(agendamentoAtivo)
      .flatMap((item) => normalizarSessoes(item.agendamento))
      .filter((sessao) => sessao.data === data && sessao.formato === "audio").length

    return {
      formato,
      data,
      limitePorDia: 4,
      reservasNoDia,
      disponivel: reservasNoDia < 4,
      mensagem: "Áudio não precisa de horário. Escolha apenas o dia."
    }
  }

  if (formato === "videochamada") {
    const horariosOcupados = agendamentos
      .filter(agendamentoAtivo)
      .flatMap((item) => normalizarSessoes(item.agendamento))
      .filter((sessao) => sessao.data === data && sessao.formato === "videochamada")
      .map((sessao) => sessao.horario)

    const horarios = horariosVideochamada.filter((horario) => !horariosOcupados.includes(horario))

    return {
      formato,
      data,
      disponivel: horarios.length > 0,
      horarios,
      mensagem: "Horários mockados para videochamada."
    }
  }

  return {
    disponivel: false,
    mensagem: "Formato inválido."
  }
}

export function criarPreReserva(dados) {
  const preReserva = {
    id: criarId("pre_reserva"),
    leituraId: dados.leituraId,
    formato: dados.formato,
    dadosFormulario: dados.dadosFormulario || {},
    agendamento: dados.agendamento,
    status: STATUS_AGENDAMENTO.PENDENTE_PAGAMENTO,
    criadoEm: new Date().toISOString()
  }

  agendamentos.push(preReserva)

  return preReserva
}
