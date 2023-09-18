import jwt from "jsonwebtoken"

export const createAccessToken = payload => 
    new Promise((resolve, reject) => {
        // delete payload.password
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "15 days"}, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
})

export const checkToken = token => new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) reject(err)
        resolve(decodedToken)
    })
})

//middleware
export const verifyAccessToken = async (req, res, next) => {
    if (!req.headers.authorization) 
        return res.status(401).send() //401 => unauthorized, manco il token
    
    const token = req.headers.authorization.replace("Bearer ", "") //tolgo la parte Bearer dal token
    const user = await checkToken(token)
    console.log("user", user)
    req.user = user
    next()
}

export const adminOnly = async (req, res, next) => {
    console.log(req.user)
    if (req.user.role === "admin") next()
    else res.status(403).send()
}