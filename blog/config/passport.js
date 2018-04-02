const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../app/models/user');
const config = require('../config/db');
const bcrypt = require('bcryptjs');

var db = mongoose.connection;

module.exports = function(passport){

    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done){
        // Match Username
        let query = {username:username};
        console.log("here");
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
        console.log("Serialise user called");
        done(null, user.id);
    });
    
      passport.deserializeUser(function(id, done) {
        console.log("Deserialise user called");
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });

}