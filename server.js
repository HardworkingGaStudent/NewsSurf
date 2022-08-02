require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const port = 3000;
// const connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.d73ns.mongodb.net/?retryWrites=true&w=majority`
const connectionString = `mongodb://127.0.0.1:27017/NewsSurf`;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
