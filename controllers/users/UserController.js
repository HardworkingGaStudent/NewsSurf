const bcrypt = require("bcrypt");
const userModel = require("../../models/user/user");
const userValidation = require("../validation/UserValidation");
const articleModel = require("../../models/article/article");

const userController = {

    registrationForm: (req, res) => { res.render("pages/register"); },

    register: async (req, res) => {
        /**
         * Registration steps to create a user's record in the DB (collection name: User):
         * #1: validate if user-input's request body is fully formed (according to validation/UserValidation.js)
         * #2: validate if user-input's password == confirm password
         * #3: create a DB record for the user
         * Return action: redirect users to the login page
         */

        // #1: Validation
        const userValidationResults = userValidation.registerValidator.validate(req.body);
        if (userValidationResults.error) {
            res.send(userValidationResults.error);
            return;
        };
        const userValidatedResults = userValidationResults.value;

        // #2: password && confirmPassword need to match
        if (userValidatedResults.password !== userValidatedResults.confirmPassword) {
            res.send("Password not matching Confirm Password");
            return;
        };
        const hash = await bcrypt.hash(userValidatedResults.password,10);
        
        // #3: Create a DB record for the user (once above validations passed)
        try {
            const createdUser = await userModel.create({
                firstName: userValidatedResults.firstName,
                lastName: userValidatedResults.lastName,
                email: userValidatedResults.email,
                hash: hash
            });
            // console.log(createdUser._id);
        } catch (err) {
            console.log(err);
            res.send("failed to create user");
            return;
        };

        // Return action: redirect users to the login page
        res.redirect("/users/login");
    },

    loginForm: (req, res) => { res.render("pages/login"); },

    login: async (req, res) => {
        /**
         * Steps for a user to log in:
         * #1. retrieve the user's email from the DB
         * #2. hash and compare the stored hash in the DB
         * #3. create a session and log the user in
         */
        // set variables for validation
        const userValidatedResults = req.body;
        let user = null;

        // retrieve user from DB
        try {
            user = await userModel.findOne({ email: userValidatedResults.email });
        } catch (err) {
            res.send("failed to get user");
            return;
        };

        // compare if user's given password matches the DB hash
        const pwMatch = await bcrypt.compare(userValidatedResults.password, user.hash);
        if (!pwMatch) {
            res.send("incorrect password");
            return;
        };

        // log the user in
        req.session.regenerate(function (err) {
            if (err) {
                res.send("unable to regenerate session");
                return;
            }
            // store user info in session to ensure page load does not happen before saving session
            req.session.user = user.email;
            req.session.save(function (err) {
                if (err) {
                    res.send("unable to save session");
                    return;
                };
                res.redirect("/users/dashboard");
            });
        });
    },

    showDashboard: async (req, res) => {
        /**
         * Fetches all the user's posts from DB and summarizes it in one page:
         * #1. Get user data(Object_id) from DB using session (from incoming request)
         * #2. Use it as key to fetch all the articles that the user has authored
         * #3. pass them as props into the dashboard pages
         */
        const user = await userModel.findOne({ email: req.session.user });
        const userId = user._id.toHexString(); // _id field returns: new ObjectId("62ef8bedf6cd6747dcbfb312"
        // console.log("userId is: "+userId);

        try {
            const userCreatedArticles = await articleModel.find({"author": userId}).exec();
            result = JSON.parse(JSON.stringify(userCreatedArticles));
            // console.log(result);
            res.render("pages/dashboard", {result});
        } catch (err) {
            console.log(err);
            res.send(err);
            return;
        };
    },

    showProfile: async (req, res) => {
        /**
         * Get user data from DB using session user
         */
         let user = null;

         try {
            user = await userModel.findOne({ email: req.session.user });
         } catch (err) {
            console.log(err);
            res.redirect("/users/login");
            return;
         };
         console.log(user);
         res.render("pages/profile", {user});
    },

    updateProfile: async (req, res) => {
        /**
         * Steps to update user's data in the DB (similar to Registration function):
         * #1: validate if user-input's request body is fully formed (according to validation/UserValidation.js)
         * #2: validate if user-input's password == confirm password
         * #3: update the user's DB record
         * Return action: redirect users to the profile page
         */
        // #1: Validation
        const userValidationResults = userValidation.registerValidator.validate(req.body);
        if (userValidationResults.error) {
            res.send(userValidationResults.error);
            return;
        };
        const userValidatedResults = userValidationResults.value;

        // #2: password && confirmPassword need to match
        if (userValidatedResults.password !== userValidatedResults.confirmPassword) {
            res.send("Password not matching Confirm Password");
            return;
        };
        const hash = await bcrypt.hash(userValidatedResults.password,10);
        
        // #3: Create a DB record for the user (once above validations passed)
        try {
            await userModel.findOneAndUpdate({
                firstName: userValidatedResults.firstName,
                lastName: userValidatedResults.lastName,
                email: userValidatedResults.email,
                hash: hash
            });
        } catch (err) {
            console.log(err);
            res.send("failed to update user particulars");
            return;
        };

        // Return action: redirect users to the login page
        res.redirect("/users/profile");
    },

    logout: async (req, res) => {
        req.session.user = null
        req.session.save(function (err) {
            if (err) {
                res.redirect('/users/login');
                return;
            };

            // Regenerate the session
            req.session.regenerate(function (err) {
                if (err) {
                    res.redirect('/users/login');
                    return;
                };
                res.redirect('/');
            });
        });
    },
};

module.exports = userController;