import express from "express";
import  {leituras}  from "../data/leituras.js"


const router = express.Router()

router.get("/", (req, res) => {
   res.json(leituras)
})

router.get("/:id", (req, res) => {
    const { id } = req.params

    const leitura = leituras.find((item) => item.id === id)

    if(!leitura){
        return res.status(404).json({
            erro: "Leitura não encontrada"
        })
    }

    res.json(leitura)
})

export default router   


