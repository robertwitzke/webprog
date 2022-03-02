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

app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.clearCookie("favorites");
  res.redirect("/showlogin");
  res.send();
});

favorites = [];

//Für Favoriten
const data = {
  Cassidy: [],
  Bryn: [],
  Kim: []
};

//Für Counter jeder Stadt in folgender Reihenfolge: Barcelona, New York, Tokio, Kapstadt
const counter = {
  Cassidy: [],
  Bryn: [],
  Kim: []
}

app.post("/favorit", (req, res) => {
  if(!(req.cookies.username in data)) {
    data[req.cookies.username] = [];
  }

  if(!(data[req.cookies.username].includes(req.body.favorite_btn))) {
    data[req.cookies.username].push(req.body.favorite_btn);
  }

  console.log(data);
  res.cookie("favorites", favorites);
  res.redirect("/home");
  res.send();
})

function addListItem() {
  fetch("/data")
  .then((response) => response.json())
  .then((liste) => {
      liste.forEach((favorite) => {
          const liste = document.getElementById("favorites_list");
          var entry = document.createElement('li');
          entry.innerHTML = favorite;
          liste.appendChild(entry);
      });
  });
};

app.get("/data", (req, res) => {
  res.json(data[req.cookies.username]);
});

app.get("/home", (req, res) => {
  if(req.cookies.username) {
    res.sendFile(__dirname + "/overview.html");
  } else {
    res.redirect("/showlogin");
  }
});

app.post("/count", (req, res) => {
  if(req.body.cityname === "Barcelona") {
    console.log("Barcelona");
    res.redirect("barcelona_page.html");
  } else if(req.body.cityname === "New York") {
    console.log("New York");
    res.redirect("newyork_page.html");
  }
  //Jetzt auf jeweilige Seite weiterleiten
  //res.redirect("/home");
  res.send();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});