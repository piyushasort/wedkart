var database = require('../config/database');
var Schema = database.mongoose.Schema;

var categorySchema = new Schema({
        name: String,
        subCategory :[{
            name: String,
            products: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: "product"
            }
            }]
        }]
});


categorySchema.statics.addToKart = function (id, subCategory) {
    this.update({ '_id': id }, { $set: { 'subCategory': subCategory } }).exec(function (err, data) {
        if (err) throw err;
    })

}

categorySchema.statics.updateData = function (id, newName) {
    this.update({ '_id': id }, { $set: { 'name': newName } }).exec(function (err, data) {
        if (err) throw err;
    })

}

categorySchema.statics.saveData = function (id, subCategory) {
    this.update({ '_id': id }, { $set: { 'subCategory': subCategory } }).exec(function (err, data) {
        if (err) throw err;
    })

}


module.exports = database.mongoose.model('category', categorySchema);