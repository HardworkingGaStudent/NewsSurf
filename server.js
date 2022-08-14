// Import dependencies
require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");
const pageController = require("./controllers/pages/PageController");
const userController = require("./controllers/users/UserController");
const articleController = require("./controllers/articles/ArticleController");
const authMiddleware = require("./middleware/authenticate");

// Config properties
const app = express();
const port = process.env.PORT || 3000;
const connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.xfyzdqw.mongodb.net/?retryWrites=true&w=majority`
// const connectionString = `mongodb://127.0.0.1:27017/NewsSurf`;

// set view engine
app.set("view engine", "ejs");

// apply middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
// app.use(express.static(__dirname + '/public'));
// app.use("uploads", express.static("uploads")); // for multer
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: false, maxAge: 7200000 }
}));
app.use(authMiddleware.setAuthUserVar);

// Multer functions
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

// Generic routes
app.get('/', pageController.homePage);

// User routes
app.get("/users/register", userController.registrationForm);
app.post("/users/register", userController.register);
app.get("/users/login", userController.loginForm);
app.post("/users/login", userController.login);
app.post("/users/logout", userController.logout);
app.get("/users/profile", authMiddleware.isAuthenticated, userController.showProfile);
app.post("/users/profile", authMiddleware.isAuthenticated, userController.updateProfile);
app.get("/users/dashboard", authMiddleware.isAuthenticated, userController.showDashboard);

// Article routes
app.get("/articles/create-new-article", authMiddleware.isAuthenticated, articleController.createArticleForm);
app.post("/articles/create-new-article", authMiddleware.isAuthenticated, upload.single("article-img"), articleController.createArticle);
app.get("/articles/articleid/:articleId", articleController.getArticle);
app.get("/articles/articleid/:articleId/delete", articleController.deleteArticle);
app.get("/articles/articleid/:articleId/edit", articleController.editArticleForm);
app.post("/articles/articleid/:articleId/edit", authMiddleware.isAuthenticated, upload.single("article-img"), articleController.editArticle);
app.get("/articles/genre/:genre", articleController.getArticleByGenre);

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
