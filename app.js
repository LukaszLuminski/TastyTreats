//jshint esversion:6

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

let urlencoded = bodyParser.urlencoded({extended: false});

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
  response.render('index.hbs', {title: 'Tasty Treats | Contact'});
});

app.post('/formData', [

  check('email').isEmail(),

], (request, response) => {
   const errors = validationResult(request);

   if (!errors.isEmpty()){
     return response.status(422).json({
       errors: errors.array()
     });
   }

   response.status(202).json({
     success: 'Ok'
   });

});

app.listen(port, ()=> console.log('Server running on port:' + port));
