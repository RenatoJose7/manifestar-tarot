const paramsFormulario = new URLSearchParams(window.location.search)
const leituraId = paramsFormulario.get("id")

const tituloFormulario = document.getElementById("formulario-titulo")
const descricaoFormulario = document.getElementById("formulario-descricao")
const formulario = document.getElementById("formulario-leitura")
const camposContainer = document.getElementById("campos-dinamicos")
const formatosContainer = document.getElementById("formatos-sessao")
const formatoAjuda = document.getElementById("formato-ajuda")
const agendaContainer = document.getElementById("agenda-sessoes")
const erroFormulario = document.getElementById("formulario-erro")

let leituraAtual = null
let camposAtuais = []
let formatoSelecionado = "audio"

function dataMinima() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, "0")
  const dia = String(hoje.getDate()).padStart(2, "0")
  return `${ano}-${mes}-${dia}`
}

function dataEhFimDeSemana(data) {
  const dia = new Date(`${data}T12:00:00`).getDay()
  return dia === 0 || dia === 6
}

function formatarFormato(formato) {
  return formato === "audio" ? "Áudio" : "Videochamada"
}

function condicaoAtendida(condition, dados) {
  if (!condition) {
    return true
  }

  const valor = dados[condition.field]?.valor || ""

  if (condition.operator === "==") {
    return valor === condition.value
  }

  if (condition.operator === "!=") {
    return valor !== condition.value
  }

  return true
}

function obterDadosFormulario() {
  const dados = {}

  camposAtuais.forEach((campo) => {
    const wrapper = document.querySelector(`[data-wrapper-campo="${campo.id}"]`)
    const input = document.querySelector(`[data-campo-id="${campo.id}"]`)

    if (!input || wrapper?.hidden) {
      return
    }

    dados[campo.id] = {
      label: campo.label,
      valor: input.value.trim()
    }
  })

  return dados
}

function atualizarCamposCondicionais() {
  const dados = obterDadosFormulario()

  camposAtuais.forEach((campo) => {
    const wrapper = document.querySelector(`[data-wrapper-campo="${campo.id}"]`)
    const input = document.querySelector(`[data-campo-id="${campo.id}"]`)

    if (!wrapper || !input) {
      return
    }

    const visivel = condicaoAtendida(campo.condition, dados)
    wrapper.hidden = !visivel
    input.required = Boolean(campo.required && visivel)

    if (!visivel) {
      input.value = ""
    }
  })
}

function criarCampo(campo) {
  const obrigatorio = campo.required ? "required" : ""
  let controle = ""

  if (campo.type === "textarea") {
    controle = `<textarea id="${campo.id}" data-campo-id="${campo.id}" ${obrigatorio}></textarea>`
  } else if (campo.type === "select") {
    controle = `
      <select id="${campo.id}" data-campo-id="${campo.id}" ${obrigatorio}>
        <option value="">Selecione</option>
        ${(campo.options || []).map((opcao) => `<option value="${opcao}">${opcao}</option>`).join("")}
      </select>
    `
  } else {
    controle = `<input id="${campo.id}" data-campo-id="${campo.id}" type="${campo.type}" ${obrigatorio}>`
  }

  return `
    <div class="campo-formulario" data-wrapper-campo="${campo.id}">
      <label for="${campo.id}">${campo.label}${campo.required ? " *" : ""}</label>
      ${controle}
    </div>
  `
}

function renderizarCampos() {
  camposContainer.innerHTML = camposAtuais.map(criarCampo).join("")

  camposContainer.querySelectorAll("[data-campo-id]").forEach((campo) => {
    campo.addEventListener("input", atualizarCamposCondicionais)
    campo.addEventListener("change", atualizarCamposCondicionais)
  })

  atualizarCamposCondicionais()
}

function renderizarFormatos() {
  formatosContainer.innerHTML = leituraAtual.formatosDisponiveis
    .map((formato) => {
      const selecionado = formato === formatoSelecionado ? "is-selected" : ""
      const checked = formato === formatoSelecionado ? "checked" : ""

      return `
        <label class="formato-card ${selecionado}">
          <input type="radio" name="formato" value="${formato}" ${checked}>
          <strong>${formatarFormato(formato)}</strong>
        </label>
      `
    })
    .join("")

  formatosContainer.querySelectorAll("input[name='formato']").forEach((input) => {
    input.addEventListener("change", () => {
      formatoSelecionado = input.value
      renderizarFormatos()
      renderizarAgenda()
    })
  })

  formatoAjuda.textContent =
    formatoSelecionado === "audio"
      ? "Áudio: escolha apenas o dia. Existe limite de 4 leituras por dia."
      : "Videochamada: escolha dia útil e um horário disponível."
}

function criarSessao(numero) {
  const horario =
    formatoSelecionado === "videochamada"
      ? `
        <div class="sessao-campo">
          <label for="horario-sessao-${numero}">Horário</label>
          <select id="horario-sessao-${numero}" data-horario-sessao="${numero}">
            <option value="">Selecione a data primeiro</option>
          </select>
        </div>
      `
      : ""

  return `
    <article class="sessao-card" data-sessao="${numero}">
      <h3>Sessão ${numero}</h3>
      <div class="sessao-campos">
        <div class="sessao-campo">
          <label for="data-sessao-${numero}">Dia</label>
          <input id="data-sessao-${numero}" data-data-sessao="${numero}" type="date" min="${dataMinima()}">
        </div>
        ${horario}
      </div>
      <p class="texto-ajuda" data-disponibilidade="${numero}"></p>
    </article>
  `
}

async function atualizarDisponibilidade(numero) {
  const dataInput = document.querySelector(`[data-data-sessao="${numero}"]`)
  const horarioSelect = document.querySelector(`[data-horario-sessao="${numero}"]`)
  const mensagem = document.querySelector(`[data-disponibilidade="${numero}"]`)
  const data = dataInput?.value

  if (!data) {
    if (horarioSelect) {
      horarioSelect.innerHTML = `<option value="">Selecione a data primeiro</option>`
    }

    mensagem.textContent = ""
    return
  }

  if (dataEhFimDeSemana(data)) {
    mensagem.textContent = "Sábado e domingo estão indisponíveis."

    if (horarioSelect) {
      horarioSelect.innerHTML = `<option value="">Dia indisponível</option>`
    }

    return
  }

  try {
    const disponibilidade = await consultarDisponibilidade(formatoSelecionado, data)

    if (formatoSelecionado === "audio") {
      mensagem.textContent = `${disponibilidade.mensagem} Reservas no dia: ${disponibilidade.reservasNoDia || 0}/4.`
      return
    }

    const horarios = disponibilidade.horarios || []
    horarioSelect.innerHTML = horarios.length
      ? `<option value="">Selecione</option>${horarios.map((horario) => `<option value="${horario}">${horario}</option>`).join("")}`
      : `<option value="">Sem horários disponíveis</option>`
    mensagem.textContent = disponibilidade.mensagem
  } catch (erro) {
    mensagem.textContent = "Não foi possível consultar a disponibilidade agora."
  }
}

function renderizarAgenda() {
  const totalSessoes = leituraAtual.sessoes || 1
  agendaContainer.innerHTML = Array.from({ length: totalSessoes }, (_, index) =>
    criarSessao(index + 1)
  ).join("")

  agendaContainer.querySelectorAll("[data-data-sessao]").forEach((input) => {
    input.addEventListener("change", () => atualizarDisponibilidade(input.dataset.dataSessao))
  })
}

function validarFormulario() {
  erroFormulario.textContent = ""
  const dados = obterDadosFormulario()

  for (const campo of camposAtuais) {
    const wrapper = document.querySelector(`[data-wrapper-campo="${campo.id}"]`)
    const visivel = !wrapper?.hidden

    if (campo.required && visivel && !dados[campo.id]?.valor) {
      erroFormulario.textContent = `Preencha: ${campo.label}.`
      return null
    }
  }

  const sessoes = [...agendaContainer.querySelectorAll("[data-sessao]")].map((sessao) => {
    const numero = sessao.dataset.sessao
    const data = sessao.querySelector(`[data-data-sessao="${numero}"]`)?.value
    const horario = sessao.querySelector(`[data-horario-sessao="${numero}"]`)?.value || ""

    return {
      numero: Number(numero),
      formato: formatoSelecionado,
      data,
      horario
    }
  })

  for (const sessao of sessoes) {
    if (!sessao.data) {
      erroFormulario.textContent = "Selecione o dia de todas as sessões."
      return null
    }

    if (dataEhFimDeSemana(sessao.data)) {
      erroFormulario.textContent = "Escolha apenas dias de segunda a sexta."
      return null
    }

    if (formatoSelecionado === "videochamada" && !sessao.horario) {
      erroFormulario.textContent = "Selecione o horário de todas as videochamadas."
      return null
    }
  }

  if (sessoes.length > 1) {
    const dias = sessoes.map((sessao) => sessao.data)
    const diasUnicos = new Set(dias)

    if (diasUnicos.size !== dias.length) {
      erroFormulario.textContent = "No Completão, escolha dias diferentes para cada sessão."
      return null
    }
  }

  return {
    dados,
    sessoes
  }
}

async function enviarFormulario(evento) {
  evento.preventDefault()
  const validacao = validarFormulario()

  if (!validacao) {
    return
  }

  const pedido = {
    leituraId: leituraAtual.id,
    leituraNome: leituraAtual.nome,
    categoria: leituraAtual.categoria,
    preco: leituraAtual.preco,
    formato: formatoSelecionado,
    dadosFormulario: validacao.dados,
    agendamento: {
      status: "pendente_pagamento",
      sessoes: validacao.sessoes
    },
    consentimentoAceito: false
  }

  try {
    const preReserva = await criarPreReserva(pedido)
    pedido.preReserva = preReserva.preReserva
  } catch (erro) {
    pedido.preReserva = null
  }

  localStorage.setItem("pedidoLeituraAtual", JSON.stringify(pedido))
  window.location.href = "./consentimento.html"
}

async function carregarFormulario() {
  if (!leituraId) {
    erroFormulario.textContent = "Leitura não informada."
    return
  }

  try {
    const resposta = await buscarCamposDaLeitura(leituraId)
    leituraAtual = resposta.leitura
    camposAtuais = resposta.campos
    formatoSelecionado = leituraAtual.formatosDisponiveis[0] || "audio"

    tituloFormulario.textContent = leituraAtual.nome
    descricaoFormulario.textContent = "Responda as informações necessárias para esta leitura."

    renderizarCampos()
    renderizarFormatos()
    renderizarAgenda()
  } catch (erro) {
    erroFormulario.textContent = "Não foi possível carregar o formulário."
  }
}

formulario.addEventListener("submit", enviarFormulario)
document.addEventListener("DOMContentLoaded", carregarFormulario)
