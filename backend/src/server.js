import express from "express"
import cors from "cors"
import leiturasRoutes from "./routes/leituras.routes.js"
import agendamentosRoutes from "./routes/agendamentos.routes.js"
import pedidosRoutes from "./routes/pedidos.routes.js"
import cuponsRoutes from "./routes/cupons.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
   res.send("API funcionando")
})

app.use("/leituras", leiturasRoutes)
app.use("/agendamentos", agendamentosRoutes)
app.use("/pedidos", pedidosRoutes)
app.use("/cupons", cuponsRoutes)

const server = app.listen(3000, () => {
   console.log("Servidor rodando na porta 3000")
})

export { app, server }
