
  //<!-- Client side verification of secret word in login panel -->

$(document).ready(function() {

  $('.word').mouseover(function() {
    $(this).attr("placeholder", "Type/Enter: treats");
  });

  $('.word').mouseout(function() {
    $(this).attr("placeholder", "");
  });

  $("form").submit(function(e) {
    if ($('.word').val() != "treats") {
      alert('Please enter the secret word!');
      e.preventDefault(e);
    }
  });
});
