const express = require("express");
const app = express();
const { use } = require("express/lib/application");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.document = new JSDOM("barcelona_page.html").window.document;
const port = 8080;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./"));

app.get("/", (req, res) => {
  doesUserExist(req, res, () => {
    res.redirect("/home");
    res.send();
  }) 
});

app.get("/showlogin", (req, res) => {
  res.sendFile(__dirname + "/login_page.html");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  data[req.body.username] = [];
  counter[req.body.username] = [["Barcelona", 0], ["New York", 0], ["Tokio", 0], ["Kapstadt", 0]];
  comments[req.body.username] = [];
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
const data = {};

//Für Counter jeder Stadt in folgender Reihenfolge: Barcelona, New York, Tokio, Kapstadt
const counter = {};

app.post("/favorit", (req, res) => {

  doesUserExist(req, res, () => {
    if(!(req.cookies.username in data)) {
      data[req.cookies.username] = [];
    }
  
    if(!(data[req.cookies.username].includes(req.body.favorite_btn))) {
      data[req.cookies.username].push(req.body.favorite_btn);
    } else {
      data[req.cookies.username].splice(data[req.cookies.username].indexOf(req.body.favorite_btn), 1);
    }
  
    console.log(data);
    res.cookie("favorites", favorites);
    res.redirect("/home");
    res.send();
  })
});

app.get("/data", (req, res) => {
  doesUserExist(req, res, () => {
    res.json(data[req.cookies.username]);
  })
});

app.get("/countdata", (req, res) => {
  doesUserExist(req, res, () => {
    isEmpty = true;
    visible_cities = [];
    sum = 0;

    for (let i = 0; i < counter[req.cookies.username].length; i++) {
      sum += counter[req.cookies.username][i][1];
    }

    average = sum / 4;

    for (let i = 0; i < counter[req.cookies.username].length; i++) {
      if(counter[req.cookies.username][i][1] >= average && counter[req.cookies.username][i][1] !== 0) {
        isEmpty = false;
        visible_cities.push(counter[req.cookies.username][i]);
      }
    }

    if(!isEmpty) {
      res.json(visible_cities);
    } else {
      res.json([]);
    }
  })
});

const comments = {};

app.post("/commentary", (req, res) => {
  doesUserExist(req, res, () => {
    if(req.body.comments.length > 0) {
      comments[req.cookies.username].push(req.body.comments);
    }
    res.redirect(req.get('referer'));
    res.send();
  })
});

app.get("/commentsdata", (req, res) => {
  allComments = []
  for (const [key, value] of Object.entries(comments)) {
    value.forEach(element => {
      allComments.push({ author: key, comment: element });
    });
  }
  
  res.json(allComments);
});

app.get("/home", (req, res) => {
  doesUserExist(req, res, () => {
    res.sendFile(__dirname + "/overview.html");
  })
});

app.post("/count", (req, res) => {

  doesUserExist(req, res, () => {
    if(req.body.cityname === "Barcelona") {
      counter[req.cookies.username][0][1] += 1;
      res.redirect("barcelona_page.html");
    } else if(req.body.cityname === "New York") {
      counter[req.cookies.username][1][1] += 1;
      res.redirect("newyork_page.html");
    } else if(req.body.cityname === "Tokio") {
      counter[req.cookies.username][2][1] += 1;
      res.redirect("tokio_page.html");
    } else if(req.body.cityname === "Kapstadt") {
      counter[req.cookies.username][3][1] += 1;
      res.redirect("kapstadt_page.html");
    }
    res.send();
  })
})

function doesUserExist(req, res, callback) {
  if(req.cookies.username && data[req.cookies.username] && comments[req.cookies.username] && counter[req.cookies.username]) {
    callback();
  } else {
    res.clearCookie("username");
    res.clearCookie("favorites"); 
    res.redirect("/showlogin")
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});