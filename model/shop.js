var database = require('../config/database');
var Schema = database.mongoose.Schema;

var shopSchema = new Schema({
    logo: { type: String, required: true, trim: true, default: null },
    coverimage: { type: String, required: true, trim: true, default: null },
    shopname: { type: String, required: true, trim: true },
    address: { type: Array, required: false, trim: true, default: [] },
    sellerid: {
        type: Schema.Types.ObjectId,
        ref: "seller"
    }
}, { 'collection': 'shops' })

module.exports = database.mongoose.model('shops', shopSchema);