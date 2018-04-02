const express = require('express');
const router = new express.Router();
var mongoose = require('mongoose');
var assert = require('assert');
var expressValidator = require('express-validator');
var path = require('path');

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
        
        res.render('author', {
            title : 'The Author Route',
            "posts": dbPosts
        });
    });
});

module.exports = router;