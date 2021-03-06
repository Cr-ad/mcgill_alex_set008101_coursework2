const mongoose = require('mongoose');

// Author schema

const AuthorSchema = mongoose.Schema({
    
    user_id: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        required: false
    },
    displayname: {
        type: String,
        required: true
    }
});


const User = module.exports = mongoose.model('Author', AuthorSchema);