//jshint esversion:6

let form = document.querySelector('form');

form.onsubmit = sendData;

function sendData(e) {
  e.preventDefault();

  let formData = new FormData(form);

  let Params = {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      signUp: formData.get('signUp')
    }),
    method: "POST"
  };

  fetch('http://localhost:3000/formData', Params)
  .then(response => response.json())
  .then(data => {
    $('input[type="text"], textarea').val('');

    if (data.success === 'Ok') {
      console.log('Successful!');

      console.log(data);
      console.log(Params.body);

      let success = document.querySelector('.success');

      success.innerHTML = '';

      document.querySelector('.successContainer').style.display = "block";

      let msg = 'You have successfully submitted the form!';
      success.innerHTML = `<li>${msg}</li>`;

    } else {
      let error = document.querySelector('.error');

      error.innerHTML = '';

      document.querySelector('.successContainer').style.display = "none";

      document.querySelector('.errorContainer').style.display = "block";

      data.errors.forEach(function(err) {
        error.innerHTML = `<li>${err.msg}</li>`;
      });
      console.log(data);
    }
  })
  .catch(err => console.log(err));
}
