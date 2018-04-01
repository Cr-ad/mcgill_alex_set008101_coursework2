var ObjectID = require('mongodb').ObjectId;
var express = require('express');
var assert = require('assert');
var expressValidator = require('express-validator');
var router = new express.Router();
var path = require('path');

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

module.exports = function(blog_app, client) {
    
    function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    blog_app.get('/samples/', (req, res) => {
        res.render('samples', { title : 'The Sample Route'});
    });
};