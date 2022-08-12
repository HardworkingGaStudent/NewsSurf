const userModel = require("../../models/user/user");
const articleModel = require("../../models/article/article");
const upload = require("../../middleware/upload");

const articleController = {
    createArticleForm: async (req, res) => { 
        /**
         * Directs user to a form to write their article
         */
        let user = null;
        try {
            user = await userModel.findOne({ email: req.session.user });
        } catch (err) {
            console.log(err);
            res.redirect("/users/login");
            return;
        };

        res.render("pages/create-new-article", {user});
    },

    createArticle: async (req, res, next) => {
        /**
         * Creates a new post with the following steps:
         * #1. Get user data (Object_id) from DB using session (from incoming request)
         * #2. Create a DB record for the article
         * Finally, return user to the article's view URL
         */
        const user = await userModel.findOne({ email: req.session.user });
        const userId = user._id.toHexString(); // _id field returns: new ObjectId("62ef8bedf6cd6747dcbfb312")

        try {
            const createdArticle = await articleModel.create({
                title: req.body.title,
                genre: req.body.genre,
                author: userId,
                content: req.body.content,
                imgName: req.file.filename
            });

            // Return user to article page
            res.redirect(`/articles/articleid/${createdArticle._id}`);

        } catch (err) {
            console.log(err);
            res.send("failed to create article");
            return;
        };        
    },

    getArticle: async (req, res) => {
        /**
         * Displays the article page. Fetch the article object from DB (articles), 
         * then pass it as props into the article page to render
         */
        const createdArticle = await articleModel.findById(req.params.articleId);
        const userAuthor = await userModel.findById(createdArticle.author);
        res.render("pages/article", {createdArticle, userAuthor});
    }
};
module.exports = articleController;