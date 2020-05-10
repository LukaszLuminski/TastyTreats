//jshint esversion:8

let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = ("0" + (date_ob.getMinutes() + 1)).slice(-2);

// current seconds
let seconds = ("0" + (date_ob.getSeconds() + 1)).slice(-2);

// console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

exports.currentDate = `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
