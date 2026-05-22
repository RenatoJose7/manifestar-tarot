import express from "express"
import {
  buscarCamposDaLeitura,
  buscarLeituraPorId,
  listarLeituras
} from "../controllers/leituras.controller.js"

const router = express.Router()

router.get("/", listarLeituras)
router.get("/:id", buscarLeituraPorId)
router.get("/:id/campos", buscarCamposDaLeitura)

export default router
