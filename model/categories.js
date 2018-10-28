var database = require('../config/database');
var Schema = database.mongoose.Schema;

var CategorySchema = new Schema({
    name: { type: String, required: true, trim: true },
    order: { type: Number },
    description: { type: String, trim: true },
    subcategories: [{ type: Schema.Types.ObjectId, ref:'subcategories'}],
    status: { type: Boolean, trim: true, default: true },
    is_deleted: { type: Boolean, trim: true, default: false },
    create_time: { type: Date, trim: true, default: Date.now },
}, { 'collection': 'categories' })

module.exports = database.mongoose.model('categories', CategorySchema)
