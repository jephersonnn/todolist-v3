//jshint esversion:]6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.set('set engine', 'ejs'); //this tells Express to use EJS as a new view engine

app.get("/", function (req, res){

  var today = new Date();
  var currentDay = today.getDay();
  var day = "";
  const dayArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

  if (today.getDay() === 6  || today.getDay() === 0 ) //getDay returns the day of the week. 0 is for Sunday, 6 for Saturday
    day = "Weekend";
  else
    day = "Weekday";
    //.write is better than .send because the client will stop receiving responses after the first .send

  res.render('list.ejs', {dayOfWeek: dayArray[currentDay], kindOfDay: day }); //a function from EJS. this expects filename.EJS from folder 'views'
  // we are passing the variable 'day' to the EJS variable dayOfWeek on list.ejs
})

app.listen(port, function(){
  console.log("Server started on port "+ port);
})
