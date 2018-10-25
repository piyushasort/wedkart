const config = require('./config')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.database + '', { useMongoClient: true });
//Mongoose.connect('mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database+'',{useMongoClient: true});
mongoose.connect('mongodb://oriano_user:oriano12345@ds211083.mlab.com:11083/oriano_db');
var db = mongoose.connection;
db.on('open',(err)=>{
	if(err) {
		return err;
	}
	else {
		console.log("database connected");
	}
})
module.exports.mongoose = mongoose;
module.exports.db = db;
