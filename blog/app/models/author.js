const mongoose = require('mongoose');

// Author schema

const AuthorSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    }
});


const User = module.exports = mongoose.model('Author', AuthorSchema);