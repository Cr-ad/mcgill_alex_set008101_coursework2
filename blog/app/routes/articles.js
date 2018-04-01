const express = require('express');
const router = express.router();
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