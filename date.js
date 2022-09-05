//jshint esversion:6
//making node modules

//module.exports = getDate; //exporting the function getDate(), ready to be called to the code where it is exported
//do not call the method (by adding '()')


// function getDate() {
//
//   let today = new Date();
//
//   let options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long"
//   };
//
//   let day = today.toLocaleDateString("en-US", options);
//
//   return day;
// }

//alternatively, we can assign the function with an anonymouse function stored onto just the exports functions

exports.getDate = function() {

  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US", options);
}
