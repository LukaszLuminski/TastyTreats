
  //<!-- Disabling endless waiting for server after deleting db records -->
  
$('.close-icon, .hide-icon').on('click',function() {
  $(this).closest('.card').fadeOut();
  setTimeout(function(){
       window.stop();
   }, 1000);
});
