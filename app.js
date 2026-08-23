const express = require('express')
const cors =  require('cors')
require('dotenv').config()



const db = require('./config/db')
const app = express()

const testRoutes = require('./routes/testRoutes')
const authRoutes = require('./routes/authRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const adminRoutes = require('./routes/adminRoutes')

app.use(cors())
app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api/test', testRoutes)
app.use('/api/tickets',ticketRoutes)
app.use('/api/admin',adminRoutes)

app.get('/',(req,res)=>{
    res.json({
        message:'API running'
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})