import express from "express"
import { validarCupomController } from "../controllers/cupons.controller.js"

const router = express.Router()

router.post("/validar", validarCupomController)

export default router
