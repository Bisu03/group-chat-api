const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')

const userMiddleware = async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            const header = req.headers.authorization
            token = header.split(' ')[1]
            if (!token) {
                return res.status(404).json({ message: "invalid token" })
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: "something going wrong" })
        }
    } else {
        return res.status(404).json({ message: "no user found" })
    }
}
module.exports = userMiddleware