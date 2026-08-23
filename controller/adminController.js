const connection = require('../config/db')
async function assignTicket(req,res){
    
    const ticketId = req.params.ticketId
    const {adminId} = req.body

    if(!adminId){
        return res.status(400).json({
            message:'Admin ID is required'
        })
    }

    const checkAdminQuery = `SELECT id FROM users WHERE id = ? AND role = 'admin'`

    connection.query(checkAdminQuery,[adminId],(err,results))

    if(err){
        console.log(err)

        return res.status(500).json({
            message:'Database error'
        })
    }
    
    const updateQuery = `
    UPDATE tickets SET assigned_to = ? WHERE id = ?`

    connection.query(updateQuery,[adminId,ticketId],(err,results)=>{

        if(err){
            console.log(err)

            return res.status(500).json({
                message:'Database error'
            })
        }
        if(results.affectedRows  === 0){
            return res.status(404).json({
                message:'Ticket not found'
            })
        }

        return res.status(200).json({
            message:'Ticket assigned successfully'
        })
    })


}

module.exports = {assignTicket}