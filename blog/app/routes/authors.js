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

function getPostPreviews(dbPosts)
{
    var dbPostPreviews = [];
    for(i = 0; i < dbPosts.length; i++)
    {
        dbPostPreviews.push(getWords(dbPosts[i].content, 45));
    }
    return dbPostPreviews;
}

function getWords(str, numWords) {
    return str.split(/\s+/).slice(0,numWords).join(" ");
}

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
        if(authors.length > 1)
        {
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

router.get('/:id/', function(req, res){
    const id = req.params.id;
    var flag = false;
    var dbPosts = [];
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
                title : 'The Author Route',
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
        console.log("1 - User is not logged in");
        res.redirect('/');
        res.status(500).send();
    }
    // If the input is not a valid id send an error
    else if(input_id.length != 24)
    {
        console.log("2 - Input ID is not valid");
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
                    author : author,
                });
            }
            else
            {            
                res.render('error', {
                    message : "You do not have permission to edit this article",
                    error: {}
                })
            }
        });
    }
});

module.exports = router;