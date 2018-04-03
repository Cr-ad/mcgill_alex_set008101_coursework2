const express = require('express');
const router = new express.Router();
var mongoose = require('mongoose');
var assert = require('assert');
var expressValidator = require('express-validator');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;

// Bring in Article Model
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

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

router.get('/', function(req, res){
    res.render('authors');
});

router.get('/test', function(req, res){
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
        
        res.render('author_sample', {
            title : 'The Author Route',
            "posts": dbPosts
        });
    });
});

router.get('/:id/', function(req, res){
    const id = req.params.id;
    var flag = false;
    var dbPosts = [];
    console.log("id: " + id);
    var cursor = db.collection('posts').find({"author_id" : ObjectId(id)});
    var author = getAuthor(id);
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
            console.log("Post Title: "+ dbPosts[i].title);
        }
        res.render('author', {
            title : 'The Author Route',
            "posts": dbPosts,
            "author": author
        });
        console.log("Displaying author page: " + id);
        //console.log("Author bio: " + author.bio);
    });

    /*Author.count({'user_id' : id}, function(err, count){
        if(count > 0)
        {
            flag = true;
            console.log("user exists");
            //console.log("AP Length: " + getAuthorArticles(id).length);
        } 
    });
    */
    /*
    console.log("id: " + id);
    const authorPosts = getAuthorArticles(id);
    for(var current in authorPosts);
    {
        console.log("Title: " + current.title);
    }
    res.render('author', {
        title : 'The Author Route',
        "author": getAuthor(id),
        "posts": getAuthorArticles(id) 
    });
    */
});

function getAuthor(id)
{
    var author;
    console.log("Finding the author with user id: " + id);
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
        console.log("Author " + author.id + " found.");
        console.log("Author bio: "+ author.bio);
        console.log("Author profile pic: "+ author.profile_pic);
    });
    // Doesn't work because return is called before forEach finishes... 
    return author;
}
/*
function getAuthorArticles(id) {
    var dbPosts = [];
    var cursor = db.collection('posts').find({"author_id" : ObjectId(id)});
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
        console.log("Dates sorted");
    }, function(){
        console.log("Returning array");
        return dbPosts;
    });
}
*/

module.exports = router;