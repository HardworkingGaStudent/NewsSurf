const articleModel = require("../../models/article/article");

const pageController = {
    homePage: async (req, res) => {
        /**
         * Searches the Articles DB for 20 of the latest articles (by date)
         */
        try {
            const createdArticles = await articleModel.find().sort({"date": -1}).limit(20);
            // console.log(createdArticles);
            res.render("pages/home", {createdArticles}); 
        } catch (err) {
            res.send("error 4000");
        };
    },
};

module.exports = pageController;