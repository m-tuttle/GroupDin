$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();

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
            });

        });
    });

});