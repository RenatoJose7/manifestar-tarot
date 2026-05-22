export const campos = {
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
    label: "Breve contexto ou dúvida sobre sua situação",
    type: "textarea",
    required: true
  },
  trabalhandoAtualmente: {
    label: "Está trabalhando no momento?",
    type: "select",
    required: true,
    options: ["Sim", "Não"]
  },
  atuacao: {
    label: "Se sim, qual sua atuação?",
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
    label: "No Método Vênus, deseja leitura individual ou de casal?",
    type: "select",
    required: true,
    options: ["Individual", "Casal"]
  }
}
