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
  Cassidy: [["Barcelona", 0], ["New York", 0], ["Tokio", 0], ["Kapstadt", 0]],
  Bryn: [["Barcelona", 0], ["New York", 0], ["Tokio", 0], ["Kapstadt", 0]],
  Kim: [["Barcelona", 0], ["New York", 0], ["Tokio", 0], ["Kapstadt", 0]]
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

function addCounterListItem() {
  fetch("/countdata")
  .then((response) => response.json())
  .then((liste) => {
    for (let i = 0; i < liste.length; i++) {
      const list = document.getElementById("most_list");
      var entry = document.createElement('li');
      entry.innerHTML = "Die " + liste[i][0] + "-Seite wurde " + liste[i][1] + " Mal besucht.";
      list.appendChild(entry);
    }
  });
};

app.get("/data", (req, res) => {
  res.json(data[req.cookies.username]);
});

app.get("/countdata", (req, res) => {
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

});

const comments = {
  Cassidy: [],
  Bryn: [],
  Kim: []
};

app.post("/commentary", (req, res) => {
  comments[req.cookies.username].push(req.body.comments);
  res.redirect(req.get('referer'));
  res.send();
});

app.get("/commentsdata", (req, res) => {
  if(req.cookies.username === "Bryn") {
    allComments = []
    for (const [key, value] of Object.entries(comments)) {
      value.forEach(element => {
        allComments.push(element);
      });
    }
    console.log(comments);
    console.log(allComments);
    res.json(allComments);

  } else {
    res.json(comments[req.cookies.username]);
  }
});

function addComment() {
  fetch("/commentsdata")
  .then((response) => response.json())
  .then((liste) => {
    for (let i = 0; i < liste.length; i++) {
      const list = document.getElementById("comment_list");
      var entry = document.createElement('p');
      entry.innerHTML = "Anonym schreibt : " + liste[i];
      list.appendChild(entry);
    }
  });
};

app.get("/home", (req, res) => {
  if(req.cookies.username) {
    res.sendFile(__dirname + "/overview.html");
  } else {
    res.redirect("/showlogin");
  }
});

app.post("/count", (req, res) => {
  if(req.body.cityname === "Barcelona") {
    counter[req.cookies.username][0][1] += 1;
    console.log(counter);
    res.redirect("barcelona_page.html");
  } else if(req.body.cityname === "New York") {
    counter[req.cookies.username][1][1] += 1;
    console.log(counter);
    res.redirect("newyork_page.html");
  } else if(req.body.cityname === "Tokio") {
    counter[req.cookies.username][2][1] += 1;
    console.log(counter);
    res.redirect("tokio_page.html");
  } else if(req.body.cityname === "Kapstadt") {
    counter[req.cookies.username][3][1] += 1;
    console.log(counter);
    res.redirect("kapstadt_page.html");
  }
  //Jetzt auf jeweilige Seite weiterleiten
  //res.redirect("/home");
  res.send();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});