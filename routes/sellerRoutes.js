const express = require('express')
const sellerCtrl = require('../controllers/seller/sellerCtrl')
const router = express.Router()


router.post('/register', sellerCtrl.register)
router.post('/login', sellerCtrl.login)
router.post('/logout', sellerCtrl.logout)
router.get('/details', sellerCtrl.details)
router.get('/confirm-account', sellerCtrl.confirmAccount)
router.get('/confirm-token', sellerCtrl.confirmToken)

router.post('/forget-password', sellerCtrl.forgetPassword)
router.put('/update-password', sellerCtrl.updatePassword)
router.put('/change-password', sellerCtrl.changePassword)
router.put('/edit-profile', sellerCtrl.edit)
router.put('/edit-bank-details', sellerCtrl.editBank)
router.put('/profile-image', sellerCtrl.profileImage)



module.exports = router
