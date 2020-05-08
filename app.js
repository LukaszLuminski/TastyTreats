//jshint esversion:6

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

let urlencoded = bodyParser.urlencoded({
  extended: false
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
  response.render('index.hbs', {
    title: 'Tasty Treats | Contact'
  });
});

app.post('/formData', [

  check('email').isEmail(),

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

   response.json({
      'msg': 'You have been verified!',
      'score': body.score,
      success: 'Ok'
    });
  });

});

app.listen(port, () => console.log('Server running on port:' + port));
