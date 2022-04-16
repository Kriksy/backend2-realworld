const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    slug: {
        type: String,
        default: "no slug",
        unique: true,
    },
    title: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
    },
    body: {
        type: String,
        // required: true,
    },
    favoritesCount: {
        type: Number, default: 0
    },
    tagList: [{ type: String }],
    author: {
        // type: String,
        // default: "Unknown Author"
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    favorited: { type: Boolean, default: false },
    favoritedBy: [{
        type: String,
    }]

}, { timestamps: true })

const Article = mongoose.model("Article", articleSchema);
exports.Article = Article;
