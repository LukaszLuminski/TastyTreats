$('.word').mouseover(function() {
  $(this).attr("placeholder", "Type/Enter: treats");
});

$('.word').mouseout(function() {
  $(this).attr("placeholder", "");
});


$(document).ready(function() {

  $("form").submit(function(e) {
    if ($('.word').val() != "treats") {
      alert('Please enter the secret word!');
      e.preventDefault(e);
    }
  });
});
