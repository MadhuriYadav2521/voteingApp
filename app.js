import express from "express"
import mongoose from "mongoose"
import morgan from "morgan"
import dotenv from "dotenv"
import userRoute from "./routes/userRoute.js"
dotenv.config()

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(userRoute)




mongoose.connect(process.env.CONNECTION)
.then(()=> console.log("DB Connected"))
.catch((err) => console.log(err))

app.listen((process.env.PORT),  console.log(`working on port ${process.env.PORT}`))