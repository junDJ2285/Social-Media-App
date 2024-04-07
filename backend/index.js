import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDB from "./DBconfig/conn.js"
import router from "./routrers/index.js"
// import connectDB from "./DBconfig/conn.js"
import helmet from "helmet"
const app = express()
dotenv.config()
connectDB()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use(router)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`server is ${process.env.DEV_MODE} running on port ${PORT} `)
})