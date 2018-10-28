var sellerMdl = require('../../model/seller')
var async = require('async')
var nodemailer = require("nodemailer")

var registerAction = function (req, res) {

    req.checkBody('name', 'Invalid Name').exists();
    req.checkBody('email', 'Invalid Email').exists().isEmail();
    req.checkBody('password', 'Invalid Password').exists().isLength({ min: 3 });
  
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    var seller = {}
    seller['name'] = req.body.name.toLowerCase().trim()
    seller['email'] = req.body.email.toLowerCase().trim()
    seller['password'] = req.body.password

    async.waterfall([
        (callback) => {
            sellerMdl.findByMail(seller['email']).exec((err, data) => {
                if (err) throw err;

                if (data) {
                    return res.status(400).failure('Email Address Already In Use')
                }
                else {
                    callback(null)
                }
            })
        },
        (callback) => {
			var code = "";
			var possible = "0123456789";
			for (var i = 0; i < 6; i++) {
				code += possible.charAt(Math.floor(Math.random() * possible.length));
			}
            seller['confirmCode'] = code;

            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                  user: 'piyushkapoor786@gmail.com',
                  pass: 'P!yush@1994'
                }
            });
    
            var mailOptions = {
                to: req.body.email,
                from: 'Wedding Kart',
                subject: "Seller Registration, Don't Reply",
                text: 'You are receiving this because you (or someone else) have requested the create an account on Wedkart with this email.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/api/v1/seller/confirm-account/' + seller['confirmCode'] + '\n\n' +
                  'If you did not request this, please ignore this email.\n'
            };

            smtpTransport.sendMail(mailOptions, function(err) {
                if(err) throw err;

            });
    
            seller = new sellerMdl(seller)
            seller.save()
            callback(null);
        }
    ], (err) => {
        if (err) throw err;
        return res.success({}, 'Successfully Registered, Please confirm Account on email')
    })
}


var loginAction = function (req, res) {
    req.checkBody('email', 'Invalid Email or Phone Number').exists();
    req.checkBody('password', 'Invalid Password').exists().isLength({ min: 3 });
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    var seller = {}
    seller['email'] = req.body.email.toLowerCase().trim()
    seller['password'] = req.body.password

    sellerMdl.findExistence(seller['email'], seller['password']).exec((err, data) => {
        if (err) throw err;

        if (!data) return res.status(400).failure('Invalid Username or Password')
        if (!data.isConfirmed) {
            return res.status(400).failure('Please Confirm Your Account', {email:seller['email']})
        }
        
        if (data.isBlocked) {
            return res.status(400).failure('Your Account has Been Blocked')
        } else {
		    var text = "";
  		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		    for (var i = 0; i < 15; i++){
	    	    text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
	        sellerMdl.update({_id: data['_id'] },{ $set : { 'token' : text } }).exec()
        	return res.status(200).success({ 'token': text , 'name': data['name'] }, 'seller Logged In successfully')
    	}
    })
}

var logoutAction = function (req, res) {
    req.checkHeaders('x-auth-token', 'Invalid Token').exists();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    var seller = {}
    seller['token'] = req.headers['x-auth-token'].trim()

    sellerMdl.findByToken(seller['token']).exec((err, data) => {
        if (err) throw err;
        if (!data) return res.status(400).failure('Invalid Token')
        sellerMdl.update({'_id' : data['_id']},{$unset:{token:null}}).exec()
        return res.status(200).success({}, 'seller Logged out successfully')
    })

}


var confirmAccountAction = function(req, res){
    req.checkParams('code', 'No Confirm Code Found').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    var seller = {}
    seller['confirmCode'] = req.params.code.trim()


    sellerMdl.findOne(seller).exec(function(err, data){
        if(err) throw err;
        sellerMdl.update({'_id':data._id},{$set:{isConfirmed:true}}).exec()
        return res.status(200).success({}, "Seller's Account confirmed Successfully")
    })
}




var confirmTokenAction = function (req, res) {
    req.checkHeaders('x-auth-token', 'No Token Found').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    let token = req.headers['x-auth-token']
    sellerMdl.findByToken(token).exec(function (err, data) {
        if (err) throw err;
        if (!data) {
            return res.failure('Invalid Token')
        } else {
			return res.success({},'Token Validated')
        }
    })
}

var detailsAction = function (req, res) {
    req.checkHeaders('x-auth-token', 'No Token Found').exists();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    let token = req.headers['x-auth-token']
    sellerMdl.findByToken(token).exec(function (err, data) {
        if (err) throw err;
        if (!data) {
            return res.failure('Invalid Token')
        } else {
            delete data['password']
            delete data['token']
            delete data['recoverCode']
            delete data['isDeleted']
            return res.success(data)
        }
    })
}



var changePasswordAction = function (req, res) {
    req.checkHeaders('x-auth-token', 'No Token Found').exists();
    req.checkBody('opassword', 'Invalid New Password').exists();
    req.checkBody('npassword', 'Invalid New Password').isLength({ min: 3 });

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    let token = req.headers['x-auth-token']
	let opassword = req.body.opassword
	let npassword = req.body.npassword

    sellerMdl.findByToken(token).exec(function (err, data) {
        if (err) throw err;
        if (!data) {
            return res.failure('Invalid Token')
        } else {
            if (data.password != opassword) {
                return res.status(400).failure('Incorrect Old Password')
            }
            sellerMdl.update({'_id':data['_id']},{$et:{'password': npassword}}).exec()
            return res.success({}, 'seller Password Successfully Changed')
        }
    })

}

var forgetPasswordAction = function (req, res) {
    req.checkBody('email', 'Invalid Email Address').isEmail();


    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    let email = req.body.email.toLowerCase().trim()

    sellerMdl.findOne({ 'email': email, 'isDeleted': false }).exec(function (err, data) {
        if (err) throw err;
        if (!data) {
            return res.status(400).failure('Email Is not Registered With Us')
        } else {
            var recoverCode = Math.floor(1000 + Math.random() * 9000);
            sellerMdl.update({'_id': data['_id']}, {$set:{ "recoverCode" : recoverCode }}).exec()


            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                  user: 'piyushkapoor786@gmail.com',
                  pass: 'P!yush@1994'
                }
            });
    
            var mailOptions = {
                to: req.body.email,
                from: 'Wedding Kart',
                subject: "Forget Password, Don't Reply",
                html: 'You are receiving this because you (or someone else) have requested the create an forget password on Wedkart with this email.\n\n' +
                  'Please use following code to recover your password <h1>' + recoverCode + '</h1>\n\n' +
                  'If you did not request this, please ignore this email.\n'
            };

            smtpTransport.sendMail(mailOptions, function(err) {
                if(err) throw err;

            });


            return res.success({'email': email}, 'seller Recover Token Sent On Email')
        }
    })

}



var updatePasswordAction = function (req, res) {
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('code', 'Invalid Recover Code').exists();
    req.checkBody('password', 'Invalid Password').exists().isLength({ min: 3 });


    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    let email = req.body.email.toLowerCase().trim()
    let code = req.body.code
    let password = req.body.password.trim()

    sellerMdl.findOne({ 'email': email, 'recoverCode': code, 'isDeleted': false }).exec(function (err, data) {
        if (err) throw err;
        if (!data) {
            return res.failure('Recover Code has Expired')
        } else {
            sellerMdl.update({ '_id': data['_id'] }, { $set: { 'password': password } }).exec((err, data) => {
                if (err) throw err;
                return res.success({}, 'Password Successfully Updated, Please Login Now')
            })
        }
    })
}



var editAction = function (req, res) {
    req.checkHeaders('x-auth-token', 'No Token Found').exists();
    req.checkBody('name', 'Invalid Person Name').exists();
    req.checkBody('phone', 'Invalid Phone Number').exists().isLength({ min: 10, max: 12 });
    req.checkBody('address', 'Invalid Address').exists();
    req.checkBody('city', 'Invalid country').exists();
    req.checkBody('state', 'Invalid country').exists();
    req.checkBody('country', 'Invalid country').exists();
    req.checkBody('pincode', 'Invalid Pincode').exists();
    
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    var token = req.headers['x-auth-token']
    var seller = {}
    seller['name'] = req.body.name.trim()
    seller['phone'] = req.body.phone.trim()
    seller['address'] = req.body.address.trim()
    seller['city'] = req.body.city.trim()
    seller['state'] = req.body.state.trim()
    seller['country'] = req.body.country.trim()
    seller['pincode'] = req.body.pincode.trim()
    async.waterfall([
        (callback) => {
            sellerMdl.findByToken(token).exec((err, data) => {
                if (err) throw err;
                if (!data) return res.status(400).failure('Invalid Token')
                callback(null,data['_id'])
            })
        },
        (id,callback) => {
            sellerMdl.update({'_id':id},{$set:seller}).exec((err,data)=>{
                if(err) throw err;
                callback(null)
            })
        }
    ], (err) => {
        if (err) throw err;
        return res.success({}, 'seller Successfully Updated')
    })
}


var profileImageAction = function (req, res) {
    req.checkHeaders('x-auth-token', 'No Token Found').exists();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure({ 'errors': errors })
    }

    let token = req.headers['x-auth-token']

    if(req.file)
	{   
		sellerMdl.findByToken(token).exec(function (err, data) {
        if (err) throw err;
        if (!data) {
            return res.status(400).failure('Invalid Token')
        } else {
            let imgurl = req.headers.host+ '/' + req.file.path
            sellerMdl.update({'_id': data['_id']},{ $set:{'image': imgurl } }).exec()
            return res.success({url:imgurl }, 'seller Profile Pic Updated')
        }
    })
	}
	else
	{
            return res.status(400).failure('Image Not Found')
	}
    
}


var confirmCodeAction = function (req, res) {
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('code', 'Invalid Recover Code').exists();


    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).failure('Errors', { 'errors': errors })
    }

    let email = req.body.email
    let code = req.body.code

    sellerMdl.findOne({ 'email': email, 'isDeleted': false }).exec(function (err, data) {
        if (err) throw err;
        if (!data) {
            return res.failure('Wrong Email Address')
        } else {
            if (data.recoverCode == code) {
                return res.success({}, 'seller Recover Token Matched')
            }
            else {
                return res.status(400).failure('Wrong Recover Code')
            }
        }
    })
}




module.exports = {
    'register': registerAction,
    'login': loginAction,
    'logout': logoutAction,
    'confirmAccount': confirmAccountAction,
    'confirmToken':confirmTokenAction,
    'edit': editAction,
    'confirmCode':confirmCodeAction,
    'details': detailsAction,
    'changePassword': changePasswordAction,
    'forgetPassword': forgetPasswordAction,
    'updatePassword': updatePasswordAction,
    'profileImage':profileImageAction,
}
