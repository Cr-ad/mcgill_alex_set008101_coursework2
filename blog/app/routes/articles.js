const express = require('express');
const router = new express.Router();
var mongoose = require('mongoose');
var assert = require('assert');
var expressValidator = require('express-validator');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;

// Get Required Models
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

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Gets the first 45 words of each post in the array  
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
    str = str.replace('<br />', ' ');
    return str.split(/\s+/).slice(0,numWords).join(" ");
}

// Used for splitting the array of tags into one long string
function arrayToString(array)
{
    var output = "";
    for(i = 0; i < array.length; i++)
    {
        output += array[i];
        if(i < array.length - 1)
        {
            output += ", ";
        }
    }
    return output;
}

// Articles Route
router.get('/', (req, res) => {
    var dbPosts = [];
    var cursor = db.collection('posts').find();
    // Execute the each command, triggers for each document
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
        var suggested = getRandomArticle(dbPosts);
        res.render('articles', {
            title : 'Blog Central',
            "posts": dbPosts,
            "postPreviews": getPostPreviews(dbPosts),
            suggested : suggested
        });
    });
});

// Return a randomly selected article
function getRandomArticle(array)
{
    // Set a random number between 1 and the length of the input array - 1
    var random = Math.floor(Math.random() * ((array.length-1)) + 1);
    return array[random];
}

// Article Route
router.get('/articles/:category/:id', (req, res) => {
    const category = req.params.category;
    const id = req.params.id;
    var selectedPost;
    var dbPosts = [];
    var relatedPosts = [];
    var cursor = db.collection('posts').find();
    // Execute the each command, triggers for each document
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
        if(post.id == id)
        {
            selectedPost = post;
        }
        else
        {
            dbPosts.push(post);
        }
    }, function() {
        // Sort articles by date descending
        dbPosts.sort(function compare(a,b){
            return b.date.getTime() - a.date.getTime()
        });
        var flag = false;
        // Get the related articles (articles with at least 1 matching tag)
        for(i = 0; i < dbPosts.length; i++)
        {
            // Reset the flag
            flag = false;
            // Loop through each tag in the current post
            for(j = 0; j < dbPosts[i].tags.length; j++)
            {
                // Loop through each tag in the selected post
                for(k = 0; k < selectedPost.tags.length; k++)
                {
                    // If the tag in the selected post matches the tag in the current post
                    if(selectedPost.tags[k] == dbPosts[i].tags[j])
                    {
                        flag = true;
                    }
                }
            }
            // If a tag match was found
            if(flag)
            {
                // Add the post to the related posts list
                relatedPosts.push(dbPosts[i]);
            }
        }
        res.render('article', {
            title : 'Article',
            "selectedPost": selectedPost,
            "posts": relatedPosts
        });
    });
});

// Add Article Route
router.get('/article_add/', (req, res) => {
    res.render('article_add', {
        title : 'Add Article',
        categories : all_categories
    });
});

// Add Article Process
router.post('/article_add/', (req, res) => {
    var user_id = req.user._id;
    var originalTagString = req.body.tags;
    originalTagString = originalTagString.toLowerCase();
    var tagsUnfiltered = originalTagString.split(',');
    var tagsFiltered = new Array();
    var currentDateTime = new Date();
    var display_name;
    // Loop through each of the tags
    for(i = 0; i < tagsUnfiltered.length; i++)
    {
        var current = tagsUnfiltered[i];
        // Loop until the first character isn't a space or a comma
        while(current.charAt(0) == ' ' || current.charAt(0) == ',')
        {
            current = current.substring(1);
        }
        if(current.length > 2)
        {
            // Add the tag to the list of tags
            tagsFiltered.push(current);
        }
    }
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
                res.redirect('/');
                var currentDate = new Date().toLocaleString();
                console.log(currentDate + " | Blog Post Submitted by " + post.author_name + " (" + post.author_id + ") : '" + post.title + "'")
                
                // If user isn't already an author, add them to authors
                Author.count({'user_id' : user_id}, function(err, count){
                    if(count == 0)
                    {
                        addAuthor(user_id, post.author_name);
                    }
                });
            }
        });
    });
});

// Add specified user to the database of authors
function addAuthor(user_id)
{
    let newAuthor = new Author({
        user_id     : user_id,
        bio         : "Default Bio",
        profile_pic : "default_profile_pic.jpeg",
        displayname : post.author_name
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
        }
    });
}

// Edit Route
router.get('/edit/:id', function(req, res){
    // If user is not logged in send error
    var input_id = req.params.id;
    if(!req.user)
    {
        res.redirect('/');
        res.status(500).send();
    }
    else if(input_id.length != 24)
    {
        res.redirect('/');
        res.status(500).send();
    }
    else
    {
        let query = {"_id" : ObjectId(input_id)};
        // Check if user should be able to edit the article
        db.collection('posts').findOne(query, function(err, article){
            // If the logged in user is the article author or an admin
            if((req.user.isAdmin) || (article.author_id == req.user.id))
            {
                res.render('article_edit', {
                    article : article,
                    categories : all_categories,
                    tags : arrayToString(article.tags)
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

// Edit Process
router.post('/edit/:id', function(req, res){
    var input_id = req.params.id;
    let query = {"_id" : ObjectId(input_id)};
    var userHasEditPermissions = false;
    var originalDate;
    var originalAuthorId;
    var originalAuthorName;
    var originalArticle;
    // Check if user should be able to edit the article
    if(!req.user)
    {
        res.redirect('/');
        res.status(500).send();
    }
    else if(input_id.length != 24)
    {
        res.redirect('/');
        res.status(500).send();
    }
    else
    {
        let query = {"_id" : ObjectId(input_id)};
        // Check if user should be able to edit the article
        var cursor = db.collection('posts').find(query);
        cursor.forEach(function(article, err){
            // If the logged in user is the article author or an admin
            if((req.user.isAdmin) || (article.author_id == req.user.id))
            {
                userHasEditPermissions = true;
            }
            originalDate = article.date;
            originalAuthorId = article.author_id;
            originalAuthorName = article.author_name;
            originalArticle = article;

        }, function(){
            if(userHasEditPermissions)
            {
                var originalTagString = req.body.tags;
                originalTagString = originalTagString.toLowerCase();
                var tagsUnfiltered = originalTagString.split(',');
                var tagsFiltered = new Array();
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
                // Create the blog post
                const post = {
                    author_id   : originalAuthorId,
                    author_name : originalAuthorName,
                    title       : req.body.title,
                    thumbnail   : req.body.thumbnail,
                    content     : req.body.content,
                    date        : originalDate,
                    category    : req.body.category,
                    tags        : tagsFiltered
                };
                db.collection('posts').update(query, post, (err, result) => {
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
                        console.log(currentDate + " | Blog Post " + originalArticle._id + " : Title '" + post.title + "' : Updated by " + req.user.id);
                    }
                });
            }
            else
            {
                res.redirect('/');
            }
        });
    }
});

// Delete Route
router.delete('/delete/:id', function(req, res){
    var input_id = req.params.id;
    // If user is not logged in send error
    if(!req.user.id) {
        res.status(500).send();
    }

    let query = {_id : ObjectId(input_id)};
    // Check if user should be able to delete
    var cursor = db.collection('posts').find();
    cursor.forEach(function(article, err){
        // Get the correct article to remove
        if(input_id == article._id)
        {
            var match;
            if(article.author_id == req.user.id)
            {
                match = true;
            }
            console.log("Match: " + match + " | isadmin: " + req.user.isAdmin);
            // Make sure user has permission to remove the article
            if((req.user.isAdmin) || (article.author_id == req.user.id))
            {
                var article_id = article._id;
                var article_author = article.author_id;
                var article_title = article.title;
                db.collection('posts').deleteOne(query, function(err){
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.send('Success');
                        console.log("Blog Post " + article_id + " : Title '" + article_title + "' : Deleted by " + req.user.id);
                    }
                });
            }
            else
            {
                res.status(500).send();
            }
        }
    });
});

// Search Route
router.get('/search/', (req, res) => {
    var orignal_input = req.query.search_input;
    var search_query = req.query.search_input;
    // Make sure search query was entered
    if(search_query && search_query.length > 0)
    {
        search_query = search_query.toLowerCase();
        var categoryUpper;
        var search_tags = search_query.split(/[,]+/);
        var dbPosts = [];
        // Search for the first query entered
        var cursor = db.collection('posts').find({tags: search_tags[0]});
        // Execute the each command, triggers for each document
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            // Convert the first letter of the category to uppercase to look nicer
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
            };
            var alreadyAdded = false;
            // Check to see if post is already in the array
            for(var currentPost in dbPosts)
            {
                if(post.id == currentPost.id)
                {
                    alreadyAdded = true;
                }
            }
            if(!alreadyAdded)
            {
                dbPosts.push(post);
            }
        }, function(){
            if(dbPosts.length > 0)
            {
                // Sort articles by date descending
                dbPosts.sort(function compare(a,b){
                return b.date.getTime() - a.date.getTime()
                });

                res.render('search', {
                    title : 'Search',
                    "search_query" : search_query,
                    "posts": dbPosts,
                    "postPreviews": getPostPreviews(dbPosts)
                });
            }
            else
            {
                res.render('search_empty', {
                    title : 'Search',
                    "search_query" : search_query
                });
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
    // Redirect shortened category urls to the full category
    if(selected_category == "tech")
    {
        selected_category = "technology";
    }
    selected_category = capitaliseFirstLetter(selected_category);
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
    }, function() {
        
        if(dbPosts.length > 0)
        {
            // Sort articles by date descending
            dbPosts.sort(function compare(a,b){
                return b.date.getTime() - a.date.getTime()
            });
            var suggested = getRandomArticle(dbPosts);
            res.render('category', {
                title : 'Category',
                category : categoryUpper,
                "posts": dbPosts,
                "postPreviews": getPostPreviews(dbPosts),
                suggested : suggested
            });
        }
        else
        {
            res.render('empty_category', {
                title : 'Category Unavailable',
                category : req.params.category
            });
        }
    });
});

module.exports = router;