const express = require('express')
const app = express()
const port = 8000
const connectDB = require('./db/connectDB')
const getUser = require('./routes/userRoutes')
const getChat = require('./routes/chatRoutes')
const getMessage = require('./routes/messageRoutes')
const cors = require('cors')
require('dotenv').config()
connectDB()

app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.json())
app.use('/api/user', getUser)
app.use('/api/chat', getChat)
app.use('/api/message', getMessage)

app.get("/", (req, res) => res.send("hellow from lets chat app"))

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))