module.exports = function(blog_app, db) {
    blog_app.post('/posts', (req, res) => {
        // Create the blog post
        
        console.log(req.body);
        res.send('Hello')


    });
};