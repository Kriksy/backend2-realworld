const { Router } = require("express");
const { User } = require("../../../models/userSchema");
const { Article } = require("../../../models/articleSchema");
const { Db } = require("mongodb");
const { requireLogin } = require("../../../token");

const route = Router();

route.use("/comments", require("./comments"));

// Get ALL articles
route.get("/", async (req, res) => {
    const query = {}; //initialize query as an empty object
    console.log("req.query")
    console.log(req.query)
    // If req.query.author includes a value (it's not undefined), set author value in empty "query" object to req.query.author.

    //GET Articles by Author
    if (req.query.author) {
        // query.author = req.query.author;

        const user = await User.findOne({ username: req.query.author });
        if (user) {
            query.author = user._id;
        }
        else {
            query.author = null;
        }
    }

    //GET Articles by Tag
    if (req.query.tag) {
        query.tagList = req.query.tag;
    }

    //GET Articles Favorited by Username
    if (req.query.favorited) {
        query.favoritedBy = req.query.favorited
    }

    // https://stackoverflow.com/questions/4299991/how-to-sort-in-mongoose
    var articles = await Article.find(query, null, { sort: { tagList: "descending" } }) // descending, desc: descend stiga ned (motsatsen av alfabetsordning 🤯 )

    console.log("hey:", query)
    articlesCount = articles.length;

    // Add articlesCount field and value to articles
    articles = { articles }, articles.articlesCount = articlesCount;

    res.send(articles)

})



// Get a single article
route.get("/:slug", async (req, res) => {

    var article = await Article.findOne({ slug: req.params.slug });
    res.send({ article })
})


// Get an Author's Articles
// route.get(`/`, requireLogin, async (req, res) => {

//     console.log("req.query:")
//     console.log(req.query)

//     console.log("req.body:")
//     console.log(req.body)


//     var article = await Article.findOne({ slug: req.params.slug });
//     res.send({ article })
// })


// CREATE AN ARTICLE
route.post("/", requireLogin, async (req, res) => {
    // Lägger till user_id i article
    // req.user kommer från jwt token
    req.body.article.author = req.user.user_id


    // Skapar slug från artikel titel - https://sv.frwiki.wiki/wiki/Slug_%28journalisme%29
    let newSlug = req.body.article.title;
    newSlug = newSlug.replaceAll(' ', '-').toLowerCase()

    req.body.article.slug = newSlug
    const article = new Article(req.body.article)

    article.tagList.reverse(); // Reverses the order of the tags in the Array

    await article.save();
    res.send({ article });
    // console.log("Create an article:")
})


// UPDATE AN ARTICLE
route.put("/:article", async (req, res) => {

    let slug = req.params.article
    // console.log("slug:", slug)

    // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    const filter = { slug };
    const update = {
        body: req.body.article.body
    };
    var article = await Article.findOneAndUpdate(filter, update);
    res.send({ article });
})


// FAVORITE ARTICLE
route.post("/:article/favorite", async (req, res) => { //:slug

    /* 
        1. Sätt favorited till true
        2. Öka favoritesCount med 1
        3. Lägg till användarens id till lista med personer som har sparat 
    */


    // {{APIURL}}/articles/{{slug}}/favorite
    await Article.findOneAndUpdate(
        { slug: req.params.article },
        {
            favorited: true,
        })

    var article = await Article.findOneAndUpdate(
        { slug: req.params.article },
        {
            $inc: { favoritesCount: 1 },
            $addToSet: { favoritedBy: req.user.username },
        })
    console.log("article1", article)

    console.log("2-################", "user", req.user.user_id, "favorited", req.params.article)
    // For testing purposes
    // var articleId = "62514a9182197faaa9d4b03a"; 
    // await Article.findByIdAndUpdate({_id: articleId}, {favorited: true})
    // await Article.findByIdAndUpdate({_id: articleId}, {$inc : {favoritesCount: 1}});




    //await Article.findByIdAndUpdate({ _id: article._id }, { favorited: true })
    //await Article.findByIdAndUpdate({ _id: article._id }, { $inc: { favoritesCount: 1 } });
    //article = await Article.findById({ _id: article._id });
    article = await Article.findOne({ slug: req.params.article });
    //console.log("article----1", article)
    article = await Article.findOneAndUpdate({ slug: req.params.article }, {
        favorited: article.favoritesCount > 0,
    })
    //console.log("article----2", article)

    article = await Article.findOne({ slug: req.params.article });
    //console.log("article----3", article)

    //article.favorited = article.favoritesCount > 0

    console.log("article2", article)


    res.send({ article });
    // console.log("from FAVORITE ARTICLE POST: article")
    // console.log(article)
    // console.log("Favorite article POST END:");
})

// UNFAVORITE ARTICLE
route.delete("/:article/favorite", async (req, res) => {

    var article = await Article.findOneAndUpdate({ slug: req.params.article }, {
        $inc: { favoritesCount: -1 },
        $pull: { favoritedBy: req.user.username }, // https://www.mongodb.com/docs/manual/reference/operator/update/pull/
    });

    console.log("3-################", "user", req.user.user_id, "unfavorited", req.params.article, "article", article._id)
    console.log("unfav article----0", article)


    // For testing purposes
    // var articleId = "62514a9182197faaa9d4b03a"; 
    // await Article.findByIdAndUpdate({_id: articleId}, {favorited: false})
    // await Article.findByIdAndUpdate({_id: articleId}, {$inc : {favoritesCount: -1}});

    // await Article.findByIdAndUpdate({ _id: article._id }, { favorited: false })
    // await Article.findByIdAndUpdate({ _id: article._id }, { $inc: { favoritesCount: -1 } });
    article = await Article.findOne({ slug: req.params.article });
    console.log("unfav article----1", article)
    // Den verkar inte hämta uppdaterade artikeln
    article = await Article.findOneAndUpdate({ slug: req.params.article }, {
        favorited: article.favoritesCount > 0,
    })
    console.log("unfav article----2", article)

    article = await Article.findOne({ slug: req.params.article });
    console.log("unfav article----3", article)

    //article.favorited = article.favoritesCount > 0

    console.log("article2", article)


    res.send({ article });
})


module.exports = route