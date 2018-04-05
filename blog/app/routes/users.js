var ObjectID = require('mongodb').ObjectId;
var express = require('express');
var assert = require('assert');
var expressValidator = require('express-validator');
var router = new express.Router();
var path = require('path');

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var db = mongoose.connection;

// Import User Model
let User = require('../models/user');


// Register Route
router.get('/register', function(req, res){
    res.render('register');
})

// Register Process
router.post('/register', function(req, res){
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    
    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('email', 'Email must be at least 4 characters').isLength(4);
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('username', 'Username must be at least 3 characters').isLength(3);
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must be at least 8 characters').isLength(8);
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    const invalid = "a";
    
    var cursor = db.collection('users').find();
    var usernameAlreadyExists = false;
    var emailAlreadyExists = false;
    cursor.forEach(function(user, err) {
        if(user.username == username)
        {
            usernameAlreadyExists = true;
        }
        if(user.email == email)
        {
            emailAlreadyExists = true;
        }
    }, function(){
        if(usernameAlreadyExists && username.length > 2)
        {
            // equals something that is not the input, so an error is thrown..
            console.log("Username already exists...");
            req.checkBody('username', 'Username already exists, try again with a different username.').equals(invalid);
        }
        if(emailAlreadyExists && email.length > 3)
        {
            // tell user email already exists
            console.log("Email already exists...");
            req.checkBody('email', 'Email address already exists, try again with a different email.').equals(invalid);
        }
        if(usernameAlreadyExists || emailAlreadyExists)
        {
            let errors = req.validationErrors();
            if(errors)
            {
                req.flash('error', 'Registration failed. Please try again');
                res.render('register', {
                    errors:errors
                });
            }
        }
        else
        {
            let newUser = new User({
                first_name  : first_name,
                last_name   : last_name,
                email       : email,
                username    : username,
                password    : password,
                isAdmin     : false
            });

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(newUser.password, salt, function(err, hash){
                    if(err)
                    {
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save(function(err){
                        if(err)
                        {
                            console.log(err);
                            return;
                        }
                        else
                        {
                            var currentDate = new Date().toLocaleString();
                            console.log(currentDate + " | New User Registered: " + newUser.username);
                            req.flash('success','Account successfully registered. Log in to get started!');
                            res.redirect('/users/login');
                        }
                    });
                });
            });
        }
    });
});

// Login Route
router.get('/login', function(req, res){
    res.render('login');
});

// Login Process

router.post('/login', function(req, res, next){
    passport.authenticate('local', {
      successRedirect:'/',
      failureRedirect:'/users/login',
      failureFlash: true
    })(req, res, next);
  });

  /*
  router.post('/login', function(req, res){
    console.log("body parsing", req.body);
    res.redirect('/');
  });
  */


// Logout Process
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
})

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


module.exports = router;