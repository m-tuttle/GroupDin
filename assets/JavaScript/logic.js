$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});

$('.modal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal

});
var guestCount = 0
$('#add-guest-btn').on('click', function(){
    event.preventDefault();
    localStorage.clear();
    var guestsArr = [];
    var name = $('#name-input').val().trim();
    var email = $('#email-input').val().trim();
    var divContent = $(".guest-display").html();
    var newDiv = $("<div>");
    newDiv.addClass("row");
    newDiv.attr("id", "guest-" + guestCount);
    newDiv.append(name +'\xa0\xa0\xa0\xa0');
    newDiv.append(email + '\xa0\xa0\xa0\xa0');
    var removeBtn = $("<button>").attr("data-guest", guestCount);
    removeBtn.attr("class", "remove");
    removeBtn.text('Remove');
    newDiv.append(removeBtn);
    $(".guest-display").append(newDiv);
    guestsArr.push(newDiv.text());
   console.log(guestsArr);
    
    $('#name-input').val('');
    $('#email-input').val('');
    guestCount++;
     var savedGuest = JSON.parse(guestsArr);
    for (var i = 0; i < savedGuest.length; i++) {
        localStorage.setItem('savedGuest',savedGuest[i]);
    };
})
    
    $(document.body).on('click', '.remove', function(){
        var guestNumber = $(this).attr("data-guest");
        $("#guest-"+ guestNumber).remove();
       
    });
    $('.guest-display').html(localStorage.getItem('savedGuest'));

