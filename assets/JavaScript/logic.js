$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();

    $("#add-restaurant").on("click", function (event) {

        event.preventDefault();

        var restaurant = $("#text-box").val().trim();
        var result = restaurant.replace(" ", "%20");
        var queryURL = "https://developers.zomato.com/api/v2.1/search?entity_id=chicago&entity_type=city&count=1&q=" + result;

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            headers: {
                "user-key": "f69c8b568483aa852e551427f51f2186"
            },
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var businessID = response.restaurants[0].restaurant.R.res_id;
            var businessURL = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" + businessID;

            console.log(businessID);
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