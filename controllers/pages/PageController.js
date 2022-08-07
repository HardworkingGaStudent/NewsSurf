const pageController = {
    homePage: (req, res) => { res.render("pages/home"); },
    contactsPage: (req, res) => { res.render("pages/contacts"); }
};

module.exports = pageController;