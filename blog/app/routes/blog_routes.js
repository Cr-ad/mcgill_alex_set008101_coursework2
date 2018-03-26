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
                title: "Elon Musk Lands on Mars",
                thumbnail: "/images/tesla_model_s.jpg",
                content:   "Lorem ipsum dolor sit amet, maluisset salutatus ea mei, id vim erant tincidunt instructior. Probo ornatus partiendo mei eu, nonumy partiendo democritum mei ei, mollis iisque eam no. Quod aeterno malorum ei nam, mel cu partem mandamus. Sit causae iriure at, qui habeo oblique epicuri eu. Mutat facilis id pri, ea qui vocibus volutpat, eruditi noluisse per te.<br /><br />Ea cum quem quod tincidunt, mea latine efficiendi persequeris cu. No sed simul zril regione, nemore epicurei scribentur nec et, aliquid fabulas definiebas te sed. Eam ne saepe perfecto vulputate, iusto homero eu sed, id est dico oblique. Eum ad adhuc scripta. Pro enim brute ea, no nihil iisque mentitum duo, veri ludus dissentiunt ea eam. At omnes concludaturque mea, dicit lucilius reprehendunt mea et, noster animal perfecto no sea.<br /><br />Errem vocent delicatissimi eum an. Et consul denique reformidans eum, quo ea senserit pericula. At sit omnis eirmod interesset, no mei platonem reprimique, ei vix nobis fastidii qualisque. In pro natum omittantur. Mel recusabo repudiare ea.<br /><br />An duo tritani ponderum. Ei perpetua accusamus adolescens mel. Mei cu recusabo consequat, graeco regione in per, ea mel tantas eirmod reprehendunt. Duis percipitur neglegentur has ad, idque scripta vix ut. Eu minimum dignissim usu. Nec soluta corpora id.<br /><br />Illud epicuri at vis, est officiis forensibus ex. Ne wisi dicat exerci pri. Usu ut discere voluptua adolescens. Omnium placerat mel ut, te eos dicta suavitate. Ea luptatum sententiae consetetur qui, appetere vituperata ius ne.",
                date:   "26/03/2018",
                category: "Technology",
                tags: ["Cars", "Tesla", "Elon Musk"]
            },
            {
                author: "Michael Scott",
                title: "Elon Musk Deletes SpaceX and Tesla Facebook Pages",
                thumbnail: "/images/tesla_roadster.jpg",
                content:   "Lorem ipsum dolor sit amet, maluisset salutatus ea mei, id vim erant tincidunt instructior. Probo ornatus partiendo mei eu, nonumy partiendo democritum mei ei, mollis iisque eam no. Quod aeterno malorum ei nam, mel cu partem mandamus. Sit causae iriure at, qui habeo oblique epicuri eu. Mutat facilis id pri, ea qui vocibus volutpat, eruditi noluisse per te.<br /><br />Ea cum quem quod tincidunt, mea latine efficiendi persequeris cu. No sed simul zril regione, nemore epicurei scribentur nec et, aliquid fabulas definiebas te sed. Eam ne saepe perfecto vulputate, iusto homero eu sed, id est dico oblique. Eum ad adhuc scripta. Pro enim brute ea, no nihil iisque mentitum duo, veri ludus dissentiunt ea eam. At omnes concludaturque mea, dicit lucilius reprehendunt mea et, noster animal perfecto no sea.<br /><br />Errem vocent delicatissimi eum an. Et consul denique reformidans eum, quo ea senserit pericula. At sit omnis eirmod interesset, no mei platonem reprimique, ei vix nobis fastidii qualisque. In pro natum omittantur. Mel recusabo repudiare ea.<br /><br />An duo tritani ponderum. Ei perpetua accusamus adolescens mel. Mei cu recusabo consequat, graeco regione in per, ea mel tantas eirmod reprehendunt. Duis percipitur neglegentur has ad, idque scripta vix ut. Eu minimum dignissim usu. Nec soluta corpora id.<br /><br />Illud epicuri at vis, est officiis forensibus ex. Ne wisi dicat exerci pri. Usu ut discere voluptua adolescens. Omnium placerat mel ut, te eos dicta suavitate. Ea luptatum sententiae consetetur qui, appetere vituperata ius ne.",
                date:   "25/03/2018",
                category: "Automotive",
                tags: ["Cars", "Tesla", "Elon Musk"]
            },
            {
                author: "Pam Beasley",
                title: "Elon Musk Finds Out What It Means To Be Human",
                thumbnail: "/images/tesla_model_3.jpg",
                content:   "Lorem ipsum dolor sit amet, maluisset salutatus ea mei, id vim erant tincidunt instructior. Probo ornatus partiendo mei eu, nonumy partiendo democritum mei ei, mollis iisque eam no. Quod aeterno malorum ei nam, mel cu partem mandamus. Sit causae iriure at, qui habeo oblique epicuri eu. Mutat facilis id pri, ea qui vocibus volutpat, eruditi noluisse per te.<br /><br />Ea cum quem quod tincidunt, mea latine efficiendi persequeris cu. No sed simul zril regione, nemore epicurei scribentur nec et, aliquid fabulas definiebas te sed. Eam ne saepe perfecto vulputate, iusto homero eu sed, id est dico oblique. Eum ad adhuc scripta. Pro enim brute ea, no nihil iisque mentitum duo, veri ludus dissentiunt ea eam. At omnes concludaturque mea, dicit lucilius reprehendunt mea et, noster animal perfecto no sea.<br /><br />Errem vocent delicatissimi eum an. Et consul denique reformidans eum, quo ea senserit pericula. At sit omnis eirmod interesset, no mei platonem reprimique, ei vix nobis fastidii qualisque. In pro natum omittantur. Mel recusabo repudiare ea.<br /><br />An duo tritani ponderum. Ei perpetua accusamus adolescens mel. Mei cu recusabo consequat, graeco regione in per, ea mel tantas eirmod reprehendunt. Duis percipitur neglegentur has ad, idque scripta vix ut. Eu minimum dignissim usu. Nec soluta corpora id.<br /><br />Illud epicuri at vis, est officiis forensibus ex. Ne wisi dicat exerci pri. Usu ut discere voluptua adolescens. Omnium placerat mel ut, te eos dicta suavitate. Ea luptatum sententiae consetetur qui, appetere vituperata ius ne.",
                date:   "24/03/2018",
                category: "Sports",
                tags: ["Cars", "Tesla", "Elon Musk"]
            }
        ];
        res.render('articles', {
            title : 'The Articles Route',
            "posts": posts
        });
    });

    // Articles Route
    blog_app.get('/articles/test', (req, res) => {
        /*const id = req.params.id;
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
        }); */
        let posts = [
            {
                author: "Jim Halpert",
                title: "Elon Musk Lands on Mars",
                thumbnail: "/images/tesla_model_s.jpg",
                content:   "Lorem ipsum dolor sit amet, maluisset salutatus ea mei, id vim erant tincidunt instructior. Probo ornatus partiendo mei eu, nonumy partiendo democritum mei ei, mollis iisque eam no. Quod aeterno malorum ei nam, mel cu partem mandamus. Sit causae iriure at, qui habeo oblique epicuri eu. Mutat facilis id pri, ea qui vocibus volutpat, eruditi noluisse per te.<br /><br />Ea cum quem quod tincidunt, mea latine efficiendi persequeris cu. No sed simul zril regione, nemore epicurei scribentur nec et, aliquid fabulas definiebas te sed. Eam ne saepe perfecto vulputate, iusto homero eu sed, id est dico oblique. Eum ad adhuc scripta. Pro enim brute ea, no nihil iisque mentitum duo, veri ludus dissentiunt ea eam. At omnes concludaturque mea, dicit lucilius reprehendunt mea et, noster animal perfecto no sea.<br /><br />Errem vocent delicatissimi eum an. Et consul denique reformidans eum, quo ea senserit pericula. At sit omnis eirmod interesset, no mei platonem reprimique, ei vix nobis fastidii qualisque. In pro natum omittantur. Mel recusabo repudiare ea.<br /><br />An duo tritani ponderum. Ei perpetua accusamus adolescens mel. Mei cu recusabo consequat, graeco regione in per, ea mel tantas eirmod reprehendunt. Duis percipitur neglegentur has ad, idque scripta vix ut. Eu minimum dignissim usu. Nec soluta corpora id.<br /><br />Illud epicuri at vis, est officiis forensibus ex. Ne wisi dicat exerci pri. Usu ut discere voluptua adolescens. Omnium placerat mel ut, te eos dicta suavitate. Ea luptatum sententiae consetetur qui, appetere vituperata ius ne.",
                date:   "26/03/2018",
                category: "Technology",
                tags: ["Cars", "Tesla", "Elon Musk"]
            },
            {
                author: "Michael Scott",
                title: "Elon Musk Deletes SpaceX and Tesla Facebook Pages",
                thumbnail: "/images/tesla_roadster.jpg",
                content:   "Lorem ipsum dolor sit amet, maluisset salutatus ea mei, id vim erant tincidunt instructior. Probo ornatus partiendo mei eu, nonumy partiendo democritum mei ei, mollis iisque eam no. Quod aeterno malorum ei nam, mel cu partem mandamus. Sit causae iriure at, qui habeo oblique epicuri eu. Mutat facilis id pri, ea qui vocibus volutpat, eruditi noluisse per te.<br /><br />Ea cum quem quod tincidunt, mea latine efficiendi persequeris cu. No sed simul zril regione, nemore epicurei scribentur nec et, aliquid fabulas definiebas te sed. Eam ne saepe perfecto vulputate, iusto homero eu sed, id est dico oblique. Eum ad adhuc scripta. Pro enim brute ea, no nihil iisque mentitum duo, veri ludus dissentiunt ea eam. At omnes concludaturque mea, dicit lucilius reprehendunt mea et, noster animal perfecto no sea.<br /><br />Errem vocent delicatissimi eum an. Et consul denique reformidans eum, quo ea senserit pericula. At sit omnis eirmod interesset, no mei platonem reprimique, ei vix nobis fastidii qualisque. In pro natum omittantur. Mel recusabo repudiare ea.<br /><br />An duo tritani ponderum. Ei perpetua accusamus adolescens mel. Mei cu recusabo consequat, graeco regione in per, ea mel tantas eirmod reprehendunt. Duis percipitur neglegentur has ad, idque scripta vix ut. Eu minimum dignissim usu. Nec soluta corpora id.<br /><br />Illud epicuri at vis, est officiis forensibus ex. Ne wisi dicat exerci pri. Usu ut discere voluptua adolescens. Omnium placerat mel ut, te eos dicta suavitate. Ea luptatum sententiae consetetur qui, appetere vituperata ius ne.",
                date:   "25/03/2018",
                category: "Automotive",
                tags: ["Cars", "Tesla", "Elon Musk"]
            },
            {
                author: "Pam Beasley",
                title: "Elon Musk Finds Out What It Means To Be Human",
                thumbnail: "/images/tesla_model_3.jpg",
                content:   "Lorem ipsum dolor sit amet, maluisset salutatus ea mei, id vim erant tincidunt instructior. Probo ornatus partiendo mei eu, nonumy partiendo democritum mei ei, mollis iisque eam no. Quod aeterno malorum ei nam, mel cu partem mandamus. Sit causae iriure at, qui habeo oblique epicuri eu. Mutat facilis id pri, ea qui vocibus volutpat, eruditi noluisse per te.<br /><br />Ea cum quem quod tincidunt, mea latine efficiendi persequeris cu. No sed simul zril regione, nemore epicurei scribentur nec et, aliquid fabulas definiebas te sed. Eam ne saepe perfecto vulputate, iusto homero eu sed, id est dico oblique. Eum ad adhuc scripta. Pro enim brute ea, no nihil iisque mentitum duo, veri ludus dissentiunt ea eam. At omnes concludaturque mea, dicit lucilius reprehendunt mea et, noster animal perfecto no sea.<br /><br />Errem vocent delicatissimi eum an. Et consul denique reformidans eum, quo ea senserit pericula. At sit omnis eirmod interesset, no mei platonem reprimique, ei vix nobis fastidii qualisque. In pro natum omittantur. Mel recusabo repudiare ea.<br /><br />An duo tritani ponderum. Ei perpetua accusamus adolescens mel. Mei cu recusabo consequat, graeco regione in per, ea mel tantas eirmod reprehendunt. Duis percipitur neglegentur has ad, idque scripta vix ut. Eu minimum dignissim usu. Nec soluta corpora id.<br /><br />Illud epicuri at vis, est officiis forensibus ex. Ne wisi dicat exerci pri. Usu ut discere voluptua adolescens. Omnium placerat mel ut, te eos dicta suavitate. Ea luptatum sententiae consetetur qui, appetere vituperata ius ne.",
                date:   "24/03/2018",
                category: "Sports",
                tags: ["Cars", "Tesla", "Elon Musk"]
            }
        ];
        res.render('article', {
            title : 'The Article Route',
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