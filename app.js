const express = require('express')
var multer = require('multer')
var bodyparser = require('body-parser')
var cookieParser = require('cookie-parser');
var sessionParser = require('cookie-session');
var expressValidator = require('express-validator');
var cors = require('cors')
var jsend = require('./plugins/jsend')
const config = require('./config/config')
const router = require('./routes')
const app = express()
var swaggerUi = require('swagger-ui-express')
var swaggerDocument = require('./swagger.json')
var upload = multer({dest: 'uploads/'})
var logger = require('morgan');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// middlewares
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(cors())
app.use(logger('dev'));
app.use(bodyparser.json({limit: '50mb'}))
app.use(bodyparser.urlencoded({extended:true,limit: '50mb'}))
app.use(cookieParser());
app.use(expressValidator());
app.use(jsend());
app.use('/uploads', express.static('uploads'));
app.use('/',router)


//logging
switch (app.get('env')) {
    case 'development':
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        app.use(require('express-logger')({
            path: __dirname + '/server.log'
        }));
        break;
}


var server = app.listen(process.env.PORT || config.port, function(){
	console.log("Server started on "+ server.address().port)
})
