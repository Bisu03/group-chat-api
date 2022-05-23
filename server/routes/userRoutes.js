const express = require('express')
const { register, login, getUser, alluser } = require('../controllers/userControle')
const userMiddleware = require('../middleware/tokens')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/user', userMiddleware, getUser)
router.get('/', userMiddleware, alluser)

module.exports = router