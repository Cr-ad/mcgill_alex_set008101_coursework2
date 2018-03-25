var ObjectID = require('mongodb').ObjectId;
var express = require('express');
var router = new express.Router();
var path = require('path');

module.exports = function(blog_app, client) {
    
    var db = client.db('blog_db');

    /*blog_app.get('/', (req, res) => {
        res.render('index', {
          title: 'Home Page'
        });
      });
      */

     blog_app.get('/test/', (req, res) => {
        //res.send('Test Page');
        res.render('index', { title : 'The Test Route'});
    });

    blog_app.get('/', (req, res) => {
        //res.send('Home Page');
        res.render('index', { title : 'The Home Route'});
   });

    blog_app.get('/posts/:id', (req, res) => {

        const id = req.params.id;
        const details = {'_id' : new ObjectID(id) };
        db.collection('posts').findOne(details, (err, item) => {
            if(err)
            {
                res.send({ 'error' : 'An error occurred' });
            }
            else
            {
                res.send(item);
            }
        });
    });

    blog_app.delete('/posts/:id', (req, res) => {

        const id = req.params.id;
        const details = {'_id' : new ObjectID(id) };
        db.collection('posts').remove(details, (err, item) => {
            if(err)
            {
                res.send({ 'error' : 'An error occurred' });
            }
            else
            {
                res.send('Note ' + id + ' has been removed');
            }
        });
    });
    
    blog_app.put('/posts/:id', (req, res) => {

        const id = req.params.id;
        const details = {'_id' : new ObjectID(id) };
        const post = {text: req.body.body, title: req.body.title };
        db.collection('posts').update(details, post, (err, item) => {
            if(err)
            {
                res.send({ 'error' : 'An error occurred' });
            }
            else
            {
                res.send(item);
            }
        });
    });
    
    blog_app.post('/posts', (req, res) => {
        // Create the blog post
        const post = {text: req.body.body, title: req.body.title };
        
        db.collection('posts').insertOne(post, (err, result) => {
            if(err)
            {
                res.send({ 'error' : 'An error occurred' });
            }
            else
            {
                res.send(result.ops[0]);
            }
        })


    });
};