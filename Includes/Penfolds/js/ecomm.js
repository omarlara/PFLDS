/* Global Data section - Start */

var glbAllProductCategories = null;

/* Global Data section - End */

/* For Product Listing Filter Criteria - Start */

var SetProductListingFilterCriteria = function (data) {
    glbAllProductCategories = data;
    if (data && data.tagGroups && data.tagGroups.length > 0) {
        var masterCopyHeader = $(".refineWrap #accordionRefine .panel")[0];
        var masterCopyOptions = $(".refineWrap #accordionRefine .panel div.panel-collapse .panel-body .input-group")[0];
        if ($(".refineWrap #accordionRefine .panel").length == 1) {
            $(".refineWrap #accordionRefine .panel").remove();
        }
        else {
            $(".refineWrap #accordionRefine .panel")[0].remove();
        }

        for (var i = 0; i < data.tagGroups.length; i++) {
            var newItem = $(masterCopyHeader).clone();
            // for Group Title
            newItem.find(".panel-heading h4.panel-title a").attr("data-target", ("#targetID" + data.tagGroups[i].id));
            newItem.find(".panel-heading h4.panel-title a").html(data.tagGroups[i].name + "<span class='caret'></span>")
            newItem.find("div.panel-collapse").attr("id", ("targetID" + data.tagGroups[i].id));
            if (data.tagGroups[i].name.toLowerCase() == "year") {
                newItem.find(".panel-body .input-group .input-group-addon :checkbox").attr("data-category", "wine_year");
            }
            else {
                newItem.find(".panel-body .input-group .input-group-addon :checkbox").attr("data-category", data.tagGroups[i].name.replace(" ", "_").toLowerCase());
            }

            newItem.find(".panel-body .input-group .input-group-addon :checkbox").attr("id", data.tagGroups[i].name.replace(" ", "_").toLowerCase() + "-All");
            newItem.find(".panel-body .input-group .input-group-addon label").attr("for", data.tagGroups[i].name.replace(" ", "_").toLowerCase() + "-All");
            // for group children
            for (var j = 0; j < data.tagGroups[i].tags.length; j++) {
                var groupItem = $(masterCopyOptions).clone();
                if (data.tagGroups[i].name.toLowerCase() == "year") {
                    groupItem.find(":checkbox").val(CreateTagValue(data.tagGroups[i].tags[j].name.toString()));
                }
                else {
                    groupItem.find(":checkbox").val(CreateTagValue(data.tagGroups[i].tags[j].id.toString()));
                }
                groupItem.find(":checkbox").attr("id", "group_" + i + "_" + j);
                if (data.tagGroups[i].name.toLowerCase() == "year") {
                    groupItem.find(":checkbox").attr("data-category", "wine_year");
                }
                else {
                    groupItem.find(":checkbox").attr("data-category", data.tagGroups[i].name.replace(" ", "_").toLowerCase());
                }
                groupItem.find(":checkbox").attr("data-value", data.tagGroups[i].tags[j].name);
                groupItem.find(":checkbox").removeAttr("checked");
                groupItem.find("label").attr("for", "group_" + i + "_" + j);
                groupItem.find("label").html(data.tagGroups[i].tags[j].name);
                groupItem.appendTo(newItem.find("div.panel-collapse .panel-body"));
            }
            newItem.removeClass("hidden");
            //newItem.insertBefore(".refineWrap .dropdown-menu.panel-group .row .panel.hidden-sm");
            newItem.appendTo(".refineWrap .dropdown-menu.panel-group .row");
        }
    }

    var productContainers = $(".productListing-main .singleProductRangeWrap .carousel.carousel-container[data-ride='carousel']");
    if (productContainers) {
        if (productContainers.length == 1) {
            var filterData = $(productContainers[0]).data("categoryid");
            if (filterData && filterData.toString().length > 0) {
                EcommData("getProducts", "catid1=" + filterData, ProductListingSuccess, ProductListingFailur);
            }
            else {
                EcommData("getProducts", "", ProductListingSuccess, ProductListingFailur);
            }
        }
        else {
            EcommData("getProducts", "", ProductListingSuccess, ProductListingFailur);
        }
    }
}

var ProductListingFilterCriteriaFail = function (xhr, status, error) {
    //commented out for IE
    //console.log("Error while fetching product for ProductListingFilterCriteriaFail with error:" + error.message);
    $(".refineWrap").addClass("hidden");
}

/* For Product Listing Filter Criteria - End */

/* For Home Related Products - Start */

/* Success Process */
function SetRelatdProductHome(data) {
    if (data && data.products && data.products.length > 0) {
        var carouselItemMasterCopy = $("#wine-portfolio .carousel-container #carousel-portfolio .item")[0];
        if (carouselItemMasterCopy) {
            $("#wine-portfolio .carousel-container #carousel-portfolio .carousel-inner").empty();
            for (var i = 0; i < data.products.length; i++) {
                var newItem = $(carouselItemMasterCopy).clone();
                newItem.removeClass("hidden");
                newItem.find(".portfolio-item img").attr("src", data.products[i].mediumImage);
                newItem.find(".portfolio-item img").attr("alt", data.products[i].productName + " " + data.products[i].lastVintage);
                newItem.find(".portfolio-item img").attr("title", data.products[i].productName + " " + data.products[i].lastVintage);
                newItem.find("a.item-name").html(data.products[i].productName + "<br/>" + data.products[i].lastVintage);
                newItem.find("a.item-name").attr("href", data.products[i].pdpUrl);
                // TODO : point to the new ProductListing Wild card Page
                newItem.find("a.item-series").html(data.products[i].categories[0].name);
                newItem.find("a.item-series").attr("href", data.products[i].categories[0].id);
                newItem.find("a.item-series").addClass("hidden");
                var readMoreLink = newItem.find(".learn-more");
                if (readMoreLink) {
                    if (data.products[i].displayOnly) {
                        newItem.find(".portfolio-item").attr("data-url", data.products[i].pdpUrl);
                        readMoreLink.attr("href", data.products[i].pdpUrl);
                        readMoreLink.html(newItem.find(".learn-more").data("readmore"));
                    }
                    else {
                        //newItem.find(".portfolio-item").attr("data-url", "#");
                        newItem.find(".portfolio-item").attr("data-url", data.products[i].pdpUrl);
                        readMoreLink.attr("href", "#");
                        readMoreLink.attr("data-toggle", "modal");
                        readMoreLink.attr("data-target", "#quick-buy-modal");
                        readMoreLink.html(newItem.find(".learn-more").data("addtobasket"));
                        readMoreLink.attr("data-productId", data.products[i].productId);
                        readMoreLink.on("click", function () {
                            doLoadProductPrices($(this).data("productid"));
                        });
                    }
                }

                if (i != 0) {
                    newItem.removeClass('active');
                }
                newItem.appendTo("#wine-portfolio .carousel-container #carousel-portfolio .carousel-inner");
            }
        }
    }
    //$("#loader-image").addClass("hidden");
}

/* Failur Process */
function RelatdProductHomeFail(xhr, status, error) {
    $("#wine-portfolio .carousel-container[data-filters]").hide();
    console.log("error while loading related products for HomePage.")
}

/* For Home Related Products - End */

/* For Home Related Products - Start */

/* Success Process */
function SetRelatdProductsCarousel(data) {
    if (data && data.products && data.products.length > 0) {
        var carouselItemMasterCopy = $(".kk-feature-products #releases-carousel .item")[0];
        if (carouselItemMasterCopy) {
            $(".kk-feature-products #releases-carousel .carousel-inner").empty();
            for (var i = 0; i < data.products.length; i++) {
                var newItem = $(carouselItemMasterCopy).clone();
                newItem.removeClass("hidden");
                newItem.find("div.slide > div > a > img").attr("src", data.products[i].mediumImage);
                newItem.find("div.slide > div > a > img").attr("alt", data.products[i].productName + " " + data.products[i].lastVintage);

                newItem.find("div.slide > div > a").attr("href", data.products[i].pdpUrl);
                newItem.find("div.slide > div > a").attr("title", data.products[i].productName + " " + data.products[i].lastVintage);

                // newItem.find("div.slide > div > a").attr("href", data.products[i].pdpUrl);
                //newItem.find("div.slide > div > a").attr("href", "#");

                newItem.find("div.slide > h5 > a").attr("href", data.products[i].pdpUrl);
                newItem.find("div.slide > h5 > a").html(data.products[i].productName + "<br/>" + data.products[i].lastVintage);
                var readMoreLink = newItem.find(".btn-primary");
                if (readMoreLink) {
                    if (data.products[i].displayOnly) {
                        readMoreLink.attr("href", data.products[i].pdpUrl);
                        readMoreLink.html(readMoreLink.data("readmore"));
                    }
                    else {
                        readMoreLink.attr("data-toggle", "modal");
                        readMoreLink.attr("data-target", "#quick-buy-modal");
                        readMoreLink.html(readMoreLink.data("addtobasket"));
                        readMoreLink.attr("data-productId", data.products[i].productId);
                        readMoreLink.on("click", function () {
                            doLoadProductPrices($(this).data("productid"));
                        });
                    }
                }

                if (i != 0) {
                    newItem.removeClass('active');
                }
                newItem.appendTo(".kk-feature-products #releases-carousel .carousel-inner");
            }
        }
    }
    //$("#loader-image").addClass("hidden");
}

/* Failur Process */
function SetRelatdProductsCarouselFail(xhr, status, error) {
    $(".kk-feature-products #releases-carousel[data-filters]").hide();
    console.log("error while loading related products for kk-feature-products.")
}

/* For Home Related Products - End */

/* For Product Listing Page -Start */

function ProductListingSuccess(data) {
    if (data && data.products && data.products.length > 0) {
        var productContainers = $(".productListing-main .singleProductRangeWrap .carousel.carousel-container[data-ride='carousel']");
        $(productContainers).each(function (index, element) {
            var categoryId = $(element).data("categoryid");
            var productsForCategories = Enumerable.From(data.products).Where(function (x) { return Enumerable.From(x.categories).Contains(categoryId.toString(), "$.id") }).ToArray();
            if (productsForCategories && productsForCategories.length > 0) {
                var carouselItemMasterCopy = $(element).find(".carousel-inner .item")[0];
                if (carouselItemMasterCopy) {
                    $(element).find(".carousel-inner").empty();
                    for (var i = 0; i < productsForCategories.length; i++) {
                        var newItem = $(carouselItemMasterCopy).clone();
                        newItem.removeClass("hidden");
                        newItem.find("div.slide img").attr("src", productsForCategories[i].mediumImage);
                        newItem.find("div.slide img").attr("alt", productsForCategories[i].productName + " " + productsForCategories[i].lastVintage);
                        newItem.find("div.slide img").attr("title", productsForCategories[i].productName + " " + productsForCategories[i].lastVintage);
                        newItem.find("div.slide h5").html(productsForCategories[i].productName + "<br/>" + productsForCategories[i].lastVintage);
                        newItem.find("div.slide a").attr("href", productsForCategories[i].pdpUrl);

                        var readMoreLink = newItem.find("div.slide div .learn-more");
                        if (readMoreLink) {
                            if (productsForCategories[i].displayOnly) {
                                readMoreLink.attr("href", productsForCategories[i].pdpUrl);
                                readMoreLink.html(readMoreLink.data("readmore"));
                            }
                            else {
                                readMoreLink.attr("href", "#");
                                readMoreLink.attr("data-toggle", "modal");
                                readMoreLink.attr("data-target", "#quick-buy-modal");
                                readMoreLink.html(readMoreLink.data("addtobasket"));
                                readMoreLink.attr("data-productId", productsForCategories[i].productId);
                                //readMoreLink.attr("onclick", "javascript:doLoadProductPrices('" + productsForCategories[i].productId + "'); return false;");
                                readMoreLink.on("click", function () {
                                    doLoadProductPrices($(this).data("productid"));
                                });
                            }
                        }

                        /* Set Tagged Data for Product */
                        var productDiv = newItem.find("div.slide");
                        if (productDiv) {
                            productDiv.attr("data-wine-year", CreateTagValue(productsForCategories[i].lastVintage));

                            for (var k = 0; k < productsForCategories[i].tags.length; k++) {
                                var tagGroupName = GetTagGroupNameFromTagId(productsForCategories[i].tags[k].id);
                                switch (tagGroupName.toLowerCase()) {
                                    case "wine type":
                                        var oldValue = productDiv.attr("data-wine-type");
                                        if (oldValue) {
                                            productDiv.attr("data-wine-type", oldValue + "|" + CreateTagValue(productsForCategories[i].tags[k].id));
                                        }
                                        else {
                                            productDiv.attr("data-wine-type", CreateTagValue(productsForCategories[i].tags[k].id));
                                        }
                                        break;
                                    case "occasions":
                                        var oldValue = productDiv.attr("data-wine-occasions");
                                        if (oldValue) {
                                            productDiv.attr("data-wine-occasions", oldValue + "|" + CreateTagValue(productsForCategories[i].tags[k].id));
                                        }
                                        else {
                                            productDiv.attr("data-wine-occasions", CreateTagValue(productsForCategories[i].tags[k].id));
                                        }
                                        break;
                                    case "grape variety":
                                        var oldValue = productDiv.attr("data-wine-grape-variety");
                                        if (oldValue) {
                                            productDiv.attr("data-wine-grape-variety", oldValue + "|" + CreateTagValue(productsForCategories[i].tags[k].id));
                                        }
                                        else {
                                            productDiv.attr("data-wine-grape-variety", CreateTagValue(productsForCategories[i].tags[k].id));
                                        }

                                        break;
                                    case "food pairing":
                                        var oldValue = productDiv.attr("data-wine-food-pairing");
                                        if (oldValue) {
                                            productDiv.attr("data-wine-food-pairing", oldValue + "|" + CreateTagValue(productsForCategories[i].tags[k].id));
                                        }
                                        else {
                                            productDiv.attr("data-wine-food-pairing", CreateTagValue(productsForCategories[i].tags[k].id));
                                        }

                                        break;
                                }
                            }
                        }

                        if (i != 0 || productContainers.length == 1) {
                            newItem.removeClass('active');
                        }
                        newItem.appendTo($(element).find(".carousel-inner"));
                    }
                }
            }
            //$(element).carousel("pause").removeData();
            //$(element).carousel(1);
        });
    }
    App.product_listing_filter();
    //$("#loader-image").addClass("hidden");
}

function CreateTagValue(tagValue) {
    if (tagValue) {
        return ("-" + tagValue.toString() + "-");
    }
    return "";
}

function GetTagGroupNameFromTagId(tagId) {
    var test = Enumerable.From(glbAllProductCategories.tagGroups).Where(function (x) { return Enumerable.From(x.tags).Contains(tagId, "$.id") }).ToArray();
    //.Where("$.id == " + tagId).ToArray();
    if (test && test.length > 0) {
        return test[0].name;
    }
    return "";
}

function ProductListingFailur(xhr, status, error) {
    console.log("error while fatching data for ProductListingFailur with error:" + error);
    $(".productListing-main .singleProductRangeWrap .carousel.carousel-container[data-ride='carousel']").empty();
}

/* For Product Listing Page - End */

/* REMOVE CLASS ON MODAL CLOSE */
$('#login-modal-exit').click(function () {
    $('body').removeClass('modal-open');
});

// For Home Related Products - End */
/*
var EcommDataWithOption = function (functionName, query, callBackSuccess, callBackError, selectorObj) {
    if (!functionName.length) {
        return false;
    }
    //show Loader
    //$("#loader-image").show();
    var url = $("#hdnTWEeCommerceURL").val();
    url = url + functionName + ".action";

    $.ajax({
        type: "GET",
        url: url,
        data: query,
        async: false,
        cache: true,
        crossDomain: true,
        jsonpCallback: "jsonpCallback",
        contentType: "application/json",
        dataType: 'jsonp',
    }).done(function (json) {
        callBackSuccess(json, selectorObj);
    })
    .fail(function (xhr, status, error) {
        console.log(error);
        callBackError(xhr, status, error, selectorObj);
    });

    return true;
}
*/

var EcommData = function (functionName, query, callBackSuccess, callBackError) {
    if (!functionName.length) {
        return false;
    }

    //show Loader
    //$("#loader-image").removeClass("hidden");
    var url = $("#hdnTWEeCommerceURL").val();
    url = url + functionName + ".action";

    $.ajax({
        type: "GET",
        url: url,
        data: query,
        async: false,
        cache: true,
        crossDomain: true,
        jsonpCallback: "jsonpCallback",
        contentType: "application/json",
        dataType: 'jsonp',
        xhrFields: { withCredentials: true }
    }).done(function (json) {
        callBackSuccess(json);
    })
    .fail(function (xhr, status, error) {
        console.log(error);
        zeroResultsComplete();
        callBackError(xhr, status, error);
    })
    .always(function () {
        if (functionName = 'LoginSubmitJson') {
            $('#loading-image').hide();
        };
    })

    /*$.ajax({
        type: "GET",
        url: url,
        data: query,
        async: false,
        jsonpCallback: "jsonpCallback",
        dataType: 'jsonp',
        //xhrFields: { withCredentials: true },
        success: function (json) {
            callBackSuccess(json);
            //$("#loader-image").addClass("hidden");
        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(url);
            callBackError(xhr);
            //$("#loader-image").addClass("hidden");
        }
    });*/
    //crossDomain: true, contentType: "application/json",
    return true;
}

var EcommPostData = function (functionName, parmArray, callBackSuccess, callBackError) {
    var parms = '{"":""}';
    if (parmArray) {
        parms = '{';
        for (var i = 0; i < parmArray.length; i = i + 2) {
            parms = parms + '' + parmArray[i] + ':"' + parmArray[i + 1] + '"';
            if (i + 2 < parmArray.length) {
                parms = parms + ',';
            }
        }
        //parms = parms + ',"xsrf_token":"' + document.getElementById('kk_xsrf_token').value + '"';
        parms = parms + '}';
    }

    var url = $("#hdnTWEeCommerceURL").val();
    url = url + functionName + ".action";//, query.length ? ("?" + query) : "");

    $.post(
       url,
       parms,
       function (data, textStatus, jqXHR) {
           callBackSuccess(data);
       }).fail(function (jqXHR, textStatus, errorThrown) {
           alert(textStatus);
       });
}

var ecomlogin = function () {
    $('#loading-image').show();
    var email = $('#emailAddr-login').val();
    var password = $('#password-login').val();

    //EcommData("LoginSubmitJson", "emailAddr=" + email + "&password=" + password, sCloginCallback, sCloginCallbackError);

    var url = $("#hdnTWECmsURL").val();
    var userCredentials = { UserName: email, Password: password };

    $.ajax({
        type: "POST",
        url: url + "/api/Security/GetEncryptedUserCredentials",
        contentType: "application/json",
        data: JSON.stringify(userCredentials),
        success: function (data) {
            var id = encodeURIComponent(data.UserName);
            var pass = encodeURIComponent(data.Password);

            EcommData("LoginSubmitJson", "emailAddr=" + id + "&password=" + pass, sCloginCallback, sCloginCallbackError);
        },
        error: function (xhr, status, p3, p4) {
            var err = "Error " + " " + status + " " + p3;
            if (xhr.responseText && xhr.responseText[0] == "{")
                err = JSON.parse(xhr.responseText).message;
            console.log(err);
            $('#loading-image').hide();
        },
        complete: function () {
        }
    });
}

var sCloginCallback = function (result) {
    if (result.result) {
        $('#login-modal-exit').click();

        populateBasket();

        clearLoginDetails();
    } else {
        $('#login-modal-error').css({ display: "block" });
    }
}

var clearLoginDetails = function () {
    $("#emailAddr-login").val("");
    $("#password-login").val("");

    $('#login-modal-error').css({ display: "none" });
}

var sCloginCallbackError = function (result) {
    if (result.result) {
        $('#login-modal-exit').click();
        //		location.reload();
    } else {
        $('#login-modal-error').css({ display: "block" });
    }
}

var ecomLoginCheck = function () {
    var lang = $("#hdnLanguage").val();

    if (lang == "en" || lang == "en-au") {
        populatePage();
    } else {
        hideLoginAndMiniCart();

        /* Calling the ecomm.js functions to populate product on sitecore pages */

        /* feature products Function Call for Home Page */
        LoadRelatedProductsForHome();

        /* feature products Function Call for kk-feature-products */
        LoadRelatedProductsForOtherPages();

        /* Filter Crieteria and Product load function call for Product Category Listing Page */
        LoadFiltersAndProductForCategoryPage();

        /* Loading Products other then Wine Categories */
        LoadOtherCategoryProducts()
    }
}

var hideLoginAndMiniCart = function () {
    $('#LogInRegister').removeClass('hidden-xs');
    $('#LogInRegister').removeClass('inline');
    $('#LogInRegister').css({ 'display': 'none' });

    $('#minicart-container').css({ 'display': 'none' });
}

var ecomLoginCheckSuccess = function (json) {
    if (json) {
        var konakartId = json.konakartId;
        var konakartFname = json.consumerFirstName;
        var konakartLname = json.consumerLastName;

        // Consumers who are not logged into konakart will have a negative konakartId
        if (konakartId == "null" || konakartId == null || konakartId.indexOf("-") > -1) {
            removeEcommCookie();
            //id="emailAddr-login"
            //id="password-login"
        } else {// if not then display the login section and hide the mY account section
            var welcomeText = 'Hello ' + konakartFname;
            $("#MyAccountLink").text(welcomeText);
            $('#LogInRegister').removeClass('hidden-xs');
            $('#LogInRegister').removeClass('inline');
            $('#LogInRegister').css({ 'display': 'none' });
            $('#account-container').show();
            $('#account-container').removeClass('hide');
            $('#account-container').show();
            // KK function to populate basket
        }
        populateBasket();
    }
}
var ecomLoginCheckError = function (xhr, status, error) {
    // To do : display the error somewhere on the site
    console.log("Eror while getting data for ecomLoginCheck.");
    console.log(error);
}

var removeEcommCookie = function () {
    $.removeCookie('konakartId', { path: '/' });
    $.removeCookie('konakartFname', { path: '/' });
    $.removeCookie('konakartLname', { path: '/' });
}

var ecommSearch = function (searchText) {
    $("#SuggestedSearchWines").empty();
    $("#SuggestedSearchStories").empty();

    var searchTerm = "term=" + searchText;

    EcommData("SuggestedSearch", searchTerm, ecommSearchSuccess, ecommSearchError);

    SearchStories(searchText);
}

var ecommSearchError = function (result) {
    // To do : display the error somewhere on the site
}

var ecommSearchSuccess = function (json) {
    var hfSiteUrl = document.getElementById("hfSiteUrl");
    $("#SuggestedSearchWines").empty();

    $("#SuggestedSearchWines").append('<li><h2>Penfolds Wines</h2></li>');

    $.each(json.srArray, function (index, data) {
        var url2 = hfSiteUrl.value + "?s=" + data.value;

        var key = data.id;

        if (key != null && key.length > 0) {
            var keyArray = key.split(',');
            if (keyArray.length == 3) {
                var manuIdVal = keyArray[1];
                var catIdVal = keyArray[2];
                if (catIdVal > -1 && manuIdVal > -1) {
                    // catId = catIdVal;
                    //manuId = manuIdVal;
                    url2 += "&catId=" + catIdVal;
                    url2 += "&manuId=" + manuIdVal;
                } else if (catIdVal > -1) {
                    //manuId = -1;
                    //catId = catIdVal;
                    url2 += "&catId=" + catIdVal;
                    url2 += "&manuId=-1";
                } else if (manuIdVal > -1) {
                    //catId = -1;
                    //manuId=manuIdVal;
                    url2 += "&catId=" + -1;
                    url2 += "&manuId=" + manuIdVal;
                } else {
                    //This is the default behaviour we are doing at the moment.
                    //searchText=inputsearchText;

                    //Note :All the Query string are set in the code Behind of the SeaarchList.ascx.cs
                }
            }
        }
        $("#SuggestedSearchWines").append('<li><a  href="../../../Penfolds Wines - Home_files/' + url2 + '" class="link-underline-hover"><span class="keyword">' + data.value + '</span></a></li>');
    });
}

var SearchStories = function (searchText) {
    //var url = location.protocol + "//" + location.host;
    var url = $("#hdnTWECmsURL").val();

    $.get(url + '/api/Search/SearchStories', { s: searchText }, function (data) {
        $("#SuggestedSearchStories").empty();

        var hfSiteUrl = document.getElementById("hfSiteUrl");

        var url2 = hfSiteUrl.value + "?s=" + searchText;

        $("#SuggestedSearchStories").append('<li><h2>Penfolds Stories</h2></li>');

        $.each(data.Items, function (index, value) {
            $("#SuggestedSearchStories").append('<li><a  href="../../../Penfolds Wines - Home_files/' + value.Url + '" class="link-underline-hover"><span class="keyword">' + value.Name + '</span></a></li>');
        });
    }, 'json');
}

var QuickSearch = function (queryString) {
    EcommData("QuickSearchJSON", queryString, QuickSearchSuccess, QuickSearchError);
}

var QuickSearchError = function (result) {
    // To do : display the error somewhere on the site
}

var hideShowNoDiv = function (numStoryItems, numWineItems) {
    //$('.no-search-results').hide();
    //$('#wineNR').hide();
    //$('#storyNR').hide();
    console.log("numStoryItems:" + numStoryItems);
    console.log("numWineItems:" + numWineItems);
    if ((numStoryItems == 0) && (numWineItems == 0)) {
        zeroResultsComplete();
    } else if ((numStoryItems != 0) && (numWineItems == 0)) {
        //$('.ecom-wines').removeClass('hidden');
        $('#wineNR').removeClass('hidden');
    } else if ((numStoryItems == 0) && (numWineItems != 0)) {
        //$('.penfolds-stories').removeClass('hidden');
        $('#storyNR').removeClass('hidden');
    }
}
var zeroResultsComplete = function () {
    $('.no-search-results').removeClass('hidden');
    $('.penfolds-stories').hide();
    $('.ecom-wines').hide();

    $('#wineNR').hide();
    $('#storyNR').hide();
    $('#ecommerce-page div.title, #ecommerce-page .pagination-container').hide();
}

var QuickSearchSuccess = function (json) {
    var hfSiteUrl = document.getElementById("hfSiteUrl");

    var storiesCount = document.getElementById("hfStoriesCount");

    var productsCount = json.products.length;

    $.each(json.products, function (index, data) {
        //var url2 = hfSiteUrl.value + "?s=" + data.value;

        $("#QuickSearch-ecom-wines")
            .append('<div class="item col-xs-12 col-sm-6 active">' +
                    '<div class="slide" data-url="#">' +
                    '<div class="row">' +
                    '<div class="col-xs-12 col-sm-6"><img src="../../../Penfolds Wines - Home_files/' + data.mediumImage + '" class="img-responsive" alt="' + data.productName + '" width="493" height="716" /></div>' +
                    '<div class="col-xs-12 col-sm-6"><h5><span >' + data.productName + '</span></h5><a href="../../../Penfolds Wines - Home_files/' + data.pdpUrl + '"  class="learn-more">Discover More</a></div>' +
                    '</div></div></div><div id="clearfixDiv" ></div>');
    });

    $('.ecom-wines .category-title').removeClass('hidden');
    $('.penfolds-stories .category-title').removeClass('hidden');
    hideShowNoDiv(parseInt(storiesCount.value), productsCount);
}

var GetAgeGateVerified = function () {
    EcommData("AgeGateVerified", "", GetAgeGateVerifiedSuccess, GetAgeGateVerifiedError);
    return false;
}

var GetAgeGateVerifiedSuccess = function (json) {
    __doPostBack('phmain_0$lnkBtnCountry', '');
}

var GetAgeGateVerifiedError = function (result) {
    // To do : display the error somewhere on the site
}

var SetLocal = function () {
    var $enter = $("#age-verification .enter-section .btn");
    if ($enter.hasClass('disabled')) {
        return false;
    }

    var selectedCountry = $("#age-verification label.serif div.dropdown a.dropdown-toggle").html();
    var query = $("#age-verification label.serif div.dropdown div.dropdown-menu a[data-country='" + selectedCountry + "']").data("ecomm-param");
    if (query && query.length > 0) {
        EcommData("SetLocaleJson", query, SetLocalSuccess, SetLocalError);
    }
    else {
        console.log("No Local Data is configured in CMS for region : " + selectedCountry);
    }

    return false;
}

var SetLocalSuccess = function (json) {
    __doPostBack('phmain_0$lnkBtnCountry', '');
}

var SetLocalError = function (xhr, status, error) {
}

var displayGuest = function (json) {
    $('#LogInRegister').removeClass('hidden-xs');
    $('#LogInRegister').removeClass('inline');
    $('#LogInRegister').css({ 'display': 'none' });
    $('#account-container').show();
    $('#account-container').removeClass('hide');
    $('#account-container').show();

    $('#linkEditCustomer').css({ 'display': 'none ' });
    $('#linkShowAllOrders').css({ 'display': 'none ' });
    $('#linkAddressBook').css({ 'display': 'none ' });
    $('#linkChangePassword').css({ 'display': 'none ' });

    // For Mobile login
    $('#MobileLogInRegister').removeClass('hidden-xs');
    $('#MobileLogInRegister').removeClass('inline');
    $('#MobileLogInRegister').css({ 'display': 'none ' });
    $('#mobile-account-container').show();
    $('#mobile-account-container').removeClass('hide');
    $('#mobile-account-container').show();
}

var LoadRelatedProductsForHome = function () {
    var filterDataObj = $("#wine-portfolio .carousel-container #carousel-portfolio[data-filters]");
    if (filterDataObj && filterDataObj.length > 0) {
        var filters = $(filterDataObj).data("filters");
        EcommData("getProducts", filters, SetRelatdProductHome, RelatdProductHomeFail);
    }
}

var LoadRelatedProductsForOtherPages = function () {
    var filterDataObj1 = $(".carousel-container.kk-feature-products #releases-carousel[data-filters]");
    if (filterDataObj1 && filterDataObj1.length > 0) {
        var filters = $(filterDataObj1).data("filters");
        EcommData("getProducts", filters, SetRelatdProductsCarousel, SetRelatdProductsCarouselFail);
    }
}

var LoadFiltersAndProductForCategoryPage = function () {
    var refineWrapObj = $(".productListingWrap .refineWrap");
    if (refineWrapObj && refineWrapObj.length > 0) {
        EcommData("GetFilteredTagGroupsJSON", "", SetProductListingFilterCriteria, ProductListingFilterCriteriaFail);
    }
}

var LoadOtherCategoryProducts = function () {
    var filterDataObj1 = $(".portfolio-carousel-height #carousel-portfolio[data-filters]");
    if (filterDataObj1 && filterDataObj1.length > 0) {
        var filters = $(filterDataObj1).data("filters");
        EcommData("getProducts", filters, OtherCategoryProductSuccess, OtherCategoryProductFailuer);
    }
}

var OtherCategoryProductSuccess = function (data) {
    if (data && data.products && data.products.length > 0) {
        var carouselItemMasterCopy = $(".portfolio-carousel-height #carousel-portfolio[data-filters] .item")[0];
        if (carouselItemMasterCopy) {
            $(".portfolio-carousel-height #carousel-portfolio .carousel-inner").empty();
            for (var i = 0; i < data.products.length; i++) {
                var newItem = $(carouselItemMasterCopy).clone();
                newItem.removeClass("hidden");
                newItem.find(".portfolio-item").attr("data-url", data.products[i].pdpUrl);
                newItem.find("img").attr("src", data.products[i].mediumImage);
                newItem.find("img").attr("alt", data.products[i].productName + " " + data.products[i].lastVintage);
                newItem.find("img").attr("title", data.products[i].productName + " " + data.products[i].lastVintage);

                newItem.find("a.item-name").attr("href", data.products[i].pdpUrl);
                newItem.find("a.item-name").html(data.products[i].productName + "<br/>" + data.products[i].lastVintage);
                var readMoreLink = newItem.find(".learn-more");
                if (readMoreLink) {
                    if (data.products[i].displayOnly) {
                        readMoreLink.attr("href", data.products[i].pdpUrl);
                        readMoreLink.html(readMoreLink.data("readmore"));
                    }
                    else {
                        readMoreLink.attr("data-toggle", "modal");
                        readMoreLink.attr("data-target", "#quick-buy-modal");
                        readMoreLink.html(readMoreLink.data("addtobasket"));
                        readMoreLink.attr("data-productId", data.products[i].productId);
                        readMoreLink.on("click", function () {
                            doLoadProductPrices($(this).data("productid"));
                        });
                    }
                }

                if (i != 0) {
                    newItem.removeClass('active');
                }
                newItem.appendTo(".portfolio-carousel-height #carousel-portfolio .carousel-inner");
            }
        }
    }
}

function OtherCategoryProductFailuer(xhr, status, error) {
    $(".portfolio-carousel-height #carousel-portfolio[data-categoryid]").hide();
    console.log("Error while loading Products for Other Category listing Page.");
}

var populatePage = function () {
    var url = $("#hdnTWEeCommerceURL").val();
    // Ajax call
    $.ajax({
        type: "GET",
        url: url + "ShowCartItemJSONAction.action",
        jsonpCallback: 'jsonpCallback',
        dataType: 'jsonp',
        xhrFields: { withCredentials: true },
        success: function (result) {
            fillBasketInfo(result);

            if (result.guestLoggedIn) {
                displayGuest(result);
            }

            /* Calling the ecomm.js functions to populate product on sitecore pages */

            /* feature products Function Call for Home Page */
            LoadRelatedProductsForHome();

            /* feature products Function Call for kk-feature-products */
            LoadRelatedProductsForOtherPages();

            /* Filter Crieteria and Product load function call for Product Category Listing Page */
            LoadFiltersAndProductForCategoryPage();

            /* Loading Products other then Wine Categories */
            LoadOtherCategoryProducts()
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

jQuery(document).ready(function () {
    ecomLoginCheck();

    //Fix for KK
    $('#header').on('click', 'ul.nav > li > a', function (e) {
        window.open(e.target.href, '_self');
    });

    //var languageQuery = $("#hdnLocal").val();
    //if (languageQuery != null && languageQuery != "") {
    //    SetLocal(languageQuery);
    //}

    $('#login-modal-exit').click(function () {
        $('body').removeClass('modal-open');
        clearLoginDetails();
    });
    $(document).on('click', '#show-password', function () {
        if ($(this).is('[checked]')) {
            $('#password-login').replaceWith($('#password-login').clone().attr('type', 'text'));
        } else {
            $('#password-login').replaceWith($('#password-login').clone().attr('type', 'password'));
        }
    });
});