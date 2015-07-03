var Header = {
    breakpoints: {
        desktop: 1280,
        tablet: 768,
        mobile: 320
    },
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    init: function () {
        var self = this;

        var $windowWidth = $(window).width();

        if ($windowWidth >= Header.breakpoints.desktop) {
            Header.isDesktop = true;
        } else if ($windowWidth >= Header.breakpoints.tablet && $windowWidth < Header.breakpoints.desktop) {
            Header.isTablet = true;
        } else {
            Header.isMobile = true;
        }

        self.nav();
    },
    nav: function () {
        if (Header.isDesktop) {
            $(document).on('click', '.navbar-nav a', function () {
                var href = $(this).attr('href');
                if (typeof href !== typeof undefined && href !== false) {
                    window.location = href;
                }
            });
        }
        $(document).on('click', '#more-collapse a', function () {
            window.location = $(this).attr('href');
        });

        //Fix for KK
        $('#header').on('click', 'ul.nav > li > a', function (e) {
            window.open(e.target.href, '_self');
        });
    },
    end: function () { }
}

$(document).ready(function () {
    Header.init();
});

$('#header #search-bar [type="submit"]').attr('disabled', 'disabled').after('<div id="search-button" style="position: absolute; width: 50px; height: 50px; top:15px; right:70px; background:#be0216; filter: alpha(opacity=0); opacity: 0;"></div>');


function OnSearch(searchText) {

    var hfSiteUrl = document.getElementById("hfSiteUrl");

    var url = hfSiteUrl.value + "?s=" + searchText;

    window.location = url;

}

function Search(searchText) {


    //$("#search-barDiv ul").empty();

    //var url = location.protocol + "//" + location.host;

    //$.get(url + '/api/Search/SearchProduct', { s: searchText }, function (data) {
    //    $("#search-barDiv ul").empty();

    //    var hfSiteUrl = document.getElementById("hfSiteUrl");

    //    var url2 = hfSiteUrl.value + "?s=" + searchText;

    //    $("#search-barDiv ul").append('<li><a id="countLink" href="../../../Penfolds Wines - Home_files/' + url2 + '" class="link-underline-hover"><span class="keyword">' + data.SearchText + '(' + data.ResultCount + ')</span></a></li>');

    //    $.each(data.Items, function (index, value)
    //    {
    //        $("#search-barDiv ul").append('<li><a  href="../../../Penfolds Wines - Home_files/'+value.Url+'" class="link-underline-hover"><span class="keyword">' + value.Name + '</span></a></li>');

    //    });


    //}, 'json');

    ecommSearch(searchText);

}

function ActionClick(clt) {

}


// Search Box JS
$(document).ready(function () {

    $('#search-button').on("click", function (e) {

        var searchTxt = document.getElementById("searchbox");

        if (searchTxt.value.length > 2) {
            OnSearch(searchTxt.value);
        }

    });

    $("#AllRanges").click(function (event) {

        event.preventDefault();

        return false;
    });


    var count = 10;
    var labels, mapped;


});