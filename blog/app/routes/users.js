var ObjectID = require('mongodb').ObjectId;
var express = require('express');
var assert = require('assert');
var expressValidator = require('express-validator');
var router = new express.Router();
var path = require('path');

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

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
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors)
    {
        req.flash('error', 'Registration failed. Please try again');
        res.render('register', {
            errors:errors
        });
    }
    else
    {
        console.log("Success");
        let newUser = new User({
            first_name  : first_name,
            last_name   : last_name,
            email       : email,
            username    : username,
            password    : password
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err)
                {
                    console.log(err);
                }
                newUser.password = hash;
                console.log("set password to hash" + hash);
                newUser.save(function(err){
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    else
                    {
                        req.flash('success','Account successfully registered. Log in to get started!');
                        res.redirect('users/login');
                    }
                })
            });
        });
    }
});

router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', function(req, res){
    req.flash('success','Log in successful. Log in to get started!');
    res.redirect('login');
    
    //res.render('login');
});

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


module.exports = router;