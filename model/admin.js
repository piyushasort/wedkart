var database = require('../config/database');
var Schema = database.mongoose.Schema

var adminSchema = new Schema({
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    token: { type: String, required: true, default: null },
    inbox: [{
        image: { type: String, required: true, trim: true, default: null },
        email: String,
        subject: String,
        data: String,
        isRead: { type: Boolean, required: true, trim: true, default: false },
        isImportant: { type: Boolean, required: true, trim: true, default: false },
        date: {type: Date, default: Date},
    }],
    sent: [{
        image: { type: String, required: true, trim: true, default: null },
        email: String,
        subject: String,
        data: String,
        isImportant: { type: Boolean, required: true, trim: true, default: false },
        date: {type: Date, default: Date},
    }],
}, { 'collection': 'admin' })

adminSchema.statics.findByToken = function (token) {
    return this.findOne({ 'token': token }).lean();
}

adminSchema.statics.findByMail = function (email, password) {
    return this.findOne({ 'email': new RegExp(email, 'i'), 'password': password }).lean();
}
adminSchema.statics.updateToken = function (id, token) {
    this.update({ '_id': id }, { $set: { 'token': token } }).exec(function (err, data) {
        if (err) throw err;
    })

}
adminSchema.statics.removeToken = function (id) {
    this.update({ '_id': id }, { $unset: { 'token': null } }).exec(function (err, data) {
        if (err) throw err;
    })

}
adminSchema.statics.updatePassword = function (id, password) {
    this.update({ '_id': id }, { $set: { 'password': password } }).exec(function (err, data) {
        if (err) throw err;
    })

}

adminSchema.statics.updateSentMail = function (id, sent) {
    this.update({ '_id': id }, { $set: { 'sent': sent } }).exec(function (err, data) {
        if (err) throw err;
    })

}

adminSchema.statics.updateInboxMail = function (id, inbox) {
    this.update({ '_id': id }, { $set: { 'inbox': inbox } }).exec(function (err, data) {
        if (err) throw err;
    })

}

module.exports = database.mongoose.model('admin', adminSchema)