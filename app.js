const express = require("express");
const app = express();
const port = 8080;

app.use(express.static("./"));

app.get("/", (req, res) => {
  const html = fs.readFileSync("./index.html", "utf8")
  res.send(html);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});