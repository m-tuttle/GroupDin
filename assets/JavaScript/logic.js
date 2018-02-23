// initialize variables
var guestsArr = [];
var restaurantArr = [];
var guestCount = 0;
var resCount;
var firebaseRestaurants = [];
var searchQueryID = (new URL(document.location)).searchParams;
var FBQuery;
var uluru;
var map;

if (searchQueryID.get("plan") === null) {
    FBQuery = "xxxxxxx";
} else {
    FBQuery = searchQueryID.get("plan");
}

// initialize emailjs library
(function () {
    emailjs.init("user_XJbwyf2xbHbQPQTvRcRmd");
})();

// function for initializing the google map
function initMap() {
    if (!map && uluru.length) {
        $("#map").show();
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: uluru[0]
        });
    }
    if (uluru.length > 0) {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: uluru[0]
        });

        // sets up markers on the map with labels for each restaurant
        var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var labelCount = uluru.length - 1;
        var latlngbounds = new google.maps.LatLngBounds();
        for (i = 0; i < uluru.length; i++) {
            var marker = new google.maps.Marker({
                position: uluru[i],
                label: labels.charAt(labelCount),
                map: map,
            });
            labelCount--;
            latlngbounds.extend(uluru[i])
        }

        // positions the map center and zoom based on the markers
        if (uluru.length > 1) {
            map.fitBounds(latlngbounds);
        }
    } else {
        return;
    }
}

// variable to store lat and long data of restaurants for display on google map
if (!localStorage.getItem("uluru")) {
    uluru = [];
} else {
    uluru = JSON.parse(localStorage.getItem("uluru"));
}

//initializing firebase
var config = {
    apiKey: "AIzaSyD0uy5Vy-ihUzdezogRbIkDNBPkB5OlZ8g",
    authDomain: "groupdin-da46a.firebaseapp.com",
    databaseURL: "https://groupdin-da46a.firebaseio.com",
    projectId: "groupdin-da46a",
    storageBucket: "groupdin-da46a.appspot.com",
    messagingSenderId: "636669982330"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {

    //checks firebase to get specific data based on search param in url
    database.ref().once("child_added", function (snapshot) {

        //checks if search query is in firebase
        if (snapshot.hasChild(FBQuery)) {
            uluru = [];
            restaurantArr = [];
            localStorage.clear("restaurantArr");

            //pulls firebase objects and populates html on the page
            snapshot.child(FBQuery).forEach(function (childSnapshot) {
                var data = childSnapshot.val();

                var FBResNew = {
                    thumbnail: data.thumbnail,
                    name: data.name,
                    url: data.url,
                    address: data.address,
                    cuisines: data.cuisines,
                    cost: data.cost,
                    rating: data.rating,
                    id: data.id,
                    lat: data.lat,
                    long: data.long
                };

                firebaseRestaurants.push(FBResNew);
                restaurantArr.push(data.id);

                localStorage.setItem("restaurantArr", JSON.stringify(restaurantArr));

                //creates html tags for restaurant information
                var rowDiv = $("<div>");
                var newDiv = $("<div>");
                var imgDiv = $("<div>");
                var resImg = $("<img>");
                var resDescription = $("<div>");
                var removeRestaurant = $("<div>");
                var removeButton = $("<button>");

                rowDiv.addClass("row restaurant");
                rowDiv.attr("id", data.id);
                newDiv.addClass("restaurant-container");

                //adds materialize styling
                imgDiv.addClass("col s4");

                //adds styling and the src attribute to the image
                resImg.addClass("responsive-img");

                resImg.attr("alt", "Image of " + data.name);
                resImg.attr("src", data.thumbnail);

                //appends image to the new div
                imgDiv.append(resImg);

                newDiv.append(imgDiv);

                //adds styling for the description section
                resDescription.addClass("col s5");

                //adds restaurant information to the descrition div
                resDescription.append("<h3><a target='_blank' href=" + data.url + " target='_blank'>" + data.name + "</a></h3><p><strong>Location:</strong> " + data.address + "</p><p><strong>Cuisine:</strong> " + data.cuisines + "</p><p><strong> Average cost per person:</strong> $" + Math.ceil(parseInt(data.cost) / 2) + "</p><p> <strong>User rating:</strong> " + data.rating + "</p><br>");


                newDiv.append(resDescription);

                //adds remove button
                removeRestaurant.addClass("col s3 plan-remove");
                removeButton.addClass("btn remove red lighten-1");
                removeButton.html('Remove<i class="material-icons right">delete</i>')
                removeRestaurant.append(removeButton);

                newDiv.append(removeRestaurant);
                rowDiv.append(newDiv);
                rowDiv.prepend("<hr><br>");

                //appends the new restaurant to the description row
                $("#description").prepend(rowDiv);
                var description = $("#description").html();
                localStorage.setItem("results", description)

                //adds make a plan button below restaurant
                $('.make-plan-btn').html('<a class="waves-effect waves-light btn modal-trigger red lighten-1" id="plan-btn" href="#modal1">Make the Plan<i class="material-icons right">assignment</i></a>');

                $('.clear-btn').html('<a class="waves-effect waves-light btn modal-trigger red lighten-1" id="clearAll" href="#modal3">Clear All<i class="material-icons right">delete_forever</i></a>');

                // store the lat and long data in a variable and store in array for use in google map and call init map
                var placeLocation = {
                    lat: Number(data.lat),
                    lng: Number(data.long)
                };
                uluru.push(placeLocation);
            });

        } else {
            // locally store previously displayed search results
            $('#description').html(localStorage.getItem('results'));
            // disable plan button (and remove 2nd plan button) if there are no restaurants displayed
            if ($('#description').html().trim() === "") {
                $('#plan-btn').addClass("disabled");
                $('.make-plan-btn').html("");
                $('.clear-btn').html("");
            } else {
                $('.make-plan-btn').html('<a class="waves-effect waves-light btn modal-trigger red lighten-1" id="plan-btn" href="#modal1">Make the Plan<i class="material-icons right">assignment</i></a>');
                $('.clear-btn').html('<a class= "waves-effect waves-light btn modal-trigger red lighten-1" id="clearAll" href="#modal3">Clear All<i class="material-icons right">delete_forever</i></a>');
                $('#plan-btn').removeClass("disabled");
                $('#map').show();

                if (localStorage.getItem("restaurantArr")) {
                    var storedRestaurants = JSON.parse(localStorage.getItem("restaurantArr"));

                    if (storedRestaurants.length === null) {
                        restaurantArr.push(storedRestaurants);
                    } else {
                        restaurantArr = storedRestaurants;
                    }
                }
            }
        }
    }).then(function () {
        initMap();
    });

    //locally store last used location
    $('#location').val(localStorage.getItem('favLocal'));
    //progress bar hide
    $('.preloader-wrapper').hide();
    //modal handler
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background

    });

    $(document).on("click", "#plan-btn", function () {
        var restaurantsClone = $("#description").clone();
        restaurantsClone.find(".plan-remove").remove();
        $(".res-display").html(restaurantsClone);

        // getting a static google map into the modal section
        var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var labelCount = uluru.length - 1;
        var uluruString = ""
        for (i = 0; i < uluru.length; i++) {
            uluruString += "&markers=label:" + labels.charAt(labelCount) + "|" + uluru[i].lat + "," + uluru[i].lng;
            labelCount--;
        }
        var staticMapSrc = "https://maps.googleapis.com/maps/api/staticmap?size=600x200" + uluruString + "&key=AIzaSyAuumDe8MOiLBGbQJi6mLMDksIWLdb4DbU";
        var staticMapImg = $("<img class='responsive-img'>");
        staticMapImg.attr("src", staticMapSrc);
        $(".res-display").append(staticMapImg);

        var newPlan = database.ref("/plans");
        var pushed = newPlan.push(
            firebaseRestaurants
        );
        var planID = pushed.key;
        $("#plan-url").attr("href", "https://m-tuttle.github.io/Project-1/?plan=" + planID);
        $("#plan-url").text("https://m-tuttle.github.io/Project-1/?plan=" + planID);
    });

    // on click handler for the add guest button inside the modal
    $('#add-guest-btn').on('click', function () {

        //prevents page reload and validates input
        if ($("#guestForm")[0].checkValidity()) {
            event.preventDefault();
        } else {
            return
        }
        var email = $('#email-input').val().trim();
        var divContent = $(".guest-display").html();
        var newDiv = $("<div>");
        newDiv.addClass("row");
        newDiv.attr("id", "guest-" + guestCount);
        newDiv.append(name + '\xa0\xa0\xa0\xa0');
        newDiv.append(email + '\xa0\xa0\xa0\xa0');
        var removeBtn = $("<button>").attr("data-guest", guestCount);
        removeBtn.attr("class", "remove-btn btn red lighten-1");
        removeBtn.html('Remove<i class="material-icons right">delete</i>');
        newDiv.append(removeBtn);
        $(".guest-display").prepend(newDiv);
        guestsArr.push(email);
        $('#email-input').val('');
        guestCount++;
    });

    // on click function for guest remove button
    $(document).on('click', '.remove-btn', function () {
        var guestNumber = $(this).attr("data-guest");
        $("#guest-" + guestNumber).remove();
        guestsArr.splice(guestNumber, 1);

    });

    // click handler to send out plan email
    $("#sendEmail").on("click", function () {
        if ($("#sendForm")[0].checkValidity()) {
            event.preventDefault();
            if (guestsArr.length > 0) {
                var userEmail = $("#userEmail-input").val().trim()
                emailjs.send("gmail", "groupdin", {
                    "userEmail": userEmail,
                    "emails": guestsArr.join(", "),
                    "reply_to": guestsArr.join(", ") + ", " + userEmail,
                    "message": $("#icon_prefix2").val().replace(/\n/g, '<br />'),
                    "info": $(".res-display").html()
                });
                $("#modal1").modal("close");
            } else {
                $("#modal4").modal("open");
            }
        }
    })

    //click handler for clear permanent button
    $(document).on('click', '.clear-permanent', function () {
        $('#description').html("");
        $('#plan-btn').addClass("disabled");
        $('.make-plan-btn').html("");
        $('.clear-btn').html("");
        var location = localStorage.getItem('favLocal');
        localStorage.clear();
        localStorage.setItem('favLocal', location);
        $('#map').hide();
        uluru = [];
        restaurantArr = [];
    });
    /////////////////////////////////////////////////////////////////////////

    //click handler for adding restaurant
    $(document).on("click", "#add-restaurant", function (event) {

        //prevents page reload and validates input
        if ($("#searchForm")[0].checkValidity()) {
            event.preventDefault();
        } else {
            return
        }
        //search variables
        var location = $("#location").val().trim();
        var restaurant = $("#text-box").val().trim();
        var result = restaurant.replace(" ", "%20");
        var locationFix = location.replace(" ", "%20");
        var queryURL = "https://developers.zomato.com/api/v2.1/cities?q=" + locationFix;
        localStorage.setItem("favLocal", location)
        $('#plan-btn').removeClass("disabled");

        //calls to zomato API
        $.ajax({
            url: queryURL,
            headers: {
                "user-key": "f69c8b568483aa852e551427f51f2186"
            },
            method: "GET"
        }).then(function (response1) {

            var cityID = response1.location_suggestions[0].id;

            if (result !== "") {
                var restaurantURL = "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityID + "&entity_type=city&q=" + result + "&count=1";
            } else {
                var restaurantURL = "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityID + "&entity_type=city&q=" + result + "&count=1&start=" + Math.floor(Math.random() * 100);
            }

            $.ajax({
                url: restaurantURL,
                headers: {
                    "user-key": "f69c8b568483aa852e551427f51f2186"
                },
                method: "GET"
            }).then(function (response) {

                var responseShort = response.restaurants[0].restaurant;
                var resPic;

                if (!responseShort.thumb) {
                    resPic = "https://di735fsgy6skn.cloudfront.net/media/image/cache/200x/d/o/xdowntown-st-petersburg-food-tour-tasting.jpg.pagespeed.ic.V9l1MB9YEu.jpg";
                } else {
                    resPic = responseShort.thumb;
                }
                //prevents duplicate restaurant additions
                if (!restaurantArr.includes(responseShort.id)) {

                    var FBRes = {
                        thumbnail: resPic,
                        name: responseShort.name,
                        url: responseShort.url,
                        address: responseShort.location.address,
                        cuisines: responseShort.cuisines,
                        cost: responseShort.average_cost_for_two,
                        rating: responseShort.user_rating.rating_text,
                        id: responseShort.id,
                        lat: responseShort.location.latitude,
                        long: responseShort.location.longitude
                    };

                    firebaseRestaurants.push(FBRes);

                    restaurantArr.push(responseShort.id);
                    localStorage.setItem("restaurantArr", JSON.stringify(restaurantArr));

                    //new restaurant variables
                    var rowDiv = $("<div>");
                    var newDiv = $("<div>");
                    var imgDiv = $("<div>");
                    var resImg = $("<img>");
                    var resDescription = $("<div>");
                    var removeRestaurant = $("<div>");
                    var removeButton = $("<button>");

                    rowDiv.addClass("row restaurant");
                    rowDiv.attr("id", responseShort.id);
                    newDiv.addClass("restaurant-container");

                    //adds materialize styling
                    imgDiv.addClass("col s4");

                    //adds styling and the src attribute to the image
                    resImg.addClass("responsive-img");

                    if (!responseShort.thumb) {
                        resImg.attr("alt", "Generic Food Image");
                        resImg.attr("src", resPic);
                    } else {
                        resImg.attr("alt", "Image of " + responseShort.name);
                        resImg.attr("src", resPic);
                    }

                    //appends image to the new div
                    imgDiv.append(resImg);

                    newDiv.append(imgDiv);

                    //adds styling for the description section
                    resDescription.addClass("col s5");

                    //adds restaurant information to the descrition div
                    resDescription.append("<h3><a target='_blank' href=" + responseShort.url + " target='_blank'>" + responseShort.name + "</a></h3><p><strong>Location:</strong> " + responseShort.location.address + "</p><p><strong>Cuisine:</strong> " + responseShort.cuisines + "</p><p><strong> Average cost per person:</strong> $" + Math.ceil(parseInt(responseShort.average_cost_for_two) / 2) + "</p><p> <strong>User rating:</strong> " + responseShort.user_rating.rating_text + "</p><br>");

                    newDiv.append(resDescription);

                    //adds remove button
                    removeRestaurant.addClass("col s3 plan-remove");
                    removeButton.addClass("btn remove red lighten-1");
                    removeButton.html('Remove<i class="material-icons right">delete</i>')
                    removeRestaurant.append(removeButton);

                    newDiv.append(removeRestaurant);

                    //small map option
                    // var staticMapSrc = "https://maps.googleapis.com/maps/api/staticmap?size=150x150&zoom=13&markers=" + Number(responseShort.location.latitude) + "," + Number(responseShort.location.longitude);
                    // var staticMapImg = $("<img>");
                    // staticMapImg.attr("src", staticMapSrc);
                    // newDiv.append(staticMapImg);

                    rowDiv.append(newDiv);
                    rowDiv.prepend("<hr><br>");

                    //appends the new restaurant to the description row
                    $("#description").prepend(rowDiv);
                    var description = $("#description").html();
                    localStorage.setItem("results", description)

                    //adds make a plan button below restaurant
                    $('.make-plan-btn').html('<a class="waves-effect waves-light btn modal-trigger red lighten-1" id="plan-btn" href="#modal1">Make the Plan<i class="material-icons right">assignment</i></a>');
                    //adds clear all button
                    $('.clear-btn').html('<a class="waves-effect waves-light btn modal-trigger red lighten-1" id="clearAll" href="#modal3">Clear All<i class="material-icons right">delete_forever</i></a>');

                    // store the lat and long data in a variable and store in array for use in google map and call init map
                    var placeLocation = {
                        lat: Number(responseShort.location.latitude),
                        lng: Number(responseShort.location.longitude)
                    };
                    uluru.push(placeLocation);
                    localStorage.setItem("uluru", JSON.stringify(uluru));
                    initMap();
                    $("#map").show();
                    //clears search box
                    $("#text-box").val("");
                }
            });

        });
    });

    //removes div of associated restaurant when remove button is clicked
    $(document).on("click", ".remove", function () {

        //removes restaurant from array that prevents adding duplicates
        var resIndex = restaurantArr.indexOf($(this).parent().parent().parent().attr("id"));

        if (resIndex !== -1) {
            restaurantArr.splice(resIndex, 1);
            localStorage.setItem("restaurantArr", JSON.stringify(restaurantArr));
            uluru.splice(resIndex, 1);
            localStorage.setItem("uluru", JSON.stringify(uluru));
            initMap();
        }

        $(this).closest('.restaurant').remove();
        var description = $("#description").html();
        localStorage.setItem("results", description);

        // upon removal of a restaurant this will disable the plan button (and remove the 2nd one) if there are no retaurants
        if ($('#description').html().trim() === "") {
            $('#plan-btn').addClass("disabled");
            $('.make-plan-btn').html("");
            $("#map").hide();
            $('#clearAll').remove();
        } else {
            $('#plan-btn').removeClass("disabled");
        }
    });

    // progress bar
    $(document).ajaxStart(function () {
        // show loader on start
        $(".preloader-wrapper").show();
    }).ajaxSuccess(function () {
        // hide loader on success
        $(".preloader-wrapper").hide();
    });

});