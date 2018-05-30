const express = require('express');
const router = new express.Router();
var mongoose = require('mongoose');
var assert = require('assert');
var expressValidator = require('express-validator');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;
let Author = require('../models/author');

var db = mongoose.connection;

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// Get first 45 words from each post in the array
function getPostPreviews(dbPosts)
{
    var dbPostPreviews = [];
    for(i = 0; i < dbPosts.length; i++)
    {
        dbPostPreviews.push(getWords(dbPosts[i].content, 45));
    }
    return dbPostPreviews;
}

// Get the first x words from an input string
function getWords(str, numWords) {
    // Remove any occurrences of a HTML line break (<br / >)
    return str.split(/\s+/).slice(0,numWords).join(" ");
}

// Authors Route
router.get('/', function(req, res){
    var authors = [];
    var cursor = db.collection('authors').find();
    cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        var author = {
            id          : doc._id,
            user_id     : doc.user_id,
            bio         : doc.bio,
            profile_pic : doc.profile_pic,
            displayname : doc.displayname
        }
        authors.push(author);
    }, function() {
        // If any authors were found
        if(authors.length > 1)
        {
            // Sort alphabetically by name
            authors.sort(function compare(a,b){
                var name_a = a.displayname.toUpperCase();
                var name_b = b.displayname.toUpperCase();
                return (name_a < name_b) ? -1 : (name_a > name_b) ? 1 : 0;
            });
            
            res.render('authors', {
                title : 'Authors',
                "authors": authors,
            });
        }
        else
        {
            res.render('authors', {
                title : 'There are currently no existing authors!',
            });
        }
    });
});

// Author Route
router.get('/:id/', function(req, res){
    const id = req.params.id;
    var flag = false;
    var dbPosts = [];
    // Find the author using the provided ID
    // Using a cursor to allow a callback function
    var cursor = db.collection('posts').find({"author_id" : ObjectId(id)});
    cursor.forEach(function(doc, err) {
        assert.equal(null, err);
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
    }, function() {
        // Sort articles by date descending
        dbPosts.sort(function compare(a,b){
            return b.date.getTime() - a.date.getTime()
        });
        var author;
        var cursor = db.collection('authors').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            // If the current author user ID matches the ID of the user
            if(doc.user_id == id)
            {
                author = {
                    id : doc._id,
                    user_id : doc.user_id,
                    bio : doc.bio,
                    profile_pic : doc.profile_pic
                }
            }
        }, function(){
            res.render('author', {
                title : 'Author',
                "posts": dbPosts,
                "postPreviews": getPostPreviews(dbPosts),
                "author": author
            });
        });
    });
});

// Edit Route
router.get('/edit/:id', function(req, res){
    
    var input_id = req.params.id;
    // If user is not logged in send an error
    if(!req.user)
    {
        res.redirect('/');
        res.status(500).send();
    }
    // If the input is not a valid id send an error
    else if(input_id.length != 24)
    {
        res.redirect('/');
        res.status(500).send();
    }
    else
    {
        let query = {"user_id" : input_id};
        // Check if user should be able to edit the article
        db.collection('authors').findOne(query, function(err, author){
            // If the logged in user is an admin or it is their author profile
            if((req.user.isAdmin) || (author.user_id == req.user.id))
            {
                res.render('author_edit', {
                    title : 'Edit Author',
                    author : author
                });
            }
            else
            {            
                res.render('error', {
                    message : "You do not have permission to edit this authors profile",
                    error: {}
                })
            }
        });
    }
});

// Edit Process
router.post('/edit/:id', function(req, res){
    var input_id = req.params.id;
    // If user is not logged in send an error
    if(!req.user)
    {
        res.redirect('/');
        res.status(500).send();
    }
    // If the input is not a valid id send an error
    else if(input_id.length != 24)
    {
        res.redirect('/');
        res.status(500).send();
    }
    else
    {
        let query = {"user_id" : input_id};
        var author;
        // Find the author with the matching user ID
        var cursor = db.collection('authors').find(query);
        cursor.forEach(function(doc, err){
            assert.equal(null, err);
            author = doc;
            var default_profile_pic = "default_profile_pic.jpeg";
            // If a profile picture input was not entered (undefined)
            if(typeof req.body.profile_pic == 'undefined')
            {
                author.profile_pic = default_profile_pic;
            }
            else
            {
                author.profile_pic = req.body.profile_pic;
            }
            author.bio = req.body.bio;
        }, function(){
            // Check if user should be able to edit the article
            if((req.user.isAdmin) || (author.user_id == req.user.id))
            {
                // Find the author with the matching user ID, update the author with the new inputs
                db.collection('authors').update(query, author, (err, result) => {
                    // If the logged in user is an admin or it is their author profile
                    if(err)
                    {
                        res.render('error', {
                            'message' : 'Failed to edit Blog Post',
                            error : {}
                        });
                    }
                    else
                    {
                        res.redirect('/');
                        var currentDate = new Date().toLocaleString();
                        console.log(currentDate + " | Author " + author.displayname + " : User ID " + author.user_id + "' : Updated by " + req.user.id);
                    }
                });
            }
            else
            {            
                res.render('error', {
                    message : "You do not have permission to edit this authors profile",
                    error: {}
                });
            }
        });
    }
});

module.exports = router;