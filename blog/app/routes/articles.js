const express = require('express');
const router = new express.Router();
var mongoose = require('mongoose');
var assert = require('assert');
var expressValidator = require('express-validator');
var path = require('path');

// Bring in Article Model
let Article = require('../models/article');
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
router.get('/:category/:id', (req, res) => {
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

// Add Article Route
router.get('/add_article/', (req, res) => {
    res.render('add_article', {
        title : 'The Add Article Route',
        categories : all_categories
    });
});

router.post('/add_article/', (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('thumbnail', 'Thumbnail is required').notEmpty();
    req.checkBody('content', 'Content is required').notEmpty();
    req.checkBody('category', 'Category is required').equals(!"Select...");
    req.checkBody('tags', 'Tags is required').notEmpty();
    
    let errors = req.validationErrors();

    if(errors)
    {
        res.render('add_article', {
            title: 'Add Article',
            errors : errors,
            categories : all_categories
        });
    }
    else
    {
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
                req.flash('success', 'Blog Post Submitted!');
                res.redirect('/');
                var currentDate = new Date().toLocaleString();
                console.log(currentDate + " | Blog Post Submitted by " + post.author + " : '" + post.title + "'")
                //alert("Blog Post Successfully Submitted!");
            }
        });
    }    
});

// Category Route
router.get('/:category/', (req, res) => {
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

module.exports = router;