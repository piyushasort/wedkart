var database = require('../config/database');
var Schema = database.mongoose.Schema;

var productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    mainImage: { type: String, required: false, trim: true },
    aprice: { type: String, required: true, trim: true },
    dprice: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    size: { type: Array, required: false, trim: true, default: [] },
    color: { type: Array, required: false, trim: true, default: [] },
    service: { type: Array, required: false, trim: true, default: [] },
    reviews: { type: Array, required: false, trim: true, default: [] },
    images: { type: Array, required: false, trim: true, default: [] },
    specifications: { type: Array, required: false, trim: true, default: [] },
    quantity: { type: Number, required: true, trim: true },
    quantityType: { type: String, required: true, trim: true },
    category: { type: String, required: true, ref: 'category' },
    subCategory: { type: String},
    seller: {
        id: {
            type: Schema.Types.ObjectId,
            ref: "seller"
        },
        email: { type: String, required: true, trim: true }
    }
}, { 'collection': 'products' });

productSchema.statics.addImage = function (id, url) {
    this.update({ '_id': id }, { $push: { 'images': url } }).exec(function (err, data) {
        if (err) throw err;
    })

}


module.exports = database.mongoose.model('products', productSchema);
