const express = require('express')
const { accessChat, fetchChat, createGroupChat, renameGroupe, addGroup, removeGroup } = require('../controllers/chatControlls')
const router = express.Router()
const userMiddleware = require('../middleware/tokens')

router.post('/', userMiddleware, accessChat)
router.get('/', userMiddleware, fetchChat)
router.post('/group', userMiddleware, createGroupChat)
router.put('/rename', userMiddleware, renameGroupe)
router.put('/groupadd', userMiddleware, addGroup)
router.put('/groupremove', userMiddleware, removeGroup)

module.exports = router