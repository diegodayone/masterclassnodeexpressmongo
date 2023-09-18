import GoogleStrategy from "passport-google-oauth20"
import UsersModel from "../routes/users/userSchema.js"
import passport from "passport"
import { createAccessToken } from "./auth.js"
import dotenv from "dotenv"
dotenv.config()

passport.serializeUser((user, done) => {
    console.log("serializig", user)
    done(null, user._id);
 });
 
 passport.deserializeUser(async (id, done) => {
   const USER = await UsersModel.findById(id);
   done(null, USER);
 });

const googleStrategy = new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.API_URL}/users/googleRedirect`,
    },
    async (_, __, profile, passportNext) => {

        console.log(profile)
      // This function is executed when Google sends us a successfull response
      // Here we are going to receive some informations about the user from Google (scopes --> profile, email)
      try {
        const { email } = profile._json
        // 1. Check if the user is already in db
        const user = await UsersModel.findOne({ username: email })
        if (user) {
          // 2. If he is there --> generate an accessToken (optionally also a refreshToken)
          const accessToken = await createAccessToken({ _id: user._id, role: user.role })
          // 2.1 Then we can go next (to /googleRedirect route handler function)
          passportNext(null, {...user.toObject(),  accessToken })
        } else {
          // 3. If user is not in our db --> create that
          const newUser = new UsersModel({
            username: email,
            password: "temp password"
          })
          const createdUser = await newUser.save()
          // 3.1 Then generate an accessToken (optionally also a refreshToken)
          const accessToken = await createAccessToken({ _id: createdUser._id, role: createdUser.role })
  
          // 3.2 Then we go next (to /googleRedirect route handler function)
          passportNext(null, { ...createdUser.toObject(), accessToken })
        }
      } catch (error) {
        console.log(error)
        // 4. In case of errors we gonna catch'em and handle them
        passportNext(error)
      }
    }
  )
  
  export default googleStrategy
  
