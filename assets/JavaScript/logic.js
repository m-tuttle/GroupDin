$(document).ready(function () {
    //modal handler
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();


    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal

    });
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
        removeBtn.attr("class", "remove");
        removeBtn.text('Remove');
        newDiv.append(removeBtn);
        $(".guest-display").append(newDiv);
        guestsArr.push(newDiv.text());


        $('#name-input').val('');
        $('#email-input').val('');
        guestCount++;
        var savedGuest = JSON.parse(guestsArr);
        for (var i = 0; i < savedGuest.length; i++) {
            localStorage.setItem('savedGuest', savedGuest[i]);
        };
    })

    $(document.body).on('click', '.remove', function () {
        var guestNumber = $(this).attr("data-guest");
        $("#guest-" + guestNumber).remove();

    });
    $('.guest-display').html(localStorage.getItem('savedGuest'));

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
                var newDiv = $("<div>");
                var imgDiv = $("<div>");
                var resImg = $("<img>");
                var resDescription = $("<div>");
                var removeRestaurant = $("<div>");
                var removeButton = $("<button>");

                //adds materialize styling
                imgDiv.addClass("col s4");

                //adds styling and the src attribute to the image
                resImg.addClass("responsive-img");
                resImg.attr("alt", response.name + " picture");
                resImg.attr("src", response.thumb);

                //appends image to the new div
                imgDiv.append(resImg);

                newDiv.append(imgDiv);

                //adds styling for the description section
                resDescription.addClass("col s6");

                //adds restaurant information to the descrition div
                resDescription.append("<h5><a href=" + response.url + " target='_blank'>" + response.name + "</a></h5><p>Location: " + response.location.address + "</p><p> Cuisine: " + response.cuisines + "</p><p> Average cost per person: $" + Math.ceil(parseInt(response.average_cost_for_two) / 2) + "</p><p> User rating: " + response.user_rating.rating_text + "</p><br>");

                newDiv.append(resDescription);

                //adds remove button
                removeRestaurant.addClass("col s2");
                removeButton.addClass("btn remove");
                removeButton.text("Remove Restaurant");
                removeRestaurant.append(removeButton);

                newDiv.append(removeRestaurant);

                //appends the new restaurant to the description row
                $("#description").append(newDiv);

                //clears search box
                $("#text-box").val("");
            });

        });
    });

    //removes div of associated restaurant when remove button is clicked
    $(document).on("click", ".remove", function () {
        $(this).parent().parent().remove();
    })

});