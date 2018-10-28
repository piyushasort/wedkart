var database = require('../config/database');
var Schema = database.mongoose.Schema;

var sellerSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: false, trim: true },
    image: { type: String, required: false, trim: true},
    confirmCode: { type: String, required: false },
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


module.exports = database.mongoose.model('sellers', sellerSchema)