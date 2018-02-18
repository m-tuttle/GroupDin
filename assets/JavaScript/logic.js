$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
  //now you can open modal from code
  $('#modal1').modal('open');
  //or by click on trigger
  $('#modal1').modal('close');
});

$('.modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal

});

$('#add-guest-btn').on('click', function(){
    var names = [];
    var emails = [];
    var name = $('#name-input').val();
    var email = $('#email-input').val();
    names.push(name);
    emails.push(email);
    for (i = 0; i < names.length; i++){
        $('.guest-display').html('<div class="row"><div class="col s6">' + names[i] + '</div><div class="col s6">' + emails[i] + '</div></div>');
    };
    $('#name-input').val('');
    $('#email-input').val('');
    console.log(names)
    console.log(emails)


})