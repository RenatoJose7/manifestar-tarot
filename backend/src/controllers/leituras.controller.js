import { campos } from "../data/campos.js"
import { leituras } from "../data/leituras.js"

export function listarLeituras(req, res) {
  res.json(leituras)
}

export function buscarLeituraPorId(req, res) {
  const leitura = leituras.find((item) => item.id === req.params.id)

  if (!leitura) {
    return res.status(404).json({ erro: "Leitura não encontrada" })
  }

  res.json(leitura)
}

export function buscarCamposDaLeitura(req, res) {
  const leitura = leituras.find((item) => item.id === req.params.id)

  if (!leitura) {
    return res.status(404).json({ erro: "Leitura não encontrada" })
  }

  const camposDaLeitura = leitura.campos.map((campoId) => ({
    id: campoId,
    ...campos[campoId]
  }))

  res.json({
    leitura,
    campos: camposDaLeitura
  })
}
