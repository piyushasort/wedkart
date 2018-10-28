const express = require('express')
const sellerCtrl = require('../controllers/seller/sellerCtrl')
const productCtrl = require('../controllers/seller/productCtrl')
const router = express.Router()
var multer = require('multer');

const storage = multer.diskStorage({
   destination: function(req, file, cb){
       cb(null, './uploads');
   },
   filename: function(req, file, cb){
       cb(null, new Date().getTime()+'-' + file.originalname)
   }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    } else{
        cb(null, false);
    }
}
var upload = multer({
    storage,
    limits: {
    fileSize: 1024 * 1024 * 5,
    fileFilter   
    } 
    
})


router.post('/register', sellerCtrl.register)
router.post('/login', sellerCtrl.login)
router.post('/logout', sellerCtrl.logout)
router.get('/details', sellerCtrl.details)
router.put('/update-account', sellerCtrl.edit)
router.get('/confirm-account/:code', sellerCtrl.confirmAccount)
router.get('/confirm-token', sellerCtrl.confirmToken)
router.put('/change-password', sellerCtrl.changePassword)
router.post('/forget-password', sellerCtrl.forgetPassword)
router.post('/confirm-code', sellerCtrl.confirmCode)
router.post('/update-password', sellerCtrl.updatePassword)
router.put('/profile-image', upload.single('avtar') ,sellerCtrl.profileImage)


router.post('/product', upload.single('productPic'), productCtrl.addProduct)
router.get('/products', productCtrl.allProduct)
router.get('/product/:id', productCtrl.getProduct)
router.put('/product/:id', productCtrl.editProduct)
router.post('/product/:id/main-image', upload.single('productImage'), productCtrl.changeImage)
router.post('/product/:id/image',upload.single('productImage'), productCtrl.addImage)
router.post('/product/:id/image/:index', productCtrl.deleteImage)
router.post('/product/:id/spec', productCtrl.addSpecification)
router.post('/product/:id/spec/remove', productCtrl.deleteSpecification)
router.post('/product/subcategory',productCtrl.getsubcategory)
router.post('/product/category', productCtrl.getCategory)
router.delete('/product/:id', productCtrl.deleteProduct)



module.exports = router
