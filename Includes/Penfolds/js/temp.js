
//$(function() {

//    $("#discussions .dropdown .dropdown-menu.sans-serif li a").on("click", function () {
//        if ($(this).text().toLowerCase() == "oldest to newest") {
            
//            $("#discussions .dropdown a.dropdown-toggle").html("Oldest To Newest");
//            $(this).html("NEWEST TO OLDEST");
 

//        } else if ($(this).text().toLowerCase() == "newest to oldest") {
            
//            $("#discussions .dropdown a.dropdown-toggle").html("Newest to Oldest");
//            $(this).html("OLDEST TO NEWEST");

//        }

//        $($(".col-xs-12.notes .row").get().reverse()).appendTo(".col-xs-12.notes");
//    });

//    $(".btn-primary.download").on("click", function() {
//        $(".col-xs-12.notes .row").each(function() {
//            var $chkBox = $(this).find("input[type='checkbox']");
                
//            if ($chkBox.attr("checked") == "checked") {
//                var url = $chkBox.attr("data-tasting-notes-link");
//                window.open(url);
//            }

//        });
//    });

//});

/*start about-cellar-reserve - vineyard map*/
/*todo center map*/
////////if ($('#about-cellar-reserve .sidebar .vineyards .map').length > 0) {
////////    var bounds = new google.maps.LatLngBounds();

////////    var map = null, selectedVineyard = null,
////////             infowindow = new InfoBox({
////////                 maxWidth: 0,
////////                 boxStyle: {
////////                     background: '#fff',
////////                     opacity: 1,
////////                     width: "240px"
////////                 },
////////                 pixelOffset: new google.maps.Size(-120, -45),
////////                 closeBoxURL: "",
////////                 enableEventPropagation: true,
////////                 infoBoxClearance: new google.maps.Size(1, 1),
////////                 alignBottom: true
////////             });


////////    // Create map
////////    google.maps.event.addDomListener(window, 'load', function () {
////////        map = new google.maps.Map($('#about-cellar-reserve .sidebar .vineyards .map')[0], {
////////            zoom: 6,
////////            scrollwheel: false,
////////            disableDefaultUI: true,
////////            zoomControl: true,
////////            mapTypeId: google.maps.MapTypeId.ROADMAP,
////////            zoomControlOptions: {
////////                style: google.maps.ZoomControlStyle.LARGE
////////            },
////////            styles: [
////////                {
////////                    "stylers": [
////////                        { "saturation": -100 }
////////                    ]
////////                },
////////                {
////////                    featureType: "poi",
////////                    elementType: "labels",
////////                    stylers: [
////////                        { visibility: "off" }
////////                    ]
////////                }
////////            ]
////////        });

////////        // Add all vineyards to map
////////        $.each(vineyards, function (index, vineyard) {
////////            var marker = new google.maps.Marker({
////////                position: new google.maps.LatLng(vineyard.Lat, vineyard.Lon),
////////                map: map,
////////                title: vineyard.name,
////////                icon: '/includes/penfolds/images/maps-marker.png'
////////            });
////////            bounds.extend(marker.position);

////////            var description = '<a href="#" class="close">×</a><div class="dialog"><h5>' + vineyard.Name + '</h5><div class="content"><p>' + vineyard.Address + '<br/>' + vineyard.Info + '</p>' + (vineyard.Description ? '<p>' + vineyard.Description + '</p>' : '') + '</div></div>';
////////            google.maps.event.addListener(marker, 'click', function () {
////////                infowindow.setContent(description);
////////                infowindow.open(map, marker);
////////            });
////////        });

////////        // Select first one in list to center on
////////        selectVineyard(vineyards[0]);
////////    });

////////    $(window).resize(centerMap);


////////    function centerMap() {
////////        if (map && selectedVineyard) {
////////            map.fitBounds(bounds);
////////            //map.setCenter(new google.maps.LatLng(selectedVineyard.Lat, selectedVineyard.Lon));
////////        }
////////    }

////////    function selectVineyard(vineyard) {
////////        selectedVineyard = vineyard;
////////        centerMap();
////////    }
//}
/*end about-cellar-reserve - vineyard map*/
