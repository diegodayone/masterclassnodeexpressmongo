import express from 'express';
import userSchema from './userSchema.js';
import { createAccessToken, verifyAccessToken, adminOnly } from "../../utils/auth.js"
import passport from 'passport';
import dotenv from "dotenv"
dotenv.config()

const router = express.Router();

router.get("/googleLogin", passport.authenticate("google", { scope:["email"]}))

router.get("/googleRedirect", passport.authenticate("google"), async (req, res) => {
    res.redirect(`${process.env.FE_URL}?accessToken=${req.user.accessToken}`)
})

router.get("/me", verifyAccessToken, async (req, res) => {
    //ritorna chi sono!
    res.send(req.user)
})

router.post("/register", async (req, res) => {
    //registrazione
    try {
        const newUser = await userSchema(req.body)
        await newUser.save()
        res.status(201).send(newUser)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

router.post("/login", async (req, res)=> {
    //login

    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTA4MWZhMDU0OTZhMzBiMjQzZDhiNmQiLCJ1c2VybmFtZSI6ImRpZWdvLmJhbm92YXpAZXBpY29kZS5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRpc2NuWGFjUG04aHBtbTVyQm84dDYudVN4R0F2Q0FHNHo1VE5QOW8uWEVWZHRoVHNNQzdvSyIsInJvbGUiOiJ1c2VyIiwiY3JlYXRlZEF0IjoiMjAyMy0wOS0xOFQxMDowMDowMC40ODJaIiwidXBkYXRlZEF0IjoiMjAyMy0wOS0xOFQxMDowMDowMC40ODJaIiwiX192IjowLCJpYXQiOjE2OTUwMzE4NDEsImV4cCI6MTY5NjMyNzg0MX0.nRKsHdjg9GfsoZM_kQbXJo_J5Lr6TOhbQyYt_OFdllo
    try {
        const { username, password } = req.body
        const user = await userSchema.checkCredentials(username, password)
        console.log(user)
        if (!user) return res.status(404).send("Username o password errati")

        const accessToken = await createAccessToken(user.toObject())
        res.send(accessToken)
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
})

router.delete("/:username", verifyAccessToken, adminOnly, async(req,res) => {
    //cancellazione
    const result = await userSchema.deleteOne({username: req.params.username})
    if (result.deletedCount === 1) {
        res.send("OK")
    }
    else {
        res.status(404).send()
    }
})



export default router;