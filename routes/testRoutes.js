const express = require('express')
const router = express.Router()

const {verifyToken}= require('../middleware/authMiddleware')

router.get('/profile',verifyToken,(req,res)=>{
    res.json({
        message:'You have access to this protected route',
        user:req.user
    })
})

module.exports = router