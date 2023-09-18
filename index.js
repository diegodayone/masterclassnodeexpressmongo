import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import booksRouter from "./src/routes/books/index.js"
import urlRouter from "./src/routes/url/index.js"
import userRouter from "./src/routes/users/index.js"
import { verifyAccessToken } from "./src/utils/auth.js"
import expressSession from "express-session"
import passport from "passport"
import googleStrategy from "./src/utils/google.js"
dotenv.config()

mongoose.connect(process.env.mongoDB_URL)
mongoose.connection.on("connected", () => {
    console.log("Siamo connessi al DB")
})

const server = express()
server.use(express.json()) //middleware che ci permette di leggere il body delle richieste
server.use(cors())
passport.use("google", googleStrategy)
server.use(passport.initialize())
server.use(expressSession
({ 
    secret: process.env.JWT_SECRET
}));

server.use("/api/books", verifyAccessToken, booksRouter) // ==> tutte le richieste che arriva a api/books, se ne occupa booksRouter
server.use("/api/url", urlRouter)
server.use("/users", userRouter)

// server.post("/", (req, res) => {
//     res.send("Benvenuto all'evento " + req.body.nome + " in formato " + req.body.evento)  
// })

// server.get("/", (req, res) => {
//     // req => request, qui ci troviamo tutte le informazioni come Headers e Payload
//     // res => response, qui ci mettiamo le informazioni che vogliamo restituire
//     res.status(200).send("L'indirizzo del DB è " + process.env.indirizzoDB)
// })

server.listen(process.env.PORT || 3050, () => {
    console.log("Server is running on port 3050")
})