//jshint esversion:6

var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');

//<!-- Setting forms database records -->
const formSchema = new mongoose.Schema({
  date: String,
  name: String,
  email: String,
  message: String,
  signUp: String
});

const Form = mongoose.model("Form", formSchema);
//<!-- End -->

//<!-- Setting uder/password database records -->
const userSchema = new mongoose.Schema({
  name: String,
  password: String
});

//<!-- Setting user authorisation strategy -->
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = Form;
module.exports = User;
