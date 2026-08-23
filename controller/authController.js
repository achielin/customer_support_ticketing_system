const connection = require('../config/db')
const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')


async function register(req,res){

    try{

        const { name, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const query = `INSERT INTO users(name,email,password) VALUES (?,?,?)`

        connection.query(
            query,
            [name, email, hashedPassword],
            (err, result) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({
                        message: 'Failed to create user'
                    })
                }
                return res.status(201).json({
                    message: 'User successfully created',
                    userId: result.insertId
                })
            })

    }catch(error){
        console.error(error)

        return res.status(500).json({
            message:'Server error'
        })
 }
    
}

async function login(req,res){
    try{

        const {email,password} = req.body

        const query = `SELECT * FROM users WHERE email = ?`

        connection.query(query,[email], async(err,results)=>{
            if(err){
                console.log(err)
                return res.status(500).json({
                  message:'Database error'  
                })
            }
            if(results.length === 0){
                return res.status(404).json({
                    message:'User not found.'
                })
            }

        const user = results[0]
        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(401).json({
              message:'Password is incorrect'  

            })
        }

        const token = jwt.sign({id:user.id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'})

     return res.status(200).json({
        message:'Login successful',
        token:token
     })
    })


    }catch(error){
        console.error(error)
        return res.status(500).json({
            message:'Server error'
        })

    }

}

module.exports ={register,login}