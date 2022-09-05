//jshint esversion:]6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let mainItems = []; //to do list array for default view
let workItems = []; //to do list array for work view

app.use(bodyParser.urlencoded({
  extended: true
})); //Do not forget this when you want to retrieve data from the webpage to the server
app.use(express.static("public"));
app.set('set engine', '.ejs'); //this tells Express to use EJS as a new view engine

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

app.get("/about", function (req,res){
  res.render("about.ejs"); //render about.ejs
})
//any element href with the same .get parameter can trigger this. shall that element be clicked, .get block will be triggered, this rendering the about.ejs file 

app.post("/", function(req, res) {
  if (req.body.list === "Work") { //on the <input> element found on list.ejs, there's an attribute that actually holds the data of listTitle. it uses that field to control where the new item should be pushed
    workItems.push(req.body.itemTextField);
    res.redirect("/work"); //redirect to the work page
  } else {
    mainItems.push(req.body.itemTextField);
    res.redirect("/") //redirect to main page
  }

})

app.get("/work", function(req, res) { //To give access to /Work
  res.render("list.ejs", {
    listTitle: "Work List",
    newTodoItems: workItems
  });

});
