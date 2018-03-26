var ObjectID = require('mongodb').ObjectId;
var express = require('express');
var router = new express.Router();
var path = require('path');

module.exports = function(blog_app, client) {
    
    var db = client.db('blog_db');

    // Home Route
    blog_app.get('/', (req, res) => {
       res.render('index', { title : 'The Home Route'});
    });

    // Test Route
    blog_app.get('/test/', (req, res) => {
        res.render('index', { title : 'The Test Route'});
    });


    
    

    // Articles Route
    blog_app.get('/articles/', (req, res) => {
        let posts = [
            {
                author: "Jim Halpert",
                title: "Elon Musk Deletes SpaceX and Tesla Facebook Pages",
                post:   "As the #DeleteFacebook campaign ramps up, even SpaceX and Tesla CEO Elon Musk is weighing in. The billionaire entrepreneur doesn’t have a Facebook account to delete. He’s more of an Instagram user, which is owned by Facebook. <br /><br />But on Friday, Musk said he would delete the official Facebook pages for SpaceX and Tesla. The SpaceX page was deleted soon after his comments on Twitter. <br /><br />The promise all started during an exchange on Twitter when Musk referenced an article by The Verge about Sonos pulling ads off of Facebook for a week. Musk provided a link to the story and a snarky comment, 'Wow, a whole week. Risky …'",
                date:   "26/03/2018",
                category: "Technology"
            },
            {
                author: "Michael Scott",
                title: "Elon Musk Deletes SpaceX and Tesla Facebook Pages",
                post:   "As the #DeleteFacebook campaign ramps up, even SpaceX and Tesla CEO Elon Musk is weighing in. The billionaire entrepreneur doesn’t have a Facebook account to delete. He’s more of an Instagram user, which is owned by Facebook. <br /><br />But on Friday, Musk said he would delete the official Facebook pages for SpaceX and Tesla. The SpaceX page was deleted soon after his comments on Twitter. <br /><br />The promise all started during an exchange on Twitter when Musk referenced an article by The Verge about Sonos pulling ads off of Facebook for a week. Musk provided a link to the story and a snarky comment, 'Wow, a whole week. Risky …'",
                date:   "25/03/2018",
                category: "Technology"
            },
            {
                author: "Pam Beasley",
                title: "Elon Musk Deletes SpaceX and Tesla Facebook Pages",
                post:   "As the #DeleteFacebook campaign ramps up, even SpaceX and Tesla CEO Elon Musk is weighing in. The billionaire entrepreneur doesn’t have a Facebook account to delete. He’s more of an Instagram user, which is owned by Facebook. <br /><br />But on Friday, Musk said he would delete the official Facebook pages for SpaceX and Tesla. The SpaceX page was deleted soon after his comments on Twitter. <br /><br />The promise all started during an exchange on Twitter when Musk referenced an article by The Verge about Sonos pulling ads off of Facebook for a week. Musk provided a link to the story and a snarky comment, 'Wow, a whole week. Risky …'",
                date:   "24/03/2018",
                category: "Technology"
            }
        ];
        res.render('articles', {
            title : 'The Articles Route',
            "posts": posts
        });
    });

    // Samples Route
    blog_app.get('/samples/', (req, res) => {
        res.render('samples', { title : 'The Sample Route'});
    });

    blog_app.get('/posts/:id', (req, res) => {

        const id = req.params.id;
        const details = {'_id' : new ObjectID(id) };
        db.collection('posts').findOne(details, (err, item) => {
            if(err)
            {
                res.send({ 'error' : 'An error occurred' });
            }
            else
            {
                res.send(item);
            }
        });
    });

    blog_app.delete('/posts/:id', (req, res) => {

        const id = req.params.id;
        const details = {'_id' : new ObjectID(id) };
        db.collection('posts').remove(details, (err, item) => {
            if(err)
            {
                res.send({ 'error' : 'An error occurred' });
            }
            else
            {
                res.send('Note ' + id + ' has been removed');
            }
        });
    });
    
    blog_app.put('/posts/:id', (req, res) => {

        const id = req.params.id;
        const details = {'_id' : new ObjectID(id) };
        const post = {text: req.body.body, title: req.body.title };
        db.collection('posts').update(details, post, (err, item) => {
            if(err)
            {
                res.send({ 'error' : 'An error occurred' });
            }
            else
            {
                res.send(item);
            }
        });
    });
    
    blog_app.post('/posts', (req, res) => {
        // Create the blog post
        const post = {text: req.body.body, title: req.body.title };
        
        db.collection('posts').insertOne(post, (err, result) => {
            if(err)
            {
                res.send({ 'error' : 'An error occurred' });
            }
            else
            {
                res.send(result.ops[0]);
            }
        })


    });
};