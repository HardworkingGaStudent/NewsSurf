require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const pageController = require("./controllers/pages/PageController");
const userController = require("./controllers/users/UserController");
const authMiddleware = require("./middleware/authenticate");

const app = express();
const port = 3000;
// const connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.d73ns.mongodb.net/?retryWrites=true&w=majority`
const connectionString = `mongodb://127.0.0.1:27017/NewsSurf`;

// set view engine
app.set("view engine", "ejs");

// apply middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: false, maxAge: 7200000 }
}));

app.get('/', pageController.homePage);
app.get("/contacts", pageController.contactsPage);

// User routes
app.get("/users/register", userController.registrationForm);
app.post("/users/register", userController.register);
app.get("/users/login", userController.loginForm);
app.post("/users/login", userController.login);
app.post("/users/logout", userController.logout);

app.get("/users/profile", authMiddleware.isAuthenticated, userController.showProfile);


// Express listener
app.listen(port, async () => {
  try {
    await mongoose.connect(connectionString, { dbName: "NewsSurf" });
    console.log(`MongoDB Connected: ${connectionString}`);
  } catch (err) {
    console.log(`Failed to connect to DB`);
    process.exit(1);
  }
  console.log(`Example app listening on port ${port}`);
});
