var database = require('../config/database');
var Schema = database.mongoose.Schema

var orderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    method: { type: String, required: true, trim: true },
    method: { type: String, required: true, trim: true },

    cart: [{
       id: {
           type: Schema.Types.ObjectId,
           ref: "seller"
       },
       size: {type: String,required:true,trim:true},
       color: {type: String,required:false,trim:true},
       quantity: {type: String,required:true,trim:true},
       category:{type: String,required:false,trim:true},
       seller_email:{type:String,required:true,trim:true},
   }],
}, { 'collection': 'orders' })


/*buyerSchema.statics.findByToken = function (token) {
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
*/

module.exports = database.mongoose.model('orders', orderSchema)