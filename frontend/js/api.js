const API_URL = "http://localhost:3000"

const formatosPadraoMock = ["audio", "videochamada"]

const agendamentoPadraoMock = {
  audio: {
    ativo: true,
    selecionaHorario: false,
    limitePorDia: 4
  },
  videochamada: {
    ativo: true,
    selecionaHorario: true,
    duracaoMinutos: 90
  }
}

const camposMock = {
  nomeCompleto: {
    label: "Nome completo",
    type: "text",
    required: true
  },
  dataNascimento: {
    label: "Data de nascimento",
    type: "date",
    required: true
  },
  statusRelacionamento: {
    label: "Status de relacionamento",
    type: "select",
    required: true,
    options: [
      "Solteira(o)",
      "Namorando",
      "Casada(o)",
      "Ficando",
      "Relacionamento indefinido",
      "Outro"
    ]
  },
  nomePessoa: {
    label: "Nome completo da pessoa",
    type: "text",
    required: true
  },
  nomePessoaCondicional: {
    label: "Nome completo da pessoa",
    type: "text",
    required: false,
    condition: {
      field: "statusRelacionamento",
      operator: "!=",
      value: "Solteira(o)"
    }
  },
  contexto: {
    label: "Breve contexto ou d\u00favida sobre sua situa\u00e7\u00e3o",
    type: "textarea",
    required: true
  },
  trabalhandoAtualmente: {
    label: "Est\u00e1 trabalhando no momento?",
    type: "select",
    required: true,
    options: ["Sim", "N\u00e3o"]
  },
  atuacao: {
    label: "Se sim, qual sua atua\u00e7\u00e3o?",
    type: "text",
    required: false,
    condition: {
      field: "trabalhandoAtualmente",
      operator: "==",
      value: "Sim"
    }
  },
  perguntaObjetiva: {
    label: "Pergunta objetiva",
    type: "textarea",
    required: true
  },
  tipoVenus: {
    label: "No M\u00e9todo V\u00eanus, deseja leitura individual ou de casal?",
    type: "select",
    required: true,
    options: ["Individual", "Casal"]
  }
}

const leiturasMock = [
  {
    id: "jupiter",
    nome: "M\u00e9todo J\u00fapiter",
    categoria: "Leitura Livre",
    preco: 111,
    duracao: "30 a 45 minutos",
    descricao:
      "Est\u00e1 com d\u00favida em rela\u00e7\u00e3o ao que perguntar ao Tarot? Se sim, essa op\u00e7\u00e3o \u00e9 o que voc\u00ea precisa. Nesse m\u00e9todo, iremos perguntar qual mensagem ou direcionamento a espiritualidade gostaria de te dizer no momento. N\u00e3o colocaremos foco em nenhuma \u00e1rea espec\u00edfica, permitindo assim que a mensagem abranja qualquer setor da sua vida.",
    observacao: "",
    topicos: [
      "Aprendizado do momento",
      "Mensagem dos seus mentores espirituais",
      "Pontos de aten\u00e7\u00e3o",
      "Conselho final"
    ],
    campos: ["nomeCompleto", "dataNascimento"],
    formatosDisponiveis: formatosPadraoMock,
    sessoes: 1,
    agendamento: agendamentoPadraoMock
  },
  {
    id: "sol",
    nome: "M\u00e9todo Sol",
    categoria: "Leitura de Autoconhecimento",
    preco: 111,
    duracao: "30 a 45 minutos",
    descricao:
      "Voc\u00ea tem o h\u00e1bito de se observar? Nesse m\u00e9todo, falaremos sobre os principais aspectos da sua ess\u00eancia e da sua alma. Abra-se para descobrir o que as cartas t\u00eam a dizer sobre sua personalidade.",
    observacao: "",
    topicos: [
      "Arcano pessoal",
      "Pontos expansivos da sua ess\u00eancia",
      "Pontos a amadurecer",
      "Conselho final"
    ],
    campos: ["nomeCompleto", "dataNascimento"],
    formatosDisponiveis: formatosPadraoMock,
    sessoes: 1,
    agendamento: agendamentoPadraoMock
  },
  {
    id: "venus-individual",
    nome: "M\u00e9todo V\u00eanus Individual",
    categoria: "Leitura Amorosa",
    preco: 177,
    duracao: "1h a 1h30",
    descricao:
      "Muitas vezes desejamos encontrar a felicidade na vida amorosa mas esquecemos que isso depende da rela\u00e7\u00e3o interna que constru\u00edmos com n\u00f3s mesmos. O M\u00e9todo V\u00eanus Individual ir\u00e1 abordar in\u00fameros aspectos sobre a forma como voc\u00ea se conecta com a vida amorosa.",
    observacao: "",
    topicos: [
      "Aprendizado do momento em rela\u00e7\u00e3o a sua vida amorosa",
      "Energia que est\u00e1 vibrando em rela\u00e7\u00e3o a essa \u00e1rea",
      "Principal bloqueio ou cren\u00e7a limitante",
      "Modifica\u00e7\u00f5es necess\u00e1rias para obter satisfa\u00e7\u00e3o na vida afetiva",
      "Tend\u00eancia para os pr\u00f3ximos 60 dias",
      "Conselho final do Tarot"
    ],
    campos: ["nomeCompleto", "dataNascimento", "statusRelacionamento", "contexto"],
    formatosDisponiveis: formatosPadraoMock,
    sessoes: 1,
    agendamento: agendamentoPadraoMock
  },
  {
    id: "venus-casal",
    nome: "M\u00e9todo V\u00eanus Casal",
    categoria: "Leitura Amorosa",
    preco: 177,
    duracao: "1h a 1h30",
    descricao:
      "An\u00e1lise geral das energias que envolvem sua din\u00e2mica amorosa com algu\u00e9m espec\u00edfico.",
    observacao: "",
    topicos: [
      "Aprendizado amoroso da consulente",
      "Principal bloqueio ou cren\u00e7a limitante",
      "Melhorias necess\u00e1rias",
      "Energia geral da conex\u00e3o",
      "Sentimento, pensamento e inten\u00e7\u00e3o da pessoa em rela\u00e7\u00e3o a voc\u00ea",
      "Energias ocultas entre a din\u00e2mica",
      "Tend\u00eancia para os pr\u00f3ximos 60 dias"
    ],
    campos: ["nomeCompleto", "nomePessoa", "statusRelacionamento", "contexto"],
    formatosDisponiveis: formatosPadraoMock,
    sessoes: 1,
    agendamento: agendamentoPadraoMock
  },
  {
    id: "mercurio",
    nome: "M\u00e9todo Merc\u00fario",
    categoria: "Leitura Profissional",
    preco: 150,
    duracao: "1h a 1h30",
    descricao:
      "An\u00e1lise das energias correspondentes a sua vida profissional ou financeira. O que exatamente est\u00e1 te afastando de onde voc\u00ea quer chegar?",
    observacao: "",
    topicos: [
      "Aprendizado do momento em rela\u00e7\u00e3o a essa \u00e1rea",
      "Principal bloqueio que te afasta do sucesso",
      "Mudan\u00e7a necess\u00e1ria para prosperar no seu neg\u00f3cio ou trabalho",
      "Tend\u00eancia para os pr\u00f3ximos 60 dias",
      "Conselho final do Tarot"
    ],
    campos: ["nomeCompleto", "trabalhandoAtualmente", "atuacao", "contexto"],
    formatosDisponiveis: formatosPadraoMock,
    sessoes: 1,
    agendamento: agendamentoPadraoMock
  },
  {
    id: "completao-tarot",
    nome: "Complet\u00e3o do Tarot",
    categoria: "Energia Amorosa, Profissional e Espiritual",
    preco: 400,
    duracao: "1h por \u00e1rea",
    descricao:
      "Combo correspondente ao M\u00e9todo V\u00eanus, individual ou de casal, M\u00e9todo Merc\u00fario e M\u00e9todo J\u00fapiter.",
    observacao:
      "Como s\u00e3o tr\u00eas m\u00e9todos no total, ser\u00e1 necess\u00e1rio que a pessoa escolha uma leitura por dia, sendo definido a partir da necessidade da consulente.",
    topicos: ["M\u00e9todo V\u00eanus Individual ou Casal", "M\u00e9todo Merc\u00fario", "M\u00e9todo J\u00fapiter"],
    campos: [
      "nomeCompleto",
      "dataNascimento",
      "tipoVenus",
      "statusRelacionamento",
      "nomePessoaCondicional",
      "trabalhandoAtualmente",
      "atuacao",
      "contexto"
    ],
    formatosDisponiveis: formatosPadraoMock,
    sessoes: 3,
    regra:
      "Possui 3 sess\u00f5es. Cada sess\u00e3o deve ser escolhida em dia diferente. Pode ser \u00e1udio ou videochamada.",
    agendamento: {
      audio: {
        ativo: true,
        selecionaHorario: false,
        limitePorDia: 4,
        diasDiferentes: true
      },
      videochamada: {
        ativo: true,
        selecionaHorario: true,
        duracaoMinutos: 90,
        diasDiferentes: true
      }
    }
  },
  {
    id: "mandala-cigana",
    nome: "Mandala Cigana",
    categoria: "Previs\u00e3o e Tend\u00eancia",
    preco: 500,
    duracao: "2h",
    descricao:
      "M\u00e9todo destinado \u00e0 previs\u00e3o e tend\u00eancia das 12 \u00e1reas gerais da sua vida para os pr\u00f3ximos 6 meses.",
    observacao: "Valor oficial atual da Mandala Cigana: R$ 500.",
    topicos: [
      "Prop\u00f3sito Anual",
      "Amor",
      "Amizades",
      "Trabalho",
      "Dinheiro",
      "Vida Social",
      "Fam\u00edlia",
      "Espiritualidade",
      "Sombra",
      "Cura",
      "Futuro pr\u00f3ximo",
      "Desfecho do Ciclo"
    ],
    campos: [
      "nomeCompleto",
      "dataNascimento",
      "statusRelacionamento",
      "trabalhandoAtualmente",
      "atuacao"
    ],
    formatosDisponiveis: formatosPadraoMock,
    sessoes: 1,
    agendamento: {
      audio: {
        ativo: true,
        selecionaHorario: false,
        limitePorDia: 4
      },
      videochamada: {
        ativo: true,
        selecionaHorario: true,
        duracaoMinutos: 120
      }
    }
  }
]

function clonarMock(dados) {
  return JSON.parse(JSON.stringify(dados))
}

function buscarLeituraMock(id) {
  return leiturasMock.find((leitura) => leitura.id === id)
}

async function requisitarApi(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, opcoes)
  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao comunicar com a API.")
  }

  return dados
}

async function usarApiOuMock(chamadaApi, chamadaMock) {
  try {
    return await chamadaApi()
  } catch (erro) {
    return chamadaMock()
  }
}

async function buscarLeituras() {
  return usarApiOuMock(
    () => requisitarApi("/leituras"),
    () => clonarMock(leiturasMock)
  )
}

async function buscarLeituraPorId(id) {
  return usarApiOuMock(
    () => requisitarApi(`/leituras/${id}`),
    () => {
      const leitura = buscarLeituraMock(id)

      if (!leitura) {
        throw new Error("Leitura n\u00e3o encontrada.")
      }

      return clonarMock(leitura)
    }
  )
}

async function buscarCamposDaLeitura(id) {
  return usarApiOuMock(
    () => requisitarApi(`/leituras/${id}/campos`),
    () => {
      const leitura = buscarLeituraMock(id)

      if (!leitura) {
        throw new Error("Leitura n\u00e3o encontrada.")
      }

      const campos = leitura.campos.map((campoId) => ({
        id: campoId,
        ...camposMock[campoId]
      }))

      return {
        leitura: clonarMock(leitura),
        campos: clonarMock(campos)
      }
    }
  )
}

async function consultarDisponibilidade(formato, data) {
  return usarApiOuMock(
    () => requisitarApi(`/agendamentos/disponibilidade?formato=${formato}&data=${data}`),
    () => {
      if (formato === "audio") {
        return {
          formato,
          data,
          disponivel: true,
          reservasNoDia: 0,
          limitePorDia: 4,
          mensagem: "\u00c1udio dispon\u00edvel para esta data."
        }
      }

      return {
        formato,
        data,
        disponivel: true,
        horarios: ["19:30", "20:30", "21:30", "22:30"],
        mensagem: "Hor\u00e1rios dispon\u00edveis para videochamada."
      }
    }
  )
}

async function criarPreReserva(payload) {
  return usarApiOuMock(
    () => requisitarApi("/agendamentos/pre-reserva", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
    () => ({
      sucesso: true,
      mensagem: "Pr\u00e9-reserva criada em modo teste",
      preReserva: {
        id: `pre-${Date.now()}`,
        status: "pendente_pagamento",
        criadaEm: new Date().toISOString()
      }
    })
  )
}

async function criarPedido(payload) {
  return usarApiOuMock(
    () => requisitarApi("/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
    () => ({
      sucesso: true,
      mensagem: "Pedido recebido em modo teste",
      pedido: {
        id: `pedido-${Date.now()}`,
        ...payload
      }
    })
  )
}

async function validarCupom(codigo, subtotal, tipoPedido = "leituras") {
  return usarApiOuMock(
    () => requisitarApi("/cupons/validar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ codigo, subtotal, tipoPedido })
    }),
    () => {
      const cupons = {
        PAOLA10: 10,
        PAOLA20: 20
      }

      const codigoNormalizado = codigo.trim().toUpperCase()
      const percentual = cupons[codigoNormalizado]

      if (!percentual || tipoPedido !== "leituras") {
        return {
          valido: false,
          desconto: 0,
          total: subtotal,
          mensagem: "Cupom inv\u00e1lido."
        }
      }

      const desconto = Number(subtotal) * (percentual / 100)

      return {
        valido: true,
        desconto,
        total: Math.max(Number(subtotal) - desconto, 0),
        mensagem: `Cupom ${codigoNormalizado} aplicado.`
      }
    }
  )
}
