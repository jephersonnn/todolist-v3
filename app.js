//jshint esversion:6
//Todo List with MongoDB Exercise

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); //mongoose node module import
const date = require(__dirname + "/date.js"); //importing local node module

const app = express();
const port = 3000;

let mainItems = []; //to do list array for default view
let workItems = []; //to do list array for work view

app.use(bodyParser.urlencoded({
  extended: true
})); //Do not forget this when you want to retrieve data from the webpage to the server
app.use(express.static("public"));
app.set('set engine', '.ejs'); //this tells Express to use EJS as a new view engine

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = { //Schema
  name: {
    type: String,
    required: true
  }
};

const Item = mongoose.model("Item", itemSchema); //Making a model out of the schema

const itemA = new Item({
  name: "This is your todo list!"
})

const itemB = new Item({
  name: "Click + to add an item"
})

const itemC = new Item({
  name: "<-- Cross out items by using the checkbox"
})

app.get("/", function(req, res) {

  let day = date.getDate();

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany([itemA, itemB, itemC], function(err) {
        if (err)
          console.log("Oops something went wrong!");
        else
          console.log("Default items added successfully!");
      })
      res.redirect("/");
    } else {
      res.render("list.ejs", {
        listTitle: day,
        newTodoItems: foundItems
      })
    }
  })
})

app.listen(port, function() {
  console.log("Server started on port " + port);
})

app.get("/about", function(req, res) {
  res.render("about.ejs"); //render about.ejs
})
//any element href with the same .get parameter can trigger this. shall that element be clicked, .get block will be triggered, this rendering the about.ejs file

app.post("/", function(req, res) {
  const newItem = new Item({
    name: req.body.itemTextField
  })

  newItem.save();
  res.redirect("/") //redirect to main page

})

app.get("/work", function(req, res) { //To give access to /Work
  res.render("list.ejs", {
    listTitle: "Work List",
    newTodoItems: workItems
  });

});
