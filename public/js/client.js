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
    }),
    method: "POST"
  };

  fetch('http://localhost:3000/formData', Params)
  .then(response => response.json())
  .then(data => {

    let error = document.querySelector('.error');

    document.querySelector('.errorContainer').style.display = "block";

    data.errors.forEach(function(err) {
      error.innerHTML += `<li>${err.msg}</li>`;
    });
    console.log(data);
  })
  .catch(err => console.log(err));
}
