const User = require('../models/userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res, next) => {
    try {
        const { name, email, password, profile } = req.body
        if (!name || !email || !password) {
            return res.status(401).json({ message: "please enter the all details" })
        }

        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(401).json({ message: "user already exist" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const setUser = await User.create({
            name,
            email,
            password: hashedPassword,
            profile,
        })
        const token = jwt.sign({ id: setUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        if (setUser) {
            res.status(201).json({
                _id: setUser.id,
                name: setUser.name,
                email: setUser.email,
                profile: setUser.profile,
                isAdmin: setUser.isAdmin,
                token
            })
        } else {
            return res.status(400).json({ message: 'Invalid user data' })
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'something going wrong' })
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    try {


        const isUser = await User.findOne({ email })

        if (isUser) {
            const isPassword = await bcrypt.compare(password, isUser.password)
            if (isPassword) {
                const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                })

                res.status(200).json({
                    _id: isUser.id,
                    email: isUser.email,
                    name: isUser.name,
                    profile: isUser.profile,
                    isAdmin: isUser.isAdmin,
                    token
                })
            } else {
                return res.status(400).json({ message: 'invalid password' })
            }

        }
        else {

            return res.status(400).json({ message: 'user not found' })
        }


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'something going wrong' })
    }

}


const getUser = async (req, res, next) => {
    const getId = req.user
    try {
        console.log(getId);
        res.status(200).json({ getId })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'something going wrong' })
    }
}

const alluser = async (req, res, next) => {
    const keyWord = req.query.search
    
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        } : {}
    const getuser = await User.find(keyWord).find({ _id: { $ne: req.user } })
    console.log(getUser);
    res.status(200).json(getuser)
}

module.exports = {
    register,
    login,
    getUser,
    alluser
}