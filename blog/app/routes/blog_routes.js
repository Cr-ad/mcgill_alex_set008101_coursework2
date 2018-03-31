var ObjectID = require('mongodb').ObjectId;
var express = require('express');
var assert = require('assert');
var expressValidator = require('express-validator');
var router = new express.Router();
var path = require('path');

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


module.exports = function(blog_app, client) {
    
    //var db = client.db('blog_db');
    var db = mongoose.connection;
    // Home Route
    blog_app.get('/', (req, res) => {
        var dbPosts = [];
        var cursor = db.collection('posts').find();
        // Execute the each command, triggers for each document
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            // Need to add some validation

            var cat = capitaliseFirstLetter(doc.category);
            var post = {
                id:         doc._id,
                author:     doc.author,
                title:      doc.title,
                thumbnail:  doc.thumbnail,
                content:    doc.content,
                date:       doc.date,
                category:   cat,
                tags:       doc.tags
            }
            dbPosts.push(post);
            //console.log("ID: " + post.id +  " | Title: " + post.title);
        }, function() {
            // Sort articles by date descending
            dbPosts.sort(function compare(a,b){
                return b.date.getTime() - a.date.getTime()
            });
            
            res.render('articles', {
                title : 'The Articles Route',
                "posts": dbPosts
            });
        });
    });

    // Articles Route
    blog_app.get('/articles/', (req, res) => {
        var dbPosts = [];
        var cursor = db.collection('posts').find();
        // Execute the each command, triggers for each document
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            // Need to add some validation

            var cat = capitaliseFirstLetter(doc.category);
            var post = {
                id:         doc._id,
                author:     doc.author,
                title:      doc.title,
                thumbnail:  doc.thumbnail,
                content:    doc.content,
                date:       doc.date,
                category:   cat,
                tags:       doc.tags
            }
            dbPosts.push(post);
            //console.log("ID: " + post.id +  " | Title: " + post.title);
        }, function() {
            // Sort articles by date descending
            dbPosts.sort(function compare(a,b){
                return b.date.getTime() - a.date.getTime()
            });
            
            res.render('articles', {
                title : 'The Articles Route',
                "posts": dbPosts
            });
        });
    });

    // Article Route
    blog_app.get('/articles/:category/:id', (req, res) => {
        const category = req.params.category;
        const id = req.params.id;
        var selectedPost;
        var dbPosts = [];
        var cursor = db.collection('posts').find();
        // Execute the each command, triggers for each document
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            // Need to add some validation

            var cat = capitaliseFirstLetter(doc.category);

            var post = {
                id:         doc._id,
                author:     doc.author,
                title:      doc.title,
                thumbnail:  doc.thumbnail,
                content:    doc.content,
                date:       doc.date,
                category:   cat,
                tags:       doc.tags
            }
            if(post.id == id)
            {
                //console.log("Matched POST ID: " + post.id);
                selectedPost = post;
            }
            else
            {
                dbPosts.push(post);
            }
            //console.log("ID: " + post.id +  " | Title: " + post.title);
        }, function() {
            // Sort articles by date descending
            dbPosts.sort(function compare(a,b){
                return b.date.getTime() - a.date.getTime()
            });

            res.render('article', {
                title : 'The Article Route',
                "selectedPost": selectedPost,
                "posts": dbPosts
            });
        });
    });

    function capitaliseFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Category Route
    blog_app.get('/articles/:category/', (req, res) => {
        var selected_category = req.params.category;
        var categoryUpper;
        selected_category = selected_category.toLowerCase();
        // Nearly correct url redirects:
        if(selected_category == "tech")
        {
            selected_category = "technology";
        }
        selected_category.charAt(0).toUpperCase();
        var dbPosts = [];
        var cursor = db.collection('posts').find({category : selected_category});
        // Execute the each command, triggers for each document
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            // Convert the first letter of the category to uppercase to look nicer
            categoryUpper = (capitaliseFirstLetter(doc.category));
            // Need to add some validation to make sure all object variables are in the db
            var post = {
                id:         doc._id,
                author:     doc.author,
                title:      doc.title,
                thumbnail:  doc.thumbnail,
                content:    doc.content,
                date:       doc.date,
                category:   categoryUpper,
                tags:       doc.tags
            }
            dbPosts.push(post);
            //console.log("ID: " + post.id +  " | Title: " + post.title);
        }, function() {
            
            if(dbPosts.length > 0)
            {
                // Sort articles by date descending
                dbPosts.sort(function compare(a,b){
                return b.date.getTime() - a.date.getTime()
                });
                
                res.render('category', {
                    title : 'The Category Route',
                    category : categoryUpper,
                    "posts": dbPosts
                });
            }
            else
            {
                res.render('empty_category', {
                    title : 'Category Unavailable',
                    category : req.params.category
                });
                //res.send("Category does not exist");
            }
        });
    });


    // Search Route
    blog_app.get('/search/', (req, res) => {
        var search_query = req.query.search_input
        search_query = search_query.toLowerCase();
        var categoryUpper;
        console.log(search_query);
        var search_tags = search_query.split(/[ ,]+/);
        var dbPosts = [];
        // Find articles with title that contains keywords in tags?
        var cursor = db.collection('posts').find();
        //var cursor = db.collection('posts').find({"tags" : {"$in" : search_tags}});
        //var cursor = db.collection('posts').find({'tags' : { $in : search_query}});
        // Execute the each command, triggers for each document
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            // Convert the first letter of the category to uppercase to look nicer
            // Need to add some validation to make sure all object variables are in the db
            categoryUpper = (capitaliseFirstLetter(doc.category));
            var post = {
                id:         doc._id,
                author:     doc.author,
                title:      doc.title,
                thumbnail:  doc.thumbnail,
                content:    doc.content,
                date:       doc.date,
                category:   categoryUpper,
                tags:       doc.tags
            }
            
            dbPosts.push(post);
            //console.log("ID: " + post.id +  " | Title: " + post.title);
        }, function() {
            if(dbPosts.length > 0)
            {
                // Sort articles by date descending
                console.log("Matching Post Count: " + dbPosts.length);
                dbPosts.sort(function compare(a,b){
                return b.date.getTime() - a.date.getTime()
                });

                res.render('search', {
                    title : 'The Search Route',
                    "search_query" : search_query,
                    "posts": dbPosts
                });
            }
            else
            {
                res.render('search_empty', {
                    title : 'No Search Results',
                    category : req.params.category
                });
                //res.send("Category does not exist");
            }
        });
    });

    // Samples Route
    blog_app.get('/add_article/', (req, res) => {
        res.render('add_article', { title : 'The Add Article Route'});
    });

    blog_app.post('/add_article/', (req, res) => {
        var originalTagString = req.body.tags;
        var tagsUnfiltered = originalTagString.split(',');
        var tagsFiltered = new Array();
        var currentDateTime = new Date();
        for(i = 0; i < tagsUnfiltered.length; i++)
        {
            var current = tagsUnfiltered[i];
            while(current.charAt(0) == ' ' || current.charAt(0) == ',')
            {
                current = current.substring(1);
            }
            if(current.length > 2)
            {
                tagsFiltered.push(current);
            }
        }
        
        delete req.body.id; // for saftey (to avoid overwriting existing id)
        // Create the blog post
        const post = {
            author: req.body.author,
            title: req.body.title,
            thumbnail: req.body.thumbnail,
            content: req.body.content,
            date: currentDateTime,
            category: req.body.category,
            tags: tagsFiltered
         };
        
        db.collection('posts').insertOne(post, (err, result) => {
            if(err)
            {
                res.send({ 'error' : 'An error occurred' });
            }
            else
            {
                //res.send(result.ops[0]);
                res.redirect('/');
                var currentDate = new Date().toLocaleString();
                console.log(currentDate + " | Blog Post Submitted by " + post.author + " : '" + post.title + "'")
                //alert("Blog Post Successfully Submitted!");
            }
        })
    });

    // Samples Route
    blog_app.get('/samples/', (req, res) => {
        res.render('samples', { title : 'The Sample Route'});
    });
    
    // Import User Model
    let User = require('../models/user');


    // Register Route
    blog_app.get('/users/register', function(req, res){
        res.render('register');
    })

    // Register Process
    blog_app.post('/users/register', function(req, res){
        const name = req.body.name;
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const password2 = req.body.password2;
        /*
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        let errors = req.validationErrors();

        if(errors)
        {
            res.render('register', {
                errors:errors
            });
        }
        else
        {
            let newUser = new User({
                name :      name,
                email :     email,
                username :  username,
                password :  password
            });

            bcrypt.getSalt(10, function(err, salt){
                bcrypt.hash(newUser.password, salt, function(err, hash){
                    if(err)
                    {
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save(function(err){
                        if(err)
                        {
                            console.log(err);
                            return;
                        }
                        else
                        {
                            req.flash('success','Account successfully registered. Log in to get started!');
                            res.redirect('/user/login');
                        }
                    })
                });
            });
        }
        */
       console.log("Post!");
    });

    blog_app.get('/login', function(req, res){
        res.render('login');
    })

};