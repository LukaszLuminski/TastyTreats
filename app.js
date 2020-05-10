//jshint esversion:8

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const {
  check,
  validationResult
} = require('express-validator');
const req = require('request');
const secretKey = '6LfLdvQUAAAAAJLGuXce4Ul6sHD1IOU1OPX_Y2qt';
const date = require('./date.js');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tasty-treats', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
var db = mongoose.connection;
db.on('error', console.log.bind(console, "Connection to db error"));
db.once('open', function(callback) {
  console.log("Connection to db succeeded");
});

const userSchema = new mongoose.Schema({
  date: String,
  name: String,
  email: String,
  message: String,
  signUp: String
});

const User = mongoose.model("User", userSchema);

let urlencoded = bodyParser.urlencoded({
  extended: true
});

app.use(bodyParser.json());
app.use(urlencoded);
const publicStaticDirPath = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './templates/views');
const partialsPath = path.join(__dirname, './templates/partials');

app.set("view engine", "hbs");
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

app.get('/', (request, response) => {
  response.render('index', {
    title: 'Tasty Treats | Contact'
  });
});

app.get('/admin', (request, response) => {

  User.find().sort({
    '_id': -1
  }).exec(function(err, data) {
    if (err) {
      return response.render('collection', {
        // user: request.user,
        title: 'Tasty Treats | Forms',
        forms: '',
        error: err
      });
    }

    response.render('collection', {
      // user: request.user,
      title: 'Tasty Treats | Forms',
      forms: data
    });

  });
});

app.post('/admin', (request, response, next) => {
  var id = request.body.id;
  User.findByIdAndRemove(id, function(err, deletedUser) {
    if (err) {
      console.log(err);
    }
  });
});

app.post('/formData', [

  check('email').isEmail().withMessage('Email address is invalid')

], (request, response) => {

  if (!request.body.captcha) {
    return response.json({
      'msg': 'Captcha token is undefined'
    });
  }

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${request.body.captcha}`;

  req(verifyUrl, (err, res, body) => {

    const errors = validationResult(request);

    if (err) {
      console.log(err);
    }

    body = JSON.parse(body);

    if (!body.success || body.score < 0.4) {
      return response.json({
        'msg': 'You might be a robot. Sorry, you are banned!',
        'score': body.score
      });
    }

    if (!errors.isEmpty()) {
      return response.status(422).json({
        errors: errors.array()
      });
    }

    const user = new User({
      date: date.currentDate,
      name: request.body.name,
      email: request.body.email,
      message: request.body.message,
      signUp: request.body.signUp
    });

    user.save();
    console.log(user);

    response.status(202).json({
      success: 'Ok',
      user: user
    });
  });
});

app.listen(port, () => console.log('Server running on port:' + port));
