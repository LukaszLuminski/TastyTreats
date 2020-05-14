//jshint esversion:6

$('#mdb-preloader').addClass('loaded');
$('#mdb-preloader').attr('style', 'visibility: hidden;');

$(".return-to-top").on('click', () => {
  $('html, body').animate({
    scrollTop: $("body").offset().top
  }, 1000);
  preventDefault();
});

$(".copyright").text(new Date().getFullYear());

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
    action: 'home'
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

  fetch('/formData', {

      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
      },
      body: info
    }).then((res) => res.json())
    .then((data) => {

      $('input[type="text"], input[type="email"], textarea').val('');
      $('input[type=checkbox]').prop('checked', false);

      if (data.success === 'Ok') {
        console.log('Successful!');

        let success = document.querySelector('.success');

        success.innerHTML = '';

        errorContainer.style.display = "none";
        successContainer.style.display = "block";

        let msg = 'You have successfully submitted the form!';
        success.innerHTML = `<li>${msg}</li>`;
        console.log(data);

          successContainer.classList.add("animated");

      } else {
        let error = document.querySelector('.error');

        error.innerHTML = '';

        successContainer.style.display = "none";

        errorContainer.style.display = "block";

        data.errors.forEach(function(err) {
          error.innerHTML = `<li>${err.msg}</li>`;
        });

        errorContainer.classList.add("animated");

        console.log(data);
      }
    }).catch(err => console.log(err));
}
