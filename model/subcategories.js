var database = require('../config/database');
var Schema = database.mongoose.Schema;

var SubCategorySchema = new Schema({
 name :{type:String, required: true, trim: true},
 cat_id :{type:Schema.Types.ObjectId, required: true, trim: true},
 status : {type:Boolean, trim: true, default:true},
 is_deleted : {type:Boolean, trim: true, default:false},
 create_time : {type:Date, trim: true, default:Date.now },
},{'collection':'subcategories'})
module.exports = database.mongoose.model('subcategories',SubCategorySchema)
