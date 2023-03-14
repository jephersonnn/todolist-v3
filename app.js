//jshint esversion:6
//Todo List with MongoDB Exercise  

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); //mongoose node module import
const date = require(__dirname + "/date.js"); //importing local node module
const _ = require("lodash");
var path = require('path')
require('dotenv').config();

const app = express();
let port = process.env.PORT;
if (port == null || port == ""){
  port = 8080;
}

//let title = date.getDate();
let title = "To-Do";

app.use(bodyParser.urlencoded({
  extended: true
})); //Do not forget this when you want to retrieve data from the webpage to the server
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.set('set engine', '.ejs'); //this tells Express to use EJS as a new view engine

mongoose.connect(process.env.MONGOOSE_ENDPOINT);


//Schema for the default List
const itemSchema = { //Schema
  name: String,
};

//Schema for the custom Lists
const listSchema = { //Schema
  name: String,
  items: [itemSchema]
};

const archiveItemSchema = { //Schema
  name: {
    type: String,
  }
};

const List = mongoose.model("List", listSchema);
const Item = mongoose.model("Item", itemSchema); //Making a model out of the schema
const ArchiveItem = mongoose.model("Archive", archiveItemSchema);


const itemA = new Item({
  name: "This is your todo list!"
})

const itemB = new Item({
  name: "Click + to add an item"
})

const itemC = new Item({
  name: "<-- Cross out items by using the checkbox"
})

const starterItems = [itemA, itemB, itemC];

app.get("/", function(req, res) {

  //let title = date.getDate();

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) { //if to-do db is empty, add the default items
      Item.insertMany(starterItems, function(err) {
        if (err)
          console.log("Oops something went wrong!");
        else
          console.log("Default items added successfully!");
      })
      res.redirect("/");
    } else {
      res.render("list.ejs", {
        listTitle: title,
        newTodoItems: foundItems
      })
    }
  })
})

app.listen(port, function() {
  console.log("Server started on port " + port);
})

//
app.get("/about", function(req, res) {
  res.render("about.ejs"); //render about.ejs
})
//any element href with the same .get parameter can trigger this. shall that element be clicked, .get block will be triggered, this rendering the about.ejs file

//-----------------------------------
//Insert new item
app.post("/", function(req, res) {
  const newItem = new Item({
    name: req.body.itemTextField
  })

  //req.body.list retrieves the value from the button named "List" where the value assigned to that element is "listTitle"
  if (req.body.list === title) {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      //On the list database, mongoDB will find a document with the matching field (in this case, the List)
      //It will try to grab a matching document, and the found document will then be passed as a parameter for the callback function
      //Which will then be used inside the callback function
      name: req.body.list
    }, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + req.body.list);
    })
  }
})

//-----------------------------------
//Delete checked item
app.post("/delete", function(req, res) {

  if (req.body.list === title) {
    //Model.findByIdAndRemove(ID, function-callback)
    Item.findByIdAndRemove(req.body.checkbox, function(err) {
      if (!err) {
        console.log("Item successfully deleted.")
        res.redirect("/");
      }
    });
  }
  else{
    //Model.findOneAndUpdate({filter/conditions}, {updates}, function-callback)
    //Model.findOneAndUpdate({field: query}, {$pull: {}})
    //$pull is a mongoDB command that pulls a document or a nested document out of the database, thus deleting it.
    List.findOneAndUpdate({name: req.body.list}, {$pull: {items: {_id: req.body.checkbox}}}, function(err, foundList){
      if (!err){
          console.log("Item successfully deleted.")
        res.redirect("/" + req.body.list);
      }
    })
  }

})

//-----------------------------------
//Generate Custom List Item
app.get("/:customListName", function(req, res) { //express route params
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {

        const list = new List({
          name: customListName,
          items: starterItems
        })

        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list.ejs", {
          listTitle: foundList.name,
          newTodoItems: foundList.items
        })
      }
    }
  })
});
