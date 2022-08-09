const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tags: [String],
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const article = mongoose.model("Article", articleSchema);
module.exports = article;