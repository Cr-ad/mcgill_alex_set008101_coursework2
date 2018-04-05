const mongoose = require('mongoose');

// Article schema

const ArticleSchema = mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        required: true
    }],
});


const User = module.exports = mongoose.model('Article', ArticleSchema);