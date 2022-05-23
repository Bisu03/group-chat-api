const express = require('express')
const { sendMessage, allMessage } = require('../controllers/messageControlls')
const router = express.Router()
const userMiddleware = require('../middleware/tokens')

router.get("/:chatId", userMiddleware, allMessage)
router.post("/", userMiddleware, sendMessage)

module.exports = router