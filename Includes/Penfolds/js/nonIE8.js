// Search Box JS
$(document).ready(function () {


    var s = document.getElementById("searchbox");

    s.addEventListener("keyup", function (e) {

        $("#search-barDiv ul").empty();

        if (s.value.length > 2) {
            Search(s.value);
        }

    }, false);


    var mobilesearch = document.getElementById("mobileSearch");

    mobilesearch.addEventListener("keyup", function (e) {

        $("#search-barDiv ul").empty();

        if (mobilesearch.value.length > 2) {
            Search(mobilesearch.value);
        }

    }, false);


    //  IF ENTER IS PRESSED IN SEARCH BAR
    $('#searchbox').keypress(function (e) {
        if (e.which == 13) { // Checks for the enter key

            e.preventDefault(); // Stops IE from triggering the button to be clicked

            var searchTxt = document.getElementById("searchbox");

            if (searchTxt.value.length > 2) {
                OnSearch(searchTxt.value);
            }
        }
    });


});