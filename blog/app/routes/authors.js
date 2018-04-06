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
    res.render('authors');
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

module.exports = router;