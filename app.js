//test

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express()
const PORT = process.env.PORT;
const path = require("path");

const jwt = require("jsonwebtoken");


const token = require("./token.js")
const JWT_SECRET = token.SECRET


// Connection to MongoDB Atlas
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connection to MongoDB successful");
  })
  .catch((err) => {
    console.log("Connection to MongoDB error " + err);
  })

// For POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static("dist"));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// -- JWT Token Check
app.use((req, _res, next) => {
  const authHeader = req.header("Authorization");
  // console.log("req.header:", req.header)
  // console.log("authHeader: ", authHeader)
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log("Token:", token);
    if (token) {
      req.user = jwt.verify(token, JWT_SECRET);
    }

  }
  // console.log("User: ", req.user)
  next();
});


// ROUTES
app.use("/api", require("./routes/api"));

app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});