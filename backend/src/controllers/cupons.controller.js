import { validarCupom } from "../services/cupom.service.js"

export function validarCupomController(req, res) {
  res.json(validarCupom(req.body))
}
