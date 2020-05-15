An application made with Node.js and Express, connected to MongoDB and deployed with Heroku.

User fills in and submits the form provided. The data from the form is validated - both from the server and a client side - and appropriate error and success messages are displayed. Then, Google reCAPTCHA v3 checks for a possible bots' activity. If no errors are found, data records are stored in the database and an authorised user can display them on a separate page, the most recent ones on top.

Front-end of this app has been built with jQuery, Boostrap and Sass, and consists of 3 pages. On the homepage, designed as a contact section of a fictional bakery, user can enter and submit data. There are mandatory fields: 'name', 'email', 'message' and also a checkbox, with its value registered. To go to the second page - admin section - user needs to navigate to '/admin' route in the URL bar.

If not logged in, user then will see a login section. To access the third, secret page, the following data needs to be entered: 'admin' as the name, 'admin' as the password and 'treats' in the bottom field. 

On the secret page there is data from submitted forms, in the form of cards, that user can browse, hide from view temporarily, or delete permanently.

After finished session user can log out and be safely redirected to login page.

If a session is active, route '/admin' will redirect straight to secret page, which can be then accessed also directly, from '/forms' route.






