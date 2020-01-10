const express = require("express");
const app = express();

app.use("/site", express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/");
});

app.listen(4100, () => {
  console.log("Listen on port 4100");
});
