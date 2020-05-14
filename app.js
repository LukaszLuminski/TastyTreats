//jshint esversion:6

//<!-- Modules -->
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const path = require('path');
const {
  check,
  validationResult
} = require('express-validator');
const request = require('request');
const fs = require('fs');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const databases = require('./databases');
const Form = mongoose.model('Form');
const User = mongoose.model('User');

const app = express();

const publicStaticDirPath = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './views');
const partialsPath = path.join(__dirname, './partials');
//<!-- Modules end -->

//<!-- Template engine -->
app.set("view engine", "hbs");
app.set('views', viewsPath);

const filenames = fs.readdirSync(partialsPath);

filenames.forEach(function(filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsPath + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

app.use(express.static(publicStaticDirPath));
//<!-- Template engine end -->

//<!-- Parsing requests as req.body jsons -->
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//<!-- End -->

//<!-- Creating session -->
app.use(session({
  secret: process.env.SECRET,
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  saveUninitialized: false
}));
//<!-- End -->

//<! --Setting Passport.js for user authorisation -->
app.use(passport.initialize());
app.use(passport.session());
//<!--End-->

//<! --Connecting to local or online database -->
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tasty-treatsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
//<!-- End -->

//<!-- For depreciation warning -->
mongoose.set('useCreateIndex', true);
//<!--End-->

//<!-- Getting homepage route -->
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Tasty Treats | Contact'
  });
});
//<!-- End -->

//<!-- Getting secret page route -->
app.get('/forms', (req, res) => {

  //<!-- Disabling caching and storing, so that unauthorised user cannot return to sensitive data using back button, after logout. Not interfering with the button itself -->
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Expires', '0');
  res.setHeader('Pragma', 'no-cache');

  //<!-- If user is authenticated, secret page will open and display the records with the newest first -->
  if (req.isAuthenticated()) {

    Form.find().sort({
      '_id': -1
    }).exec(function(err, data) {
      res.render('saved-forms', {
        title: 'Tasty Treats | Saved Forms',
        forms: data
      });
    });
  //<!-- If not authenticated, user will only see login page -->
  } else {
    res.redirect('/admin');
  }
});

//<!-- Logging out from secret page and redirecting to login page -->
app.post('/logout', (req, res) => {

  req.session.destroy(function(err) {
    res.redirect('/admin');
  });
});

//<!-- Getting login page route -->
app.get('/admin', (req, res) => {

  //<!-- If authenticated, user will be redirected straight to secret page, with no need to login again -->
  if (req.isAuthenticated()) {

    res.redirect('/forms');
  //<!-- Else user will see login page -->
  } else {
    res.render('admin', {
      title: "Tasty Treats | Admin"
    });
  }
});

//<!-- Logging a user in and strategies of redirection in case of errors, or when the user not found -->
app.post('/admin', (req, res, next) => {

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    passport.authenticate('local',
    (err, user, info) => {

      if (err) {
        return res.redirect('/admin');
      }

      if (!user) {
        return res.redirect('/admin');
      }

      req.logIn(user, function(err) {
        if (err) {
            return res.redirect('/admin');
        }

        return res.redirect('/forms');
      });

    })(req, res, next);
  });


//<!-- Posting data from contact form -->
app.post('/formData', [

  //<!-- Checking if email format is correct, also implemented from client side -->
  check('email').isEmail().withMessage('Email address is invalid')

], (req, res) => {

//<!-- Requesting valid captcha token -->
  if (!req.body.captcha) {
    return res.json({
      'msg': 'Captcha token is undefined'
    });
  }

  const secretKey = process.env.API_KEY;

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;

  //<!-- Making a https call with with Request -->
  request(verifyUrl, (err, response, body) => {

    const errors = validationResult(req);

    if (err) {
      console.log(err);
    }

    body = JSON.parse(body);

    //<!-- Captcha check -->
    if (!body.success || body.score < 0.4) {
      return res.json({
        'msg': 'You might be a robot. Sorry, you are banned!',
        'score': body.score
      });
    }

    //<!-- If there is no errors in contact form data posted -->
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    //<! --Getting current date from server -->
    const date = require('./date.js');

    //<!-- Creating database record for contact form data -->
    const form = new Form({
      date: date.currentDate,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      signUp: req.body.signUp
    });

    //<!--Saving record to database-->
    form.save();
    console.log(form);

    //<!--if there were no errors during post, display info in console-->
    res.status(202).json({
      success: 'Ok',
      form: form
    });
  });
});

  //<!--Deleting records form contact form database from client side-->
app.post('/delete', (req, res, next) => {
  var id = req.body.id;
  Form.findByIdAndRemove(id, function(err, deletedUser) {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(port, () => console.log('Server running on port:' + port));
