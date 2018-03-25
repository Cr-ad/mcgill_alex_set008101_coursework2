const blogRoutes = require('./blog_routes');

module.exports = function(blog_app, db) {
    blogRoutes(blog_app, db);
}