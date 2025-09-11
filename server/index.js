const express = require('express')
const connectDB = require('./config/database')

const app = express()

app.get('/', (req, res) => {
    res.send('hi this is mini server')
})

app.get('/health', (req, res) => {
    let time = new Date()
    res.send(`everything is working fine - ${time.toLocaleString()}`)
})
connectDB()

app.listen(3000, () => {
    console.log('server is running at 3000')
})