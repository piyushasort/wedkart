const express = require('express')
const router = express.Router()
const sellerRoute = require('./routes/sellerRoutes')

router.use('/api/v1/seller/',sellerRoute)

module.exports = router
