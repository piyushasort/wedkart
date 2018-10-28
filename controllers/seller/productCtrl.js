var async = require('async')
var productMdl = require('../../model/product')
var sellerMdl = require('../../model/seller')
var categoryMdl = require("../../model/categories")
var subcategoryMdl = require("../../model/subcategories")

var addProductAction = function(req, res) {

    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkBody('name', 'Invalid Product Name').exists();
    req.checkBody('aprice', 'Actual Price Not Found').exists();
    req.checkBody('dprice', 'Discount Price Not Found').exists();
    req.checkBody('description', 'Invalid Description').exists();
    req.checkBody('size', 'Invalid Size').exists();
    req.checkBody('service', 'Invalid Service').exists();
    req.checkBody('color', 'Invalid Color').exists();
    req.checkBody('category', 'Invalid Category').exists();
    req.checkBody('quantity', 'You need to specify quantity').exists();
    req.checkBody('quantityType', 'You need to specify valid quantity type').exists();
    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }

    if (req.body.service.length < 1) {
        return res.status(400).failure('No Service Found ')
    }

    var token = req.headers['x-auth-token']
    async.series([
        (callback) => {
            sellerMdl.findByToken(token).exec(function(err, data) {
                if (err) throw err ;
                if (!data) {
                    return res.status(400).failure('Invalid Token')
                } else {
                    callback(null, data)
                }
            })
        }
    ], (err, data) => {
        if (err) throw err ;
        var product = new productMdl()
        if (req.file) {
            let imgurl = req.headers.host + '/' + req.file.path
            product['mainImage'] = imgurl
        }
        product['name'] = req.body.name
        product['aprice'] = req.body.aprice
        product['dprice'] = req.body.dprice
        product['description'] = req.body.description
        product['size'] = req.body.size
        product['color'] = req.body.color
        product['service'] = req.body.service
        product['reviews'] = []
        product['quantity'] = req.body.quantity
        product['quantityType'] = req.body.quantityType
        product['specifications'] = []
        product['images'] = []
        product['seller'].email = data[0].email;
        product['seller'].id = data[0]._id;
        product['category'] = req.body.category
        if (req.body.subcategory) {
            product['subcategory'] = req.body.subcategory
        }
        product.save()
        return res.status(200).success({}, 'Product Succesfully Added')
    })
}



var editProductAction = function(req, res) {
    var product = {}
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkParams('id', 'Invalid Id').exists();
    req.checkBody('name', 'Invalid Product Name').exists();
    req.checkBody('aprice', 'Actual Price Not Found').exists();
    req.checkBody('dprice', 'Discount Price Not Found').exists();
    req.checkBody('description', 'Invalid Description').exists();
    req.checkBody('size', 'Invalid Size').exists();
    req.checkBody('service', 'Invalid Service').exists();
    req.checkBody('color', 'Invalid Color').exists();
    req.checkBody('quantity', 'Invalid quantity').exists();
    req.checkBody('quantityType', 'You need to specify valid quantity type').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }

    if (req.body.service.length < 1) {
        return res.status(400).failure('No Service Found ')
    }


    var token = req.headers['x-auth-token']
    async.series([
        (callback) => {
            sellerMdl.findByToken(token).exec(function(err, data) {
                if (err) throw err;
                if (!data) {
                    return res.status(400).failure('Invalid Token')
                } else {
                    productMdl.find({'seller.id' : data['_id'], '_id': req.params.id }).exec((err,allProducts)=>{
                        if(err) throw err;
                        callback(null, data)
                    })
                }
            })
        },
    ], (err, seller) => {
        if (err) throw err;
       
        product['name'] = req.body.name
        product['aprice'] = req.body.aprice
        product['dprice'] = req.body.dprice
        product['description'] = req.body.description
        product['size'] = req.body.size
        product['color'] = req.body.color
        product['service'] = req.body.service
        product['quantity'] = req.body.quantity
        product['quantityType'] = req.body.quantityType
        productMdl.update({
            '_id': req.params.id
        }, {
            $set: product
        }).exec((err, data) => {
            if (err) throw err
            return res.status(200).success({}, 'Product Succesfully Updated')
        })
    })
}



function addSpecificationAction(req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkParams('id', 'Invalid Product Id').exists();
    req.checkBody('skey', 'Invalid Specification Key').exists();
    req.checkBody('sval', 'Invalid Specification Value').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }

    var token = req.headers['x-auth-token']

    async.series([
        (callback) => {
            sellerMdl.findByToken(token).exec(function(err, data) {
                if (err) throw err;
                if (!data) {
                    return res.status(400).failure('Invalid Token')
                } else {
                    callback(null)
                }
            })
        },
    ], (err) => {
        if (err) throw err;
        var specification = {
            "key": req.body.skey,
            "value": req.body.sval,
            "id": Math.round((Math.random() * 100000))
        }

        productMdl.update({
            '_id': req.params.id
        }, {
            $push: {
                'specifications': specification
            }
        }).exec(function(err, data) {
            if (err) throw err;
            res.status(200).success("", 'Specification added Successfully')
        })
    })


}

function deleteSpecificationAction(req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkParams('id', 'Invalid Product Id').exists();
    req.checkBody('sid', 'Invalid Specification Id').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }


    productMdl.findOne({
        '_id': req.params.id
    }).exec((err,productData)=>{
        if(err) throw err;
        productData.specifications = productData.specifications.filter(item=>item.id!=req.body.sid)    
        
        productMdl.update({
            '_id': req.params.id
        }, {
            $set: productData
        }).exec(function(err, data) {
            if (err) throw err; 
            res.status(200).success("", 'Specification deleted Successfully')
        })
    })
}


function addImageAction(req, res) {
    req.checkHeaders('x-auth-token', 'No Token Found').exists();
    req.checkParams('id', 'Invalid Product Id').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure({
            'errors': errors
        })
    }

    let token = req.headers['x-auth-token']
    if (req.file) {
        sellerMdl.findByToken(token).exec(function(err, data) {
            if (err) throw err;
            if (!data) {
                return res.status(400).failure('Invalid Token')
            } else {
                let imgurl = req.headers.host + '/' + req.file.path

                productMdl.update({'_id':req.params.id},{$push:{images:imgurl}}).exec()
                return res.success({
                    url: imgurl
                }, 'Product Pic added')
            }
        })
    } else {
        return res.status(400).failure('Image Not Found')
    }
}

function changeImageAction(req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkParams('id', 'Invalid Product Id').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }


    let imgurl = req.headers.host + '/' + req.file.path
    productMdl.update({
        _id: req.params.id
    }, {
        $set: {
            mainImage:imgurl
        }
    }).exec((err, data) => {
        if (err) throw err;
        return res.success({
            url: imgurl
        }, 'Product Pic added')

    })

}


function deleteImageAction(req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkParams('id', 'Invalid Product Id').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }


    productMdl.findOne({
        '_id': req.params.id
    }).exec(function(err, data) {
        if (err) return res.status(400).failure('There is some server error');;
        console.log(data)
        data.images.splice(req.params.index,1)
        productMdl.update({
            '_id': req.params.id
        }, {
            $set: data
        }).exec(function(err, data) {
            if (err) throw err;
            res.status(200).success("", 'Image deleted Successfully')
        })
    })

}




function allProductAction(req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }
    var token = req.headers['x-auth-token'].trim();

    sellerMdl.findByToken(token).exec(function(err, data) {
        if (err) throw err;
        if (!data) return res.status(400).failure('No User found.')
        if (data) {
            productMdl.find({'seller.id' : data['_id'] }).exec((err,allProducts)=>{
                if(err) throw err;
                return res.status(200).success(allProducts)
            })
        }
    })
}



function getCategory(req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkBody('category', 'Invalid Category Id').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }
    var token = req.headers['x-auth-token'].trim();

    sellerMdl.findByToken(token).exec(function(err, data) {
        if (err) throw err;
        if (!data) return res.status(400).failure('No User found.')
        if (data) {
            productMdl.find({'seller.id' : data['_id'], category: req.body.category }).exec((err,allProducts)=>{
                if(err) throw err;
                return res.status(200).success(allProducts)
            })
        }
    })
}


function getsubcategory(req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkBody('subcategory', 'Invalid Sub Category Id').exists();

    var error = req.validationErrors();
    if (error) {
        return res.status(400).failure('Error', {
            'errors': errors
        })
    }
    var token = req.headers['x-auth-token'].trim();
    sellerMdl.findByToken(token).exec((err, data) => {
        if (err) throw err;
        else if (!data) return res.status(400).failure('No User found.')
        else {
            productMdl.find({'seller.id' : data['_id'], subcategory: req.body.subcategory }).exec((err,allProducts)=>{
                if(err) throw err;
                return res.status(200).success(allProducts)
            })
        }
    })
}


function getProductAction(req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkParams('id', 'Invalid Product Id').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }

    productMdl.findOne({
        '_id': req.params.id
    }).populate('category').populate('subcategory').exec(function(err, data) {
        if (err) throw err;
        if (!data) return res.status(400).failure('No Such Product Found')
        return res.status(200).success(data)
    }, (err) => {
        if (err) {
            console.log(err)
        }

    })

}


function deleteProductAction(req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    req.checkParams('id', 'Invalid Product Id').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', {
            'errors': errors
        })
    }

    var token = req.headers['x-auth-token'].trim();

    sellerMdl.findByToken(token).exec(function(err, data) {
        if (err) {
            return res.status(400).failure(err)
        } else if (!data) {
            return res.status(400).failure('No Such account Found')
        } else {
            console.log(data.products)
            var index = data.products.findIndex(x => x.product == req.params.id)
            if (index > -1) {
                productMdl.remove({
                    '_id': req.params.id
                }).exec(function(err, data) {
                    if (err) throw err;
                    if (!data) return res.status(400).failure('No Such Product Found')
                    return res.status(200).success({}, 'Product Deleted Succesfully')
                })
            } else return res.status(400).failure("you don't own this product")
        }
    })
}



module.exports = {
    'addProduct': addProductAction,
    'editProduct': editProductAction,
    'addSpecification': addSpecificationAction,
    'addImage': addImageAction,
    'changeImage': changeImageAction,
    'deleteSpecification': deleteSpecificationAction,
    'deleteImage': deleteImageAction,
    'allProduct': allProductAction,
    'getCategory': getCategory,
    'getsubcategory': getsubcategory,
    'getProduct': getProductAction,
    'deleteProduct': deleteProductAction,
}