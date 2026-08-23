const express = require('express')
const router = express.Router()

const {verifyToken, isAdmin} = require('../middleware/authMiddleware')
const ticketController = require('../controller/ticketController')

router.post('/',verifyToken,ticketController.createTicket)
router.get('/',verifyToken,ticketController.getTickets)
router.get('/:id', verifyToken,ticketController.getTicketById)
router.patch('/:id',verifyToken,ticketController.updateTicket)
router.delete('/:id',verifyToken, ticketController.deleteTicket)
router.post('/:id/replies',verifyToken,ticketController.addReply)
router.get('/:id/replies',verifyToken,ticketController.getReplies)

module.exports = router