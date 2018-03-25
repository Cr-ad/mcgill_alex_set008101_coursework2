const express = require ('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');


const db = require('./config/db');

var currentDate = new Date().toLocaleString();

const blog_app = express();

const port = 3000;

blog_app.use(bodyParser.urlencoded({ extended: true}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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

})