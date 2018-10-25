var database = require('../config/database');
var Schema = database.mongoose.Schema;

var sellerSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: false, trim: true },
    image: { type: String, required: false, trim: true},
    confirmToken: { type: String, required: false },
    recoverCode: { type: String, required: false },
    token: { type: String, required: false },
    address: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    state: { type: String, required: false, trim: true },
    country: { type: String, required: false, trim: true },
    pincode: { type: String, required: false, trim: true },
    isApproved: { type: Boolean, required: true, trim: true, default: false },
    isConfirmed: { type: Boolean, required: true, trim: true, default: false },
    isBlocked: { type: Boolean, required: true, trim: true, default: false },
    isDeleted: { type: Boolean, required: true, trim: true, default: false }
}, { 'collection': 'sellers' })


sellerSchema.statics.findByToken = function (token) {
    return this.findOne({ 'token': token, isDeleted:false }).lean();
}

sellerSchema.statics.findByMail = function (email, phone) {
    return this.findOne({ 'email': new RegExp(email, 'i'), isDeleted:false }).lean();
}


sellerSchema.statics.findExistence = function (ep, password) {
    return this.findOne(
        {
            $or: [
                { 'email': new RegExp(ep, 'i'), 'password': password },
                { 'phone': new RegExp(ep, 'i'), 'password': password }
            ],
            isDeleted:false
        }
    ).lean();
}

sellerSchema.statics.updateCode = function (id, code) {
    this.update({ '_id': id }, { $set: { 'recoverCode': code } }).exec(function (err, data) {
        if (err) throw err;
    })

}

sellerSchema.statics.updateToken = function (id, token) {
    this.update({ '_id': id }, { $set: { 'token': token } }).exec(function (err, data) {
        if (err) throw err;
    })

}
sellerSchema.statics.removeToken = function (id) {
    this.update({ '_id': id }, { $unset: { 'token': null } }).exec(function (err, data) {
        if (err) throw err;
    })

}
sellerSchema.statics.updatePassword = function (id, password) {
    this.update({ '_id': id }, { $set: { 'password': password } }).exec(function (err, data) {
        if (err) throw err;
    })
}

sellerSchema.statics.updateImage = function (id, url) {
    this.update({ '_id': id }, { $set: { 'image': url } }).exec(function (err, data) {
        if (err) throw err;
    })

}

sellerSchema.statics.updateProducts = function (id, products){
    console.log(id)
    this.update({ '_id': id }, { $set: { 'products': products } }).exec(function (err, data) {
        if (err) throw err;
    })
}

sellerSchema.statics.approveSeller = function (id){
    this.update({ '_id': id }, { $set: { 'isApproved': true } }).exec(function (err, data) {
        if (err) throw err;
    })
}

sellerSchema.statics.blockSeller = function (id, bool){
    this.update({ '_id': id }, { $set: { 'isBlocked': !bool } }).exec(function (err, data) {
        if (err) throw err;
    })
}

sellerSchema.statics.updateSentMail = function (id, sent) {
    this.update({ '_id': id }, { $set: { 'sent': sent } }).exec(function (err, data) {
        if (err) throw err;
    })

}

sellerSchema.statics.updateInboxMail = function (id, inbox) {
    this.update({ '_id': id }, { $set: { 'inbox': inbox } }).exec(function (err, data) {
        if (err) throw err;
    })

}

sellerSchema.statics.confirmAccountMail = function (id) {
    this.update({ '_id': id }, { $set: { 'isConfirmed': true } }).exec(function (err, data) {
        if (err) throw err;
    })

}



module.exports = database.mongoose.model('sellers', sellerSchema)