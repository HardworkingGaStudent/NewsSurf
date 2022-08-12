const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imgName: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const article = mongoose.model("Article", articleSchema);
module.exports = article;