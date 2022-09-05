//jshint esversion:]6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let mainItems = [];
let workItems = [];

app.use(bodyParser.urlencoded({
  extended: true
})); //Do not forget this when you want to retrieve data from the webpage to the server
app.use(express.static("public"));
app.set('set engine', 'ejs'); //this tells Express to use EJS as a new view engine

app.get("/", function(req, res) {

  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }

  let day = today.toLocaleDateString("en-US", options)

  res.render("list.ejs", {
    listTitle: day,
    newTodoItems: mainItems
  })
})

app.listen(port, function() {
  console.log("Server started on port " + port);
})

app.post("/", function(req, res) {
  mainItems.push(req.body.itemTextField);
  res.redirect("/");
})

app.get("/work", function(req, res) {
  res.render("list.ejs", {
    listTitle: "Work List",
    newTodoItems: workItems
  });

});

app.post("/work", function(req, res) {
  workItems.push(req.body.itemTextField);
})
