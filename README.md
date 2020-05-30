---


---

<h1 id="tastytreats">TastyTreats</h1>
<p>An application made with Node.js and Express, connected to MongoDB and deployed with Heroku. Front-end has been built with jQuery, Bootstrap and Sass.</p>
<h2 id="description">Description</h2>
<p>User fills in and submits the form provided. The data from the form is validated - both from the server and a client side - and appropriate error or success messages are displayed.</p>
<p>Then, Google reCAPTCHA v3 is initialized. If no errors are found, data records are stored in the database and an authorised user can display them on a separate page, the most recent ones on top.</p>
<p>The app consists of 3 pages.</p>
<p>On the homepage, designed as a contact section of a fictional bakery, user can enter and submit data. There are mandatory fields: ‘name’, ‘email’, ‘message’ and also a checkbox, with its value registered.</p>
<p>On the second page there is a login form and on the third, data from database.</p>
<h2 id="how-to-access-the-submitted-forms-data">How to access the submitted forms data</h2>
<p>To go to the second page - admin section - user needs to navigate to ‘/admin’ route in the URL bar.</p>
<p>If not logged in, user then will see a login section. To access the third, secret page, the following data needs to be entered: ‘admin’ as the name, ‘admin’ as the password and ‘treats’ in the bottom field.</p>
<p>On the secret page there is data from submitted forms, in the form of cards, that user can browse, hide from view temporarily, or delete permanently.</p>
<p>After finished session user can log out and be safely redirected to login page.</p>
<p>If a session is active, route ‘/admin’ will redirect straight to secret page, which can be then accessed also directly, from ‘/forms’ route.</p>

