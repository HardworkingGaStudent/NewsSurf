const bcrypt = require("bcrypt");
const userModel = require("../../models/user/user");
const userValidation = require("../validation/UserValidation");

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
            await userModel.create({
                firstName: userValidatedResults.firstName,
                lastName: userValidatedResults.lastName,
                email: userValidatedResults.email,
                hash: hash
            });
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

    showDashboard: (req, res) => {
        res.render("pages/dashboard");
        // res.send("Welcome to your Dashboard!");
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