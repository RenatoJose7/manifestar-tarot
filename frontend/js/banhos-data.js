const banhosEnergeticos = [
  {
    id: "banho-de-sol",
    nome: "Banho de Sol",
    categoria: "Renovação energética",
    forca: "Banho feito na força da Cigana Espiritual Rubi",
    descricao:
      "Banho para livrar as maledicências, as mágoas e renovar as energias. Traz mais motivação, alegria e autoconfiança. Também auxilia na purificação de cargas energéticas estagnadoras.",
    ingredientes: [
      "Pétalas de girassol",
      "Pétalas de rosa laranja",
      "Pétalas de rosa amarela",
      "Alecrim",
      "Mel"
    ]
  },
  {
    id: "banho-de-venus",
    nome: "Banho de Vênus",
    categoria: "Amor próprio",
    forca: "Banho feito na força da Cigana Espiritual Rubi",
    descricao:
      "Banho para reforçar a autoestima e principalmente o amor próprio. Traz mais magnetismo, confiança, segurança e sensualidade. Reforça um olhar positivo para o que há de mais belo em você.",
    ingredientes: []
  }
]

function buscarBanhoPorId(id) {
  return banhosEnergeticos.find((banho) => banho.id === id)
}
