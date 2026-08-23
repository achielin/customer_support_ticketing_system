const express = require('express')
const router = express.Router()

const {verifyToken,isAdmin } = require('../middleware/authMiddleware')
const ticketController = require('../controller/ticketController')
const adminController = require('../controller/adminController')

router.get('/tickets',verifyToken,isAdmin,ticketController.getAllTickets)
router.patch('/tickets/:id/status',verifyToken,isAdmin,ticketController.updateTicketStatus)
router.post('/tickets/:id/replies',verifyToken,isAdmin,ticketController.adminReply)
router.patch('/tickets/:id/assign',verifyToken,isAdmin,adminController.assignTicket)

module.exports = router