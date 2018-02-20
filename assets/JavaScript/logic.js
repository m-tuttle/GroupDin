$(document).ready(function () {
   var restaurant = $('#restaurant');
    //progress bar hide
    $('.preloader-wrapper').hide();
    //modal handler
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal

    });
    /////////This section needs a lot of work and cleaning up///////////////////
    var guestCount = 0
    $('#add-guest-btn').on('click', function () {
        event.preventDefault();
        localStorage.clear();
        var guestsArr = [];
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
        $('.res-display').append(restaurant);
        guestsArr.push(newDiv.text());


        $('#name-input').val('');
        $('#email-input').val('');
        guestCount++;
        var savedGuest = JSON.parse(guestsArr);
        for (var i = 0; i < savedGuest.length; i++) {
            localStorage.setItem('savedGuest', savedGuest[i]);
        };
    })

    $(document).on('click', '.remove', function () {
        var guestNumber = $(this).attr("data-guest");
        $("#guest-" + guestNumber).remove();

    });
    $('.guest-display').html(localStorage.getItem('savedGuest'));
    /////////////////////////////////////////////////////////////////////////

    //click handler for adding restaurant
    $("#add-restaurant").on("click", function (event) {

        //prevents page reload
        event.preventDefault();
        //search variables
        var restaurant = $("#text-box").val().trim();
        var result = restaurant.replace(" ", "%20");
        var queryURL = "https://developers.zomato.com/api/v2.1/search?entity_id=chicago&entity_type=city&count=1&q=" + result;

        console.log(queryURL);

        //calls to zomato API
        $.ajax({
            url: queryURL,
            headers: {
                "user-key": "f69c8b568483aa852e551427f51f2186"
            },
            method: "GET"
        }).then(function (response) {

            console.log(response);

            //variables to call specific restaurant by ID
            var businessID = response.restaurants[0].restaurant.R.res_id;
            var businessURL = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + businessID;

            console.log(businessID);

            //ajax call to zomato API with restaurant ID
            $.ajax({
                url: businessURL,
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
                resImg.attr("alt", "Image of " + response.name);
                resImg.attr("src", response.thumb);

                //appends image to the new div
                imgDiv.append(resImg);

                newDiv.append(imgDiv);

                //adds styling for the description section
                resDescription.addClass("col s5");

                //adds restaurant information to the descrition div
                resDescription.append("<h5><a target='_blank' href=" + response.url + " target='_blank'>" + response.name + "</a></h5><p><strong>Location:</strong> " + response.location.address + "</p><p><strong>Cuisine:</strong> " + response.cuisines + "</p><p><strong> Average cost per person:</strong> $" + Math.ceil(parseInt(response.average_cost_for_two) / 2) + "</p><p> <strong>User rating:</strong> " + response.user_rating.rating_text + "</p><br>");

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
    });
    //adds make plan button under first displayed restaurant
    $("#add-restaurant").on("click", function (event) {

        $('.make-plan-btn').html('<a class="waves-effect waves-light btn modal-trigger red lighten-1" href="#modal1">Make the Plan<i class="material-icons right">assignment</i></a>');
    });
    //removes div of associated restaurant when remove button is clicked
    $(document).on("click", ".remove", function () {
        $(this).closest('#restaurant').remove();
    })
    // progress bar
    $(document).ajaxStart(function() {
        // show loader on start
        $(".preloader-wrapper").show();
        }).ajaxSuccess(function() {
        // hide loader on success
        $(".preloader-wrapper").hide();
    });


});