const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');
const config = require('../config/db');
const bcrypt = require('bcryptjs');

module.exports = function(passport){

    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done){
        // Match Username
        let query = {username:username};
        User.findOne(query, function(err, user){
            if(err)
            {
                throw err;
            }
            if(!user)
            {
                return done(null, false, {message: 'Error: Username or Password is incorrect.'});
            }

            // Match Password
            bcrypt.compare(password, user.password, function(err, match){
                if(err)
                {
                    throw err;
                }
                if(match)
                {
                    return done(null, user);
                }
                else
                {
                    return done(null, false, {message: 'Error: Username or Password is incorrect.'});
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });

}