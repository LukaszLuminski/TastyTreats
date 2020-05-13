//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
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

const app = express();

const publicStaticDirPath = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './views');
const partialsPath = path.join(__dirname, './partials');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET,
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tasty-treatsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.set('useCreateIndex', true);

const formSchema = new mongoose.Schema({
  date: String,
  name: String,
  email: String,
  message: String,
  signUp: String
});

const Form = mongoose.model("Form", formSchema);

const userSchema = new mongoose.Schema({
  name: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Tasty Treats | Contact'
  });
});

app.get('/register', (req, res) => {
  res.render('register', {
    title: 'Tasty Treats | Register'
  });
});

app.get('/forms', (req, res) => {

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Expires', '0');
  res.setHeader('Pragma', 'no-cache');


  if (req.isAuthenticated()) {

    Form.find().sort({
      '_id': -1
    }).exec(function(err, data) {
      res.render('saved-forms', {
        title: 'Tasty Treats | Saved Forms',
        forms: data
      });
    });

  } else {
    res.redirect('/admin');
  }
});

app.post('/logout', (req, res) => {

  req.session.destroy(function(err) {
    res.redirect('/admin');
  });
});

app.post('/register', (req, res) => {

  User.register({
    username: req.body.username
  }, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/forms');
      });
    }
  });
});

app.get('/admin', (req, res) => {

  if (req.isAuthenticated()) {

    res.redirect('/forms');

  } else {
    res.render('admin', {
      title: "Tasty Treats | Admin"
    });
  }
});

app.post('/admin', (req, res) => {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/forms');
    }
  });
});

app.post('/formData', [

  check('email').isEmail().withMessage('Email address is invalid')

], (req, res) => {

  if (!req.body.captcha) {
    return res.json({
      'msg': 'Captcha token is undefined'
    });
  }

  const secretKey = process.env.API_KEY;

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;

  request(verifyUrl, (err, response, body) => {

    const errors = validationResult(req);

    if (err) {
      console.log(err);
    }

    body = JSON.parse(body);

    if (!body.success || body.score < 0.4) {
      return res.json({
        'msg': 'You might be a robot. Sorry, you are banned!',
        'score': body.score
      });
    }

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    const date = require('./date.js');

    const form = new Form({
      date: date.currentDate,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      signUp: req.body.signUp
    });

    form.save();
    console.log(form);

    res.status(202).json({
      success: 'Ok',
      form: form
    });
  });
});

app.post('/delete', (req, res, next) => {
  var id = req.body.id;
  Form.findByIdAndRemove(id, function(err, deletedUser) {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(port, () => console.log('Server running on port:' + port));
