const express = require ('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');

const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

const mongoose = require('mongoose');
const dbCfg = require('./config/db');
const bcrypt = require('bcryptjs');


mongoose.connect(dbCfg.url);
let db = mongoose.connection;

var currentDate = new Date().toLocaleString();
var index = require('./app/routes/index');
const blog_app = express();

const port = 3000;

blog_app.use(bodyParser.urlencoded({ extended: true}))

// view engine setup
blog_app.set('views', path.join(__dirname, '/app/views'));
blog_app.use(express.static(path.join(__dirname, 'app/public')));
blog_app.set('view engine', 'pug');

// Express session middleware

blog_app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express messages middleware
blog_app.use(require('connect-flash')());
blog_app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//blog_app.use(flash());

// Express validator middleware
blog_app.use(expressValidator({
    errorFormatter : function(param, msg, value) {
        var namespace = param.split('.'),
        root =          namespace.shift(),
        formParam =     root;

        while(namespace.length)
        {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param : formParam,
            msg :   msg,
            value : value
        };
    }
}));

// Route files
let articles = require('./app/routes/articles');
blog_app.use('/articles', articles);

let users = require('./app/routes/users');
blog_app.use('/users', users);

// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB')
    require('./app/routes')(blog_app, db);
    blog_app.listen(port, () => {
        console.log(currentDate + " | Listening on port " + port + " @ http://localhost:3000");
    });
});

// Check for DB errors
db.on('error', function(err){
    error.status = err;
    res.render('error');
    console.log(err);
});

/*
MongoClient.connect(db.url, (err, database) => {
    if (err)
    {
        return console.log(err);
    }
    else
    {
        require('./app/routes')(blog_app, database);
        blog_app.listen(port, () => {
            console.log(currentDate + " | Listening on port " + port + " @ http://localhost:3000");
        });
    }

});  
*/
  
  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  //blog_app.use(logger('dev'));
   //blog_app.use(expressValidator);

  blog_app.use(bodyParser.json());
  blog_app.use(bodyParser.urlencoded({ extended: false }));
 
  blog_app.use(cookieParser());
  blog_app.use(express.static(path.join(__dirname, 'public')));
  
  /*

  //blog_app.use('/', index);
  //blog_app.use('/users', users);
  
  // catch 404 and forward to error handler
  blog_app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
 
  blog_app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.blog_app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  */
  module.exports = blog_app;