import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    role: { type: String, default: "user", enum: ["user", "moderator", "admin"] }
}, {
    timestamps: true
})

userSchema.pre("save", async function() {
    const newUserData = this
    if (newUserData.isModified("password") === false) return
    newUserData.password = await bcrypt.hash(newUserData.password, 10)
})

userSchema.methods.toJSON = function() {
    const userData = this
    delete userData.password
    delete userData.createdAt
    delete userData.updatedAt
    return userData
}

userSchema.statics.checkCredentials = async function(username, password) {
    const user = await this.findOne({ username }) //collezione di users
    if (!user) return null

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) return user

    return null
}

export default mongoose.model("user", userSchema)