const formatosPadrao = ["audio", "videochamada"]

const agendamentoPadrao = {
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

export const leituras = [
  {
    id: "jupiter",
    nome: "Método Júpiter",
    categoria: "Leitura Livre",
    preco: 111,
    duracao: "30 a 45 minutos",
    descricao:
      "Está com dúvida em relação ao que perguntar ao Tarot? Se sim, essa opção é o que você precisa. Nesse método, iremos perguntar qual mensagem ou direcionamento a espiritualidade gostaria de te dizer no momento. Não colocaremos foco em nenhuma área específica, permitindo assim que a mensagem abranja qualquer setor da sua vida.",
    observacao: "",
    topicos: [
      "Aprendizado do momento",
      "Mensagem dos seus mentores espirituais",
      "Pontos de atenção",
      "Conselho final"
    ],
    campos: ["nomeCompleto", "dataNascimento"],
    formatosDisponiveis: formatosPadrao,
    sessoes: 1,
    agendamento: agendamentoPadrao
  },
  {
    id: "sol",
    nome: "Método Sol",
    categoria: "Leitura de Autoconhecimento",
    preco: 111,
    duracao: "30 a 45 minutos",
    descricao:
      "Você tem o hábito de se observar? Nesse método, falaremos sobre os principais aspectos da sua essência e da sua alma. Abra-se para descobrir o que as cartas têm a dizer sobre sua personalidade.",
    observacao: "",
    topicos: [
      "Arcano pessoal",
      "Pontos expansivos da sua essência",
      "Pontos a amadurecer",
      "Conselho final"
    ],
    campos: ["nomeCompleto", "dataNascimento"],
    formatosDisponiveis: formatosPadrao,
    sessoes: 1,
    agendamento: agendamentoPadrao
  },
  {
    id: "venus-individual",
    nome: "Método Vênus Individual",
    categoria: "Leitura Amorosa",
    preco: 177,
    duracao: "1h a 1h30",
    descricao:
      "Muitas vezes desejamos encontrar a felicidade na vida amorosa mas esquecemos que isso depende da relação interna que construímos com nós mesmos. O Método Vênus Individual irá abordar inúmeros aspectos sobre a forma como você se conecta com a vida amorosa.",
    observacao: "",
    topicos: [
      "Aprendizado do momento em relação a sua vida amorosa",
      "Energia que está vibrando em relação a essa área",
      "Principal bloqueio ou crença limitante",
      "Modificações necessárias para obter satisfação na vida afetiva",
      "Tendência para os próximos 60 dias",
      "Conselho final do Tarot"
    ],
    campos: ["nomeCompleto", "dataNascimento", "statusRelacionamento", "contexto"],
    formatosDisponiveis: formatosPadrao,
    sessoes: 1,
    agendamento: agendamentoPadrao
  },
  {
    id: "venus-casal",
    nome: "Método Vênus Casal",
    categoria: "Leitura Amorosa",
    preco: 177,
    duracao: "1h a 1h30",
    descricao:
      "Análise geral das energias que envolvem sua dinâmica amorosa com alguém específico.",
    observacao: "",
    topicos: [
      "Aprendizado amoroso da consulente",
      "Principal bloqueio ou crença limitante",
      "Melhorias necessárias",
      "Energia geral da conexão",
      "Sentimento, pensamento e intenção da pessoa em relação a você",
      "Energias ocultas entre a dinâmica",
      "Tendência para os próximos 60 dias"
    ],
    campos: ["nomeCompleto", "nomePessoa", "statusRelacionamento", "contexto"],
    formatosDisponiveis: formatosPadrao,
    sessoes: 1,
    agendamento: agendamentoPadrao
  },
  {
    id: "mercurio",
    nome: "Método Mercúrio",
    categoria: "Leitura Profissional",
    preco: 150,
    duracao: "1h a 1h30",
    descricao:
      "Análise das energias correspondentes a sua vida profissional ou financeira. O que exatamente está te afastando de onde você quer chegar?",
    observacao: "",
    topicos: [
      "Aprendizado do momento em relação a essa área",
      "Principal bloqueio que te afasta do sucesso",
      "Mudança necessária para prosperar no seu negócio ou trabalho",
      "Tendência para os próximos 60 dias",
      "Conselho final do Tarot"
    ],
    campos: ["nomeCompleto", "trabalhandoAtualmente", "atuacao", "contexto"],
    formatosDisponiveis: formatosPadrao,
    sessoes: 1,
    agendamento: agendamentoPadrao
  },
  {
    id: "completao-tarot",
    nome: "Completão do Tarot",
    categoria: "Energia Amorosa, Profissional e Espiritual",
    preco: 400,
    duracao: "1h por área",
    descricao:
      "Combo correspondente ao Método Vênus (individual ou casal), Método Mercúrio e Método Júpiter.",
    observacao:
      "Como são três métodos no total, será necessário que a pessoa escolha uma leitura por dia, sendo definido a partir da necessidade da consulente.",
    topicos: ["Método Vênus Individual ou Casal", "Método Mercúrio", "Método Júpiter"],
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
    formatosDisponiveis: formatosPadrao,
    sessoes: 3,
    regra:
      "Possui 3 sessões. Cada sessão deve ser escolhida em dia diferente. Pode ser áudio ou videochamada.",
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
    categoria: "Previsão e Tendência",
    preco: 500,
    duracao: "2h",
    descricao:
      "Método destinado à previsão e tendência das 12 áreas gerais da sua vida para os próximos 6 meses.",
    topicos: [
      "Propósito Anual",
      "Amor",
      "Amizades",
      "Trabalho",
      "Dinheiro",
      "Vida Social",
      "Família",
      "Espiritualidade",
      "Sombra",
      "Cura",
      "Futuro próximo",
      "Desfecho do Ciclo"
    ],
    campos: [
      "nomeCompleto",
      "dataNascimento",
      "statusRelacionamento",
      "trabalhandoAtualmente",
      "atuacao"
    ],
    formatosDisponiveis: formatosPadrao,
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
