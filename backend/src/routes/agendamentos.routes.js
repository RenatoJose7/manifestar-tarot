import express from "express"
import {
  consultarDisponibilidade,
  criarPreReservaController
} from "../controllers/agendamentos.controller.js"

const router = express.Router()

router.get("/disponibilidade", consultarDisponibilidade)
router.post("/pre-reserva", criarPreReservaController)

export default router
