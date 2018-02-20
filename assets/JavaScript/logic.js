// variable to store the emails of the guests entered by the user and count users
var guestsArr = [];
var guestCount = 0;
// function referenced in the HTML of the send email link, which runs the mailto in a new window
function sendMail() {
    window.open("mailto:" + guestsArr.join(", ") + "?subject=" + encodeURIComponent("GroupDīn Plan") + '&body=' + encodeURIComponent($("#icon_prefix2").val().trim()));
}

$(document).ready(function () {
    //progress bar hide
    $('.preloader-wrapper').hide();
    //modal handler
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal

    });
    /////////This section needs a lot of work and cleaning up///////////////////
<<<<<<< HEAD
    var guestCount = 0
    $(document).on('click','#add-guest-btn', function () {
=======
    $('#add-guest-btn').on('click', function () {
>>>>>>> 5391b7c352787995f1255dab4172d18caaa3185f
        event.preventDefault();
        var name = $('#name-input').val().trim();
        var email = $('#email-input').val().trim();
        var divContent = $(".guest-display").html();
        var newDiv = $("<div>");
        newDiv.addClass("row");
        newDiv.attr("id", "guest-" + guestCount);
        newDiv.append(name + '\xa0\xa0\xa0\xa0');
        newDiv.append(email + '\xa0\xa0\xa0\xa0');
        var removeBtn = $("<button>").attr("data-guest", guestCount);
        removeBtn.attr("class", "remove btn red lighten-1");
        removeBtn.html('Remove<i class="material-icons right">delete</i>');
        newDiv.append(removeBtn);
        $(".guest-display").prepend(newDiv);
<<<<<<< HEAD
        $('.res-display').append('#description');
        guestsArr.push(newDiv.text());


=======
        $('.res-display').append(restaurant);
        guestsArr.push(email);
>>>>>>> 5391b7c352787995f1255dab4172d18caaa3185f
        $('#name-input').val('');
        $('#email-input').val('');
        guestCount++;
    })

    $(document).on('click', '.remove', function () {
        var guestNumber = $(this).attr("data-guest");
        $("#guest-" + guestNumber).remove();
        guestsArr.splice(guestNumber, 1);

    });
    $('.guest-display').html(localStorage.getItem('savedGuest'));
    /////////////////////////////////////////////////////////////////////////

    //click handler for adding restaurant
    $("#add-restaurant").on("click", function (event) {

        //prevents page reload
        event.preventDefault();
        //search variables
        var location = $("#location").val().trim();
        var restaurant = $("#text-box").val().trim();
        var result = restaurant.replace(" ", "%20");
        var locationFix = location.replace(" ", "%20");
        var queryURL = "https://developers.zomato.com/api/v2.1/cities?q=" + locationFix;

        console.log(queryURL);

        //calls to zomato API
        $.ajax({
            url: queryURL,
            headers: {
                "user-key": "f69c8b568483aa852e551427f51f2186"
            },
            method: "GET"
        }).then(function (response1) {

            var cityID = response1.location_suggestions[0].id;
            var restaurantURL = "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityID + "&entity_type=city&q=" + result + "&count=1";

            $.ajax({
                url: restaurantURL,
                headers: {
                    "user-key": "f69c8b568483aa852e551427f51f2186"
                },
                method: "GET"
            }).then(function (response) {

                console.log(response);

                //new restaurant variables
                var rowDiv = $("<div id='restaurant' class ='row'>")
                var newDiv = $("<div>");
                var imgDiv = $("<div>");
                var resImg = $("<img>");
                var resDescription = $("<div>");
                var removeRestaurant = $("<div>");
                var removeButton = $("<button>");

                newDiv.addClass("restaurant-container");

                //adds materialize styling
                imgDiv.addClass("col s4");

                //adds styling and the src attribute to the image
                resImg.addClass("responsive-img");

                if (!response.restaurants[0].restaurant.thumb) {
                    resImg.attr("alt", "Generic Food Image");
                    resImg.attr("src", "http://jumpingrocks.com/files/seo-galleries/gallery-161/thumbs/Cheshire-T-Food-Wine-051-200x200.jpg");
                } else {
                    resImg.attr("alt", "Image of " + response.restaurants[0].restaurant.name);
                    resImg.attr("src", response.restaurants[0].restaurant.thumb);
                }

                //appends image to the new div
                imgDiv.append(resImg);

                newDiv.append(imgDiv);

                //adds styling for the description section
                resDescription.addClass("col s5");

                //adds restaurant information to the descrition div
                resDescription.append("<h5><a target='_blank' href=" + response.restaurants[0].restaurant.url + " target='_blank'>" + response.restaurants[0].restaurant.name + "</a></h5><p><strong>Location:</strong> " + response.restaurants[0].restaurant.location.address + "</p><p><strong>Cuisine:</strong> " + response.restaurants[0].restaurant.cuisines + "</p><p><strong> Average cost per person:</strong> $" + Math.ceil(parseInt(response.restaurants[0].restaurant.average_cost_for_two) / 2) + "</p><p> <strong>User rating:</strong> " + response.restaurants[0].restaurant.user_rating.rating_text + "</p><br>");

                console.log(response);

                newDiv.append(resDescription);

                //adds remove button
                removeRestaurant.addClass("col s3");
                removeButton.addClass("btn remove red lighten-1");
                removeButton.html('Remove<i class="material-icons right">delete</i>')
                removeRestaurant.append(removeButton);

                newDiv.append(removeRestaurant);
                rowDiv.append(newDiv);
                rowDiv.prepend("<hr><br>");

                //appends the new restaurant to the description row
                $("#description").prepend(rowDiv);

                //clears search box
                $("#text-box").val("");
            });

        });

        //adds make plan button under first displayed restaurant
        $("#add-restaurant").on("click", function (event) {

            $('.make-plan-btn').html('<a class="waves-effect waves-light btn modal-trigger red lighten-1" href="#modal1">Make the Plan<i class="material-icons right">assignment</i></a>');
        });
        //removes div of associated restaurant when remove button is clicked
        $(document).on("click", ".remove", function () {
            $(this).closest('#restaurant').remove();
        });

        // $(document).on("click", "#plan-btn", function () {

        //     var poll = {
        //         "title": "This is a test poll.",
        //         "options": [
        //             "Option #1",
        //             "Option #2"
        //         ],
        //         "multi": true
        //     };
        //     $.ajax({
        //         header: {
        //             "Access-Control-Allow-Origin": "https://strawpoll.me/api/v2/polls/",
        //             Vary: "Origin",
        //             contentType: "application/json"
        //         },
        //         method: "POST",
        //         data: poll

        //     }).then(function (response) {
        //         console.log(response);
        //     })
        // });


        // progress bar
        $(document).ajaxStart(function () {
            // show loader on start
            $(".preloader-wrapper").show();
        }).ajaxSuccess(function () {
            // hide loader on success
            $(".preloader-wrapper").hide();
        });


    });
});