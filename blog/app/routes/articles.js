const express = require('express');
const router = new express.Router();
var mongoose = require('mongoose');
var assert = require('assert');
var expressValidator = require('express-validator');
var path = require('path');

// Bring in Article Model
let Article = require('../models/article');
let User = require('../models/user');
let Author = require('../models/author');
var db = mongoose.connection;


var all_categories = [
    "Technology",
    "Automotive",
    "Business",
    "Sport",
    "Travel",
    "Economics",
    "Politics",
    "Science",
    "Entertainment",
    "Music",
    "Gaming",
    "Other"
];
all_categories.sort();

// Articles Route
router.get('/', (req, res) => {
    var dbPosts = [];
    var cursor = db.collection('posts').find();
    // Execute the each command, triggers for each document
    cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        // Need to add some validation

        var categoryUpper = capitaliseFirstLetter(doc.category);
        var post = {
            id          : doc._id,
            author_id   : doc.author_id,
            author_name : doc.author_name,
            title       : doc.title,
            thumbnail   : doc.thumbnail,
            content     : doc.content,
            date        : doc.date,
            category    : categoryUpper,
            tags        : doc.tags
        }
        dbPosts.push(post);
        //console.log("ID: " + post.id +  " | Title: " + post.title);
    }, function() {
        // Sort articles by date descending
        dbPosts.sort(function compare(a,b){
            return b.date.getTime() - a.date.getTime()
        });

        for(i = 0; i < dbPosts.length; i++)
        {
            
        }
        res.render('articles', {
            title : 'The Articles Route',
            "posts": dbPosts
        });
    });
});

// Article Route
router.get('/articles/:category/:id', (req, res) => {
    const category = req.params.category;
    const id = req.params.id;
    var selectedPost;
    var dbPosts = [];
    var cursor = db.collection('posts').find();
    // Execute the each command, triggers for each document
    cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        // Need to add some validation

        var categoryUpper = capitaliseFirstLetter(doc.category);

        var post = {
            id          : doc._id,
            author_id   : doc.author_id,
            author_name : doc.author_name,
            title       : doc.title,
            thumbnail   : doc.thumbnail,
            content     : doc.content,
            date        : doc.date,
            category    : categoryUpper,
            tags        : doc.tags
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

// Add Article Route
router.get('/add_article/', (req, res) => {
    res.render('add_article', {
        title : 'The Add Article Route',
        categories : all_categories
    });
});

router.post('/add_article/', (req, res) => {
    var user_id = req.user._id;
    var flag = false;
    var originalTagString = req.body.tags;
    var tagsUnfiltered = originalTagString.split(',');
    var tagsFiltered = new Array();
    var currentDateTime = new Date();
    var display_name;
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
    //db.collection('users').find({_id : user_id}, function(err, doc){
    var cursor = db.collection('users').find({_id : user_id});
    // Execute the each command, triggers for each document
    cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        if(err)
        {
            console.log(err);
            throw err;
        }
        else
        {
            display_name = doc.first_name + " " + doc.last_name;
            console.log(display_name);
        }
    }, function(){
        delete req.body.id; // Avoid overwriting existing id
        // Create the blog post
        const post = {
            author_id   : user_id,
            author_name : display_name,
            title       : req.body.title,
            thumbnail   : req.body.thumbnail,
            content     : req.body.content,
            date        : currentDateTime,
            category    : req.body.category,
            tags        : tagsFiltered
        };
        
        db.collection('posts').insertOne(post, (err, result) => {
            if(err)
            {
                res.render('error', {
                    'message' : 'Failed to add blog post'
                })
            }
            else
            {
                //res.send(result.ops[0]);
                req.flash('success', 'Blog Post Submitted!');
                res.redirect('/');
                var currentDate = new Date().toLocaleString();
                console.log(currentDate + " | Blog Post Submitted by " + post.author_name + " (" + post.author_id + ") : '" + post.title + "'")
                
                // If author doesn't exist, add them to authors
                Author.count({'user_id' : user_id}, function(err, count){
                    if(count == 0)
                    {
                        flag = true;
                        console.log("Flag set to true. Author with that user id does not exist");
                        if(flag)
                        {
                            addAuthor(user_id);
                            //res.redirect('/');
                        }
                        else
                        {
                            res.redirect('/');
                        }
                    }
                });
            }
        });
    });
});

function addAuthor(user_id)
{
    console.log("Creating new author with user id: " + user_id);
    let newAuthor = new Author({
        user_id     : user_id,
        bio         : "Default Bio",
        profile_pic : "default_profile_pic.jpeg"
    });

    newAuthor.save(function(err){
        if(err)
        {
            console.log(err);
            return;
        }
        else
        {
            var currentDate = new Date().toLocaleString();
            console.log(currentDate + " | New Author Added: " + user_id);
            //req.flash('success','Blog post submitted. You have been added as a new author!');
            //res.redirect('/');
        }
    });
}

// Search Route
router.get('/search/', (req, res) => {
    var search_query = req.query.search_input
    if(search_query && search_query.length > 0)
    {
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
                id          : doc._id,
                author_id   : doc.author_id,
                author_name : doc.author_name,
                title       : doc.title,
                thumbnail   : doc.thumbnail,
                content     : doc.content,
                date        : doc.date,
                category    : categoryUpper,
                tags        : doc.tags
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
    }
    else
    {
        res.redirect('/');
    }
});

// Category Route
router.get('/articles/:category/', (req, res) => {
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
            id          : doc._id,
            author_id   : doc.author_id,
            author_name : doc.author_name,
            title       : doc.title,
            thumbnail   : doc.thumbnail,
            content     : doc.content,
            date        : doc.date,
            category    : categoryUpper,
            tags        : doc.tags
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

module.exports = router;