import express from "express"
import { criarPedido } from "../controllers/pedidos.controller.js"

const router = express.Router()

router.post("/", criarPedido)

export default router
