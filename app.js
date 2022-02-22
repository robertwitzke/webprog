const express = require("express");
const app = express();
const { use } = require("express/lib/application");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs")
const port = 8080;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./"));

app.get("/", (req, res) => {
  if(req.cookies.username) {
    res.redirect("/home");
  } else {
    res.redirect("/showlogin")
  }
  res.send();
});

app.get("/showlogin", (req, res) => {
  res.sendFile(__dirname + "/login_page.html");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/home");
  res.send();
});

favorites = [];

app.post("/favorit", (req, res) => {
  favorites.push(req.body.barcelona)
  res.cookie("favoriten", req.body.barcelona);
  console.log(req.body.barcelona);
})

app.get("/home", (req, res) => {
  if(req.cookies.username) {
    res.sendFile(__dirname + "/overview.html");
  } else {
    res.redirect("/showlogin");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});