//jshint esversion:]6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

var newItems = [];

app.use(bodyParser.urlencoded({extended:true})); //Do not forget this when you want to retrieve data from the webpage to the server

app.set('set engine', 'ejs'); //this tells Express to use EJS as a new view engine

app.get("/", function (req, res){

  var today = new Date();

var options = { weekday: "long", day: "numeric", month: "long"}

var day = today.toLocaleDateString("en-US", options)

res.render("list.ejs", {dayOfWeek:day, newTodoItems: newItems})
})

app.listen(port, function(){
  console.log("Server started on port "+ port);
})

app.post("/", function(req, res){
  newItems.push(req.body.itemTextField);
  res.redirect("/");
})
