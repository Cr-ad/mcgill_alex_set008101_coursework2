var ObjectID = require('mongodb').ObjectId;
var express = require('express');
var router = new express.Router();
var path = require('path');

module.exports = function(blog_app, client) {
    
    var db = client.db('blog_db');

    // Home Route
    blog_app.get('/', (req, res) => {
       res.render('index', { title : 'The Home Route'});
    });

    // Test Route
    blog_app.get('/test/', (req, res) => {
        res.render('index', { title : 'The Test Route'});
    });


    
    

    // Articles Route
    blog_app.get('/articles/', (req, res) => {
        let posts = [
            {
                author: "Jim Halpert",
                title: "Post 1",
                post:   "This is a test blog post",
                date:   "26/03/2018"
            },
            {
                author: "Michael Sott",
                title: "Post 2",
                post:   "This is the 2nd test blog post",
                date:   "25/03/2018"
            },
            {
                author: "Pam Beasley",
                title: "Post 3",
                post:   "This is the 3rd test blog post",
                date:   "24/03/2018"
            }
        ];
        res.render('articles', {
            title : 'The Articles Route',
            "posts": posts
        });
    });

    // Samples Route
    blog_app.get('/samples/', (req, res) => {
        res.render('samples', { title : 'The Sample Route'});
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