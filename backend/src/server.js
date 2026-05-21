import express from "express"
import cors from "cors"
import leiturasRoutes from "./routes/leituras.routes.js"

const app = express()

app.use(express.json())
app.use(cors())



app.use("/leituras", leiturasRoutes)


app.listen(3000, () => {
   console.log("Servidor rodando")
})