import { cupons } from "../data/cupons.js"

function arredondar(valor) {
  return Math.round(valor * 100) / 100
}

export function validarCupom({ codigo, subtotal, tipoPedido = "leituras" }) {
  const subtotalNumerico = Number(subtotal)

  if (!codigo || Number.isNaN(subtotalNumerico)) {
    return {
      valido: false,
      mensagem: "Informe cupom e subtotal válidos.",
      desconto: 0,
      total: subtotalNumerico || 0
    }
  }

  const cupom = cupons.find((item) => item.codigo === codigo.trim().toUpperCase())

  if (!cupom || !cupom.ativo) {
    return {
      valido: false,
      mensagem: "Cupom inválido.",
      desconto: 0,
      total: subtotalNumerico
    }
  }

  const expirado = new Date(`${cupom.expiraEm}T23:59:59`) < new Date()
  const limiteAtingido = cupom.usado >= cupom.limiteUso
  const aplicaNoTipo = cupom.aplicaEm.includes(tipoPedido)

  if (expirado || limiteAtingido || !aplicaNoTipo) {
    return {
      valido: false,
      mensagem: "Cupom indisponível para este pedido.",
      desconto: 0,
      total: subtotalNumerico
    }
  }

  const desconto =
    cupom.tipo === "percentual"
      ? arredondar(subtotalNumerico * (cupom.valor / 100))
      : arredondar(cupom.valor)

  return {
    valido: true,
    codigo: cupom.codigo,
    tipo: cupom.tipo,
    valor: cupom.valor,
    desconto,
    total: Math.max(arredondar(subtotalNumerico - desconto), 0),
    mensagem: "Cupom aplicado."
  }
}
