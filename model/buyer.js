var database = require('../config/database');
var Schema = database.mongoose.Schema

var buyerSchema = new Schema({
    cart: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: "product"
        },
        number: Number
    }],
    personName: { type: String, required: true, trim: true },
    image: { type: String, required: false, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: false, trim: true },
    password: { type: String, required: true },
    address: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    state: { type: String, required: false, trim: true },
    country: { type: String, required: false, trim: true },
    pincode: { type: String, required: false, trim: true },
    latitude: { type: String, required: false, trim: true },
    longitude: { type: String, required: false, trim: true },
    isConfirmed: { type: Boolean, required: true, trim: true, default: false },
    isBlocked: { type: Boolean, required: false, trim: true, default: false },
    isDeleted: { type: Boolean, required: false, trim: true, default: false },
    recoverCode: { type: String, required: false, trim: true },
    token: { type: String, required: true, default: null, default: false },
    confirmToken: { type: String, required: true, default: null, default: false },
    
}, { 'collection': 'buyers' })


buyerSchema.statics.findByToken = function (token) {
    return this.findOne({ 'token': token, isDeleted:false }).lean();
}

buyerSchema.statics.findExistence = function (email, phone) {
    return this.findOne(
        {
            'email': new RegExp(email, 'i') ,
            isDeleted:false
        }
    ).lean();
}


buyerSchema.statics.findByMail = function (ep, password) {
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

buyerSchema.statics.updateCode = function (id, code) {
    this.update({ '_id': id }, { $set: { 'recoverCode': code } }).exec(function (err, data) {
        if (err) throw err;
    })

}

buyerSchema.statics.updateToken = function (id, token) {
    this.update({ '_id': id }, { $set: { 'token': token } }).exec(function (err, data) {
        if (err) throw err;
    })

}
buyerSchema.statics.removeToken = function (id) {
    this.update({ '_id': id }, { $unset: { 'token': null } }).exec(function (err, data) {
        if (err) throw err;
    })

}
buyerSchema.statics.updatePassword = function (id, password) {
    this.update({ '_id': id }, { $set: { 'password': password } }).exec(function (err, data) {
        if (err) throw err;
    })
}

buyerSchema.statics.updateImage = function (id, url) {
    this.update({ '_id': id }, { $set: { 'image': url } }).exec(function (err, data) {
        if (err) throw err;
    })

}

buyerSchema.statics.addToKart = function (id, cart) {
    this.update({ '_id': id }, { $set: { 'cart': cart } }).exec(function (err, data) {
        if (err) throw err;
    })

}

buyerSchema.statics.blockBuyer = function (id, bool){
    this.update({ '_id': id }, { $set: { 'isBlocked': !bool } }).exec(function (err, data) {
        if (err) throw err;
    })
}


module.exports = database.mongoose.model('buyers', buyerSchema)