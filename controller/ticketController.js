const connection = require('../config/db')
async function createTicket(req,res){

    const {subject,description,priority} = req.body

    const user_id = req.user.id

    const query = `INSERT INTO tickets(user_id,subject,description,priority)VALUES(?,?,?,?)`

    connection.query(query,[user_id,subject,description,priority || 'medium'],(err,result)=>{
        if(err){
            console.log(err)
            return res.status(500).json({
                  message:'Database error'  
                })
        }
        return res.status(201).json({
        message:'Ticket succesfully created',
        ticketId:result.insertId
    })
    
    })

}

async function getTickets(req,res){
   
    const user_id = req.user.id

    const query = `SELECT id,subject,description,status,priority,created_at FROM tickets WHERE user_id = ? ORDER BY created_at DESC`

    connection.query(query,[user_id],(err,results) =>{
        if(err){
            console.log(err)
            return res.status(500).json({
                message:'Ticket to retrieve tickets'
            })
        }
        return res.status(200).json({
            tickets:results
        })

    })
}

async function getTicketById(req,res) {

    const ticketId = req.params.id
    const user_id = req.user.id

    const query = `SELECT * FROM tickets WHERE id = ? AND user_id = ?`

    connection.query(query,[ticketId,user_id],(err,results)=>{

        if(err){
            console.log(err)
            return res.status(500).json({
                message:'Dataabase error'
            })
        }
        if(results.length === 0){
            return res.status(404).json({
                message:'Ticket not found'
            })
        }

        return res.status(200).json({
            ticket:results[0]
        })

    })
    
}

async function updateTicket(req,res){

    const ticketId = req.params.id
    const user_id = req.user.id

    const {subject,description,priority} = req.body

    const query = `UPDATE tickets SET subject = ?,description = ?,priority = ? WHERE id = ? AND user_id = ?`

    connection.query(query,[subject,description,priority,ticketId,user_id],(err,result)=>{

        if(err){
            console.log(err)
            return res.status(500).json({
                message:'Ticket not found'
            })
        }

        if(result.affectedRows === 0){
            return res.status(404).json({
                message:'Ticket not found'
            })
        }
        return res.status(200).json({
            message:'Ticket updated successfully'
        })
    })

}

async function deleteTicket(req, res) {

    const ticketId = req.params.id
    const userId = req.user.id

    console.log('Ticket ID:', ticketId)
    console.log('User ID:', userId)

    const query = `
        DELETE FROM tickets
        WHERE id = ? AND user_id = ?
    `

    connection.query(
        query,
        [ticketId, userId],
        (err, result) => {

            if (err) {
                console.log(err)

                return res.status(500).json({
                    message: 'Database error'
                })
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Ticket not found'
                })
            }

            return res.status(200).json({
                message: 'Ticket deleted successfully'
            })
        }
    )
}

async function getAllTickets(req,res){

    const {status,priority} = req.query

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const offset = (page - 1) * limit

    const query = `
    SELECT
      tickets.id,
      tickets.subject,
      tickets.description,
      tickets.status,
      tickets.priority,
      tickets.created_at,
      users.id AS user_id,
      users.name AS customer_name,
      users.email AS customer_email
    FROM tickets
    JOIN users ON tickets.user_id = users.id
    `
    let whereClause = ''
    const values = []
    const conditions = []

    if(status){
        conditions.push('status = ?')
        values.push(status)
    }

    if(priority){
        conditions.push('priority = ?')
        values.push(priority)
    }
    if(conditions.length > 0){
        whereClause = `WHERE ${conditions.join(' AND ')}`
    }

    const countQuery = `SELECT COUNT (*) AS total FROM tickets ${whereClause}`
        

    connection.query(countQuery,values,(err,results)=>{
        if(err){
            console.log(err)
            return res.status(500).json({
                message:'Database error'
            })
        }

        const totalTickets = countResults[0].totalTickets
        const totalPages = Math.ceil(totalTickets/limit)

        const ticketQuery = `
                             SELECT
                               tickets.id,
                               tickets.subject,
                               tickets.status,
                               tickets.priority,
                               tickets.created_at,
                               users.id AS user_id,
                               users.name AS customer_name,
                               users.email AS customer_email
                            FROM tickets
                            JOIN users ON tickets.user_id = users.id
                            ${whereClause}
                            ORDER BY tickets.created_at DESC
                            LIMIT ? OFFSET ?`

                            const ticketValues = [...values,limit,offset]

                            connection.query(ticketQuery,ticketValues,(err,results)=>{
                                if(err){
                                    console.log(err)

                                    return res.status(500).json({
                                        message:'Database error'
                                    })
                                }
                            
                                return res.status(200).json({
                                page:page,
                                limit:limit,
                                totalTickets:totalTickets,
                                totalPages:totalPages,
                                tickets:results
        })
    })
})
}

async function updateTicketStatus(req,res){

    const ticketId = req.params.id
    const {status} = req.body

    const query = `UPDATE tickets SET status = ? WHERE id = ?`

    connection.query(query,[status,ticketId],(err,results)=>{
        if(err){
            console.log(err)
            return res.status(500).json({
                message:'Database error'
            })
        }

        if(results.affectedRows === 0){
            return res.status(404).json({
                message:'Ticket not found'
            })
        }
        return res.status(200).json({
            message:'Ticket status updated successfully.'
        })

    })
}

async function getTickets(req,res){
    const userId = req.user.id

    const query = `SELECT id,subject,description,status,created_at FROM tickets WHERE user_id = ? ORDER BY created_at DESC`

    connection.query(query,[userId],(err,results)=>{
        if(err){
            console.log(err)
            
            return res.status(500).json({
                message:'Database error'
            })
        }
        return res.status(200).json({
            tickets:results
        })
    })
}

async function addReply(req,res){
    
    const ticketId = req.params.id
    const userId = req.user.id
    const {message} = req.body

    if(!message){
        return res.status(400).json({
            message:'Message is required'
        })
    }
    
    const checkQuery = `SELECT id FROM tickets WHERE id = ? AND user_id = ?`


    connection.query(checkQuery,[ticketId,userId],(err,results)=>{
        if(err){
            console.log(err)

            return res.status(500).json({
                message:'Database error'
            })
        }
        if(results.length === 0){
            return res.status(404).json({
                message:'Ticket not found'

            })
        }

        const query = `INSERT INTO ticket_replies(ticket_id,user_id,message) VALUES(?,?,?)`

        connection.query(query,[ticketId,userId,message],(err,result)=>{

            if(err){
                console.log(err)

                return res.status(500).json({
                    message:'Database error'
                })
            }

            return res.status(201).json({
                message:'Reply added successfully',
                replyId:result.insertId
            })
        })
    })

}

async function getReplies(req,res){
    const ticketId = req.params.id

    const query = `
    SELECT 
      ticket_replies.id,
      ticket_replies.message,
      ticket_replies.created_at,
      users.id AS user_id,
      users.name,
      users.role
    FROM ticket_replies
    JOIN users ON ticket_replies.user_id = users.id
    WHERE ticket_replies.ticket_id = ?
    ORDER BY ticket_replies.created_at ASC
      `

      connection.query(query,[ticketId],(err,results)=>{

        if(err){
            console.log(err)

            return res.status(500).json({
                message:'Database error'
            })
        }

        return res.status(200).json({
            replies:results
        })
      })
}

async function adminReply(req,res){

    const ticketId = req.params.id
    const userId = req.user.id
    const {message} = req.body

    if(!message){
        return res.status(400).json({
            message:'Message is required'
        })
    }

    const checkQuery = `SELECT id FROM tickets WHERE id = ?`

    connection.query(checkQuery,[ticketId],(err,results)=>{

        if(err){
            console.log(err)

            return res.status(500).json({
                message:'Database error'
            })
        }

       if(results.length === 0){
        return res.status(404).json({
            message:'Ticket not found'
        })
       }

       const query = `INSERT INTO ticket_replies(ticket_id,user_id,message)VALUES(?,?,?)`

       connection.query(query,[ticketId,userId,message],(err,results)=>{

        if(err){
            console.log(err)
            return res.status(500).json({
                message:'Database error'
            })
        }

        return res.status(201).json({
            message:'Admin reply added succesfully',
            replyId:results.insertId
        })

       })
    })
}

module.exports = {createTicket,getTickets,getTicketById,updateTicket,deleteTicket,getAllTickets,updateTicketStatus,addReply,getReplies,adminReply}