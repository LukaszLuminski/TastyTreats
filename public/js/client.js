//jshint esversion:6

let form = document.querySelector('form');
let errorContainer = document.querySelector('.errorContainer');
let successContainer = document.querySelector('.successContainer');

form.onsubmit = runVerify;

function runVerify(e) {
  e.preventDefault();
  runCaptcha();
}

function runCaptcha() {
  grecaptcha.execute('6LfLdvQUAAAAAGmo47NQbb4cdV73OxY2r7DmSLBj', {
    action: 'index'
  }).then(function(token) {

    const captcha = token;

    sendToken(captcha);
  });
}

function sendToken(captcha) {

  let formData = new FormData(form);

  const info = JSON.stringify({
    captcha: captcha,
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    signUp: formData.get('signUp')
  });

  fetch('http://localhost:3000/formData', {

    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json'
    },
    body: info
  }).then((response) => response.json())
  .then((data)=>{

  $('input[type="text"], textarea').val('');

    if (data.success === 'Ok') {
      console.log('Successful!');

    let success = document.querySelector('.success');

      success.innerHTML = '';

      errorContainer.style.display = "none";
      successContainer.style.display = "block";

      let msg = 'You have successfully submitted the form!';
      success.innerHTML = `<li>${msg}</li>`;

      // alert('msg: ' + data.msg + ', score ' + data.score);

      console.log(data);


    } else {
      let error = document.querySelector('.error');

      error.innerHTML = '';

      successContainer.style.display = "none";

      errorContainer.style.display = "block";

      data.errors.forEach(function(err) {
        error.innerHTML = `<li>${err.msg}</li>`;
      });
      console.log(data);
    }
  }).catch(err => console.log(err));
}
