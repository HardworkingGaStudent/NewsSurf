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
        let user = null;
        try {
            user = await userModel.findOne({ email: req.session.user });
        } catch (err) {
            console.log(err);
            res.redirect("/users/login");
            return;
        };
        
        console.log("this is user object: ", user);

        console.log(JSON.stringify(req.file))
        console.log("file uploaded successfully")
        const imgFilePath = req.file.path.split("/").slice(1,3).join("/")
        console.log('this is req.body: ', req.body);
        return res.redirect("imgFilePath")
        
        // try {
        //     await articleModel.create({
        //     });
        // } catch (err) {
        //     console.log(err);
        //     res.send("failed to create article");
        // };

        // Return action: redirect user to published article page
        // res.render("/articles/_UUID") ?? not sure how to structure this
    },
};
module.exports = articleController;