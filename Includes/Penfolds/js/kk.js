//---------------------------------------------------- Custom Functions for Penfolds -----------------------------------------

//var BASE_URL='http://dev.penfolds.com/konakart/';
//var BASE_URL='http://preprod5.penfolds.com/konakart/';

var BASE_URL='';
var PRODUCT_PRICE_OPTIONS = null;
var MODAL_ID="#quick-buy-modal";

// populates add to basket modal option selectors for mobile view
$(function() {
	$('#modal-quantity-select').change(function(){
		var elem = $(this);
		var qty = elem.val();
		updateSelectedQuantity(qty);
	});
	
	$('#modal-option-select').change(function(){
		var elem = $(this);
		var opt = elem.val();
		showPrice(opt);
	});
});

//Load the shopping cart details when the page is available 
$( document ).ready(function() {
	var kk_BASE_URL =$("#hdnTWEeCommerceURL").val();
	if(kk_BASE_URL){
		BASE_URL=kk_BASE_URL;
	}
	 $(document).on('click', '#show-password', function () {
	        if ($(this).is('[checked]')) {
	            $('#password-login').replaceWith($('#password-login').clone().attr('type', 'text'));
	        } else {
	            $('#password-login').replaceWith($('#password-login').clone().attr('type', 'password'));
	        }
	    });
});

function doLoadProductPrices(productID) {
    $.ajax({
        type: "GET",
        url: getURL("GetJsonProduct.action", new Array("prodId",productID)),
        jsonpCallback: 'jsonpCallback',
        dataType : 'jsonp',
        xhrFields: {withCredentials: true},

        success: function (result) {
            fillForm(result, "#");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });

}

function addToBasket() {
    $(MODAL_ID).modal('hide')
    var d = new Date();
    document.getElementById('random').value=d.getMilliseconds();
    var prodId = $(MODAL_ID + ' #productId').val();
    var valueId = $(MODAL_ID + ' #optionValueId').val();
    var quantity = $(MODAL_ID + ' #prodQuantity').val();
    var optionId = $(MODAL_ID + ' #prodOptionId').val();
    window.scrollTo(0, 0);
    addProductToBasket(prodId, optionId, valueId, quantity);
}



function addToBasketFromProdDetailsPage() {
    var d = new Date();
    document.getElementById('random').value=d.getMilliseconds();
    var prodId = $('#prodId').val();//retrieve this value;
    var valueId = $('#selectedCaseSize').val(); //retrieve this value;
    var quantity = $('#prodQuantityId').val();//retrieve this value;
    var optionId =  $('#selectedOptionId').val();//retrieve this value;
    window.scrollTo(0, 0);
    addProductToBasket(prodId, optionId, valueId, quantity);
}

function addProductToBasket(prodId, optionId, valueId, quantity) {

    // Ajax call
    $.ajax({
        type: "GET",
        url: getURL("AddProductWithOptionsToCart.action", new Array("productId",prodId,"optionId",optionId,"optionValueId",valueId,"quantity",quantity)),
        jsonpCallback: 'jsonpCallback',
        dataType : 'jsonp',
        xhrFields: {withCredentials: true},

        success: function (result) {
            displayBasket(result);
            window.setTimeout("hideCart('#minicart-container')", 2000);
        },
        error: function (xhr, ajaxOptions, thrownError) {

            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

function populateBasket() {
    // Ajax call
    $.ajax({
        type: "GET",
        url: getURL("ShowCartItemJSONAction.action"),
        jsonpCallback: 'jsonpCallback',
        dataType : 'jsonp',
        xhrFields: {withCredentials: true},
        success: function (result) {
            fillBasketInfo(result);
        },
        error: function (xhr, ajaxOptions, thrownError) {            

            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}


function getBasketAndDisplayInfo() {

    // Ajax call
    $.ajax({
        type: "GET",
        url: getURL("ShowCartItemJSONAction.action"),
        jsonpCallback: 'jsonpCallback',
        dataType : 'jsonp',
        xhrFields: {withCredentials: true},
        success: function (result) {
            displayBasket(result);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

function fillForm(json, learnMoreUrl) {
    var caseOptions = new Array();
    var bottleOption = '';
    updateSelectedQuantity('1');
    $('#productId').val(json.simpleProduct.productId);
    $('#product-title').text(json.simpleProduct.productName);
    $('#optional-price').hide();

    var priceOptions = json.simpleProduct.options;

    // Save prices in the memory.
    PRODUCT_PRICE_OPTIONS = priceOptions;

    var mTypesHtml = '';
    
    var oTypesHtml = '';
    
    for (var i in PRODUCT_PRICE_OPTIONS) {
        mTypesHtml += "<li><a href='#' onclick='showPrice("+i+")'>"+PRODUCT_PRICE_OPTIONS[i].name+"</a></li>"
        if(i == 0) {
        	oTypesHtml += "<option value='"+i+"' class='selected' style='line-height: 25px;'>"+PRODUCT_PRICE_OPTIONS[i].name+"</option>"
        } else {
        	oTypesHtml += "<option value='"+i+"'>"+PRODUCT_PRICE_OPTIONS[i].name+"</option>"
        }
    }

    // Update the list of model types
    $('#model-type-list').html(mTypesHtml);

    
  
    $('#modal-option-select').html(oTypesHtml);
    
    
    var defaultProductOption = PRODUCT_PRICE_OPTIONS[0]; // The first element in the array always exists

    // Set the first product option as the default
    $('#default-price').text(defaultProductOption.price+" / "+defaultProductOption.name);

    // Update the product selecting button
    var prodSelectorHtml = defaultProductOption.name+"<span class='caret'></span>"
    $('#prod-selector').html(prodSelectorHtml);


    // Set default option ID
    $('#prodOptionId').val(defaultProductOption.id);

    // Set default option value ID
    $('#optionValueId').val(defaultProductOption.optionValueId);

    // Set default quantity
    $('#prodQuantity').val(1);
	
    // Set the Discover More link
	$('#discoverMore').html("<a  id='discoverMoreLink' href="../../../Penfolds Wines - Home_files/+ getURL("SelectProd.action", new Array("prodId",json.simpleProduct.productId)) +" class='learnMore'>Discover More</a>");	

}

function showPrice(optionIndex) {
    var option = null;
    if(PRODUCT_PRICE_OPTIONS != null && optionIndex < PRODUCT_PRICE_OPTIONS.length) {
        option = PRODUCT_PRICE_OPTIONS[optionIndex];

        // Update the fault button
        var prodSelectorHtml = option.name+"<span class='caret'></span>"
        $('#prod-selector').html(prodSelectorHtml);

        if (optionIndex > 0) {
            $('#optional-price').text(option.price+" / "+option.name);
            $('#optional-price').show();
        } else {
            $('#optional-price').hide();
        }
        // Set the option ID
        $('#prodOptionId').val(option.id);

        // Set option value ID
        $('#optionValueId').val(option.optionValueId);
    }
}

function updateSelectedQuantity(quantity) {
    var htmlStr=" "+quantity+" <span class='caret'>";
    $('#selected-quantity').html(htmlStr);
    //for IE8
    document.getElementById('selected-quantity').innerHTML=htmlStr;
    //end
    // Set quantity
    $('#prodQuantity').val(quantity);

}

var fillBasketInfo = function(basketJSON) {
    /*
     * Go to product details page to choose options
     */
    if (basketJSON.redirectURL != null) {
        if (basketJSON.redirectURL == "Login") {
            goToLoginPage();
        } else {
            goToProdDetailsPage(basketJSON.redirectURL);
        }
        return;
    }
    //update the logged in user
    if (basketJSON) {
        var konakartId = basketJSON.consumerId;
        var konakartFname = basketJSON.consumerFirstName;
        var konakartLname = basketJSON.consumerLastName;

        // Consumers who are not logged into konakart will have a negative konakartId
        if (konakartId == "null" || konakartId == null || konakartId.indexOf("-") > -1) {
//            if(removeEcommCookie){
//                removeEcommCookie();
//            }
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
            $('#MobileLogInRegister').removeClass('hidden-xs');
            $('#MobileLogInRegister').removeClass('inline');
            $('#MobileLogInRegister').css({ 'display': 'none' });
            $('#mobile-account-container').show();
            $('#mobile-account-container').removeClass('hide');
            $('#mobile-account-container').show();
            
            if (basketJSON.guestLoggedIn) {
                $('#account-dropdown .profile-settings').css({ 'display': 'none ' });
                $('#account-dropdown .order-status').css({ 'display': 'none ' });
                $('#account-dropdown .shipping-address').css({ 'display': 'none ' });
                $('#account-dropdown .change-password').css({ 'display': 'none ' });
            }


        }
    }

    // Hide the empty basket text
    $('#empty-basket-text').hide();

    var txt;
    /*
     * Update cart slide-out with new basket items
     */
    if (basketJSON.items != null && basketJSON.items.length > 0) {
        var quantity = 0;
        txt = '<div id="shopping-cart-items"  class="scroll">';

        for ( var i = 0; i < basketJSON.items.length; i++) {

            var item = basketJSON.items[i];

            txt += '<div class="product row">';
            txt += '<div class="shopping-cart-item" >';
            txt += '<a class="col-xs-5" href="../../../Penfolds Wines - Home_files/'+ getURL("SelectProd.action", new Array("prodId",item.prodId)) +'"><img src="../../../Penfolds Wines - Home_files/'+item.prodImgSrc+'" border="0" alt="'+item.prodName+'" title="'+item.prodName+'"></a>';
            txt += '<a href="../../../Penfolds Wines - Home_files/'+ getURL("SelectProd.action", new Array("prodId",item.prodId)) +'" class="shopping-cart-item-title">'+item.prodName+'</a>';
            txt += '<div class="col-xs-7">';
            txt += getProductOptionHtmlText(item.opts);
            txt += '<div class="shopping-cart-item-price">';
            txt += '<em>'+basketJSON.quantityMsg +'</em>: '+item.quantity;
            txt += '<div class="penfolds-red">';
            txt += ' '+basketJSON.priceMsg +': ' +item.formattedPrice;
            txt += '</div>';
            txt += '</div>';
            txt += '</div>';
            txt += '</div>';
            txt += '</div>';

            quantity += parseInt(item.quantity);
        }
        txt += '</div>';
        txt += '<div id="subtotal-and-checkout">';
        txt += '<div class="row total subtotal">';
        txt += '<div class="col-xs-6">'+basketJSON.subtotalMsg+'</div>';
        txt += '<div class="col-xs-6 align-right">'+basketJSON.basketTotal+'</div>';
        txt += '</div>';
        txt += '<div class="row">';
        txt += '<div>';
        txt += '<div id="shopping-cart-review-button" class="btn btn-primary col-xs-12">'+ basketJSON.checkoutMsg +'</div>';
        txt += '</div>';
        txt += '</div>';
        txt += '</div>';
        txt += '</div>';

        // Update basket details
        $('#basket-title').show();
        $('#number-of-items').text(quantity);
        $('#basket-size').text(quantity);

        /*
         * Set event code on review button
         */
        $("#shopping-cart-review-button").click(goToCartPage);
    } else {
        // Hide the empty basket text
        $('#empty-basket-text').show();
    }
    $("#shopping-cart-contents").html(txt);

}

/*
 * Used to view added to cart details in a popup
 */
var displayBasket = function(basketJSON) {

    fillBasketInfo(basketJSON);
    /*
     * Display cart to show that something has been added
     */
    showCart("#minicart-container");
}

var getProductOptionHtmlText = function (options, model) {
    var txt = "";
    if (options != null && options.length > 0) {
        for (var i in options) {
            var opt = options[i];
            if (opt != null && opt != 'undefined') {
                txt += "<span class='shopping-cart-item-option'><em>"+opt.value+"</em></span>";
            }
        }

    }
    return txt;
}


//---------------------------------------------------- Original Code -----------------------------------------
/*
 * Sends an AJAX request to a struts action
 */
function callAction(parmArray, callback, url) {

    if (document.getElementById('kk_portlet_id')) {
        AUI().ready('liferay-portlet-url', function(A) {
            var renderURL = Liferay.PortletURL.createResourceURL();
            renderURL.setParameter("struts.portlet.action", "/" + url);
            renderURL.setPortletId(document.getElementById('kk_portlet_id').value);
            renderURL.setWindowState("exclusive");
            if (parmArray) {
                for ( var i = 0; i < parmArray.length; i=i+2) {
                    renderURL.setParameter(parmArray[i], parmArray[i+1]);
                }
                renderURL.setParameter("xsrf_token", document.getElementById('kk_xsrf_token').value);
            }
            url = renderURL.toString();

            $.ajax({
                type : 'POST',
                timeout : '20000',
                scriptCharset : "utf-8",
                contentType : "application/json; charset=utf-8",
                url : url,
                data : null,
                success : callback,
                error : function(jqXHR, textStatus, errorThrown) {
                    var errorMsg = "JSON API call to the URL " + url
                        + " wasn't successful.";
                    if (textStatus != null && textStatus != '') {
                        errorMsg += "\nStatus:\t" + textStatus;
                    }
                    if (errorThrown != null && errorThrown != '') {
                        errorMsg += "\nError:\t" + errorThrown;
                    }
                    alert(errorMsg);
                },
                dataType : 'json'
            });
        });
    } else {
        var parms='{"":""}';
        if (parmArray) {
            parms = '{';
            for ( var i = 0; i < parmArray.length; i=i+2) {
                parms = parms + '"' + parmArray[i]+'":"'+ parmArray[i+1]+ '"';
                if (i+2 < parmArray.length) {
                    parms = parms + ',';
                }
            }
            parms = parms + ',"xsrf_token":"'+ document.getElementById('kk_xsrf_token').value + '"';
            parms = parms + '}';
        }

        $.ajax({
            type : 'POST',
            timeout : '60000',
            scriptCharset : "utf-8",
            contentType : "application/json; charset=utf-8",
            url : url,
            data : parms,
            success : callback,
            error : function(jqXHR, textStatus, errorThrown) {
                var errorMsg = "JSON API call to the URL " + url
                    + " wasn't successful.";
                if (textStatus != null && textStatus != '') {
                    errorMsg += "\nStatus:\t" + textStatus;
                }
                if (errorThrown != null && errorThrown != '') {
                    errorMsg += "\nError:\t" + errorThrown;
                }
                console.log(errorMsg);
            },
            dataType : 'json'
        });
    }
}


function callJSONPAction(parmArray, callback, url) {
    var parms='{"":""}';
    if (parmArray) {
        parms = '{';
        for ( var i = 0; i < parmArray.length; i=i+2) {
            parms = parms + '"' + parmArray[i]+'":"'+ parmArray[i+1]+ '"';
            if (i+2 < parmArray.length) {
                parms = parms + ',';
            }
        }
        parms = parms + ',"xsrf_token":"'+ document.getElementById('kk_xsrf_token').value + '"';
        parms = parms + '}';
    }
    $('#loading-image').show();
    $.ajax({
        type : 'POST',
        timeout : '60000',
        scriptCharset : "utf-8",
        contentType : "application/json; charset=utf-8",
        url : url,
        xhrFields: {withCredentials: true},
        data : parms,
        jsonpCallback: 'jsonpCallback',
        success : callback,
        dataType : 'jsonp',
        complete:function(){
        	 $('#loading-image').hide();
        },
        error : function(jqXHR, textStatus, errorThrown) {
            var errorMsg = "JSON API call to the URL " + url
                + " wasn't successful.";
            if (textStatus != null && textStatus != '') {
                errorMsg += "\nStatus:\t" + textStatus;
            }
            if (errorThrown != null && errorThrown != '') {
                errorMsg += "\nError:\t" + errorThrown;
            }
            console.log(errorMsg);
           // alert(errorMsg);
        }
    });

}

/*
 * Derives a portlet url
 */
function getURL(action, parmArray) {

    if (document.getElementById('kk_portlet_id')) {
        var id = document.getElementById('kk_portlet_id').value;
        var sampleURL = document.getElementById('kk_sample_url').value;

        var url = sampleURL.replace("KK_ACTION",action);
        if (parmArray) {
            for ( var i = 0; i < parmArray.length; i=i+2) {
                var name = parmArray[i];
                var val = parmArray[i+1];
                var add = '&_'+id+'_'+name+'='+val;
                url = url + add;
            }
        }
        return url;
    } else {
        var url = action;
        if (parmArray) {
            for ( var i = 0; i < parmArray.length; i=i+2) {
                var name = parmArray[i];
                var val = parmArray[i+1];
                var add="";
                if (i==0) {
                    add += '?';
                } else {
                    add += '&';
                }
                add = add + name+'='+val;
                url = url + add;
            }
        }
        return BASE_URL+url;
    }
}

var login = function(){

    var email = $('#emailAddr-login').val();
    var password = $('#password-login').val();
    callJSONPAction(new Array("emailAddr", email, "password", password), loginCallback,
        getURL("LoginSubmitLocal.action"));

}

var loginCallback = function(result, textStatus, jqXHR) {
    if(result.result){
        $('#login-modal-exit').click();
        if (location.href.indexOf('LogOut.action') == -1) {
            location.reload();
        }
    } else {
        $('#login-modal-error').css({display: "block"});
    }
}

var forgotPassword=function(){
	var val = $('#forgotPasswordSubmitForm').validate(validationRules).form();
	if (val) {
		var emailAddr = $('#forgot-password-email').val();
		callJSONPAction(new Array("emailAddr", emailAddr), ForgotPasswordCallback,
		        getURL("ForgotPasswordJsonp.action"));
	}
}
var ForgotPasswordCallback = function(result, textStatus, jqXHR) {
    	 if ( $('#forgotPasswordSubmitForm').valid()) {
    		 $('#forgotPasswordSubmitForm').addClass('hide');
             $('#login-modal .forgot-password .emailed').removeClass('hide');
         }
}
/*
 * Suggested search code used in Header.jsp. Figure out which search to do based
 * on value in key.
 */
function kkSearch() {

    // Get key and search string from page
    var key = document.getElementById('kk_key').value;
    var text = document.getElementById('search-input').value;

    if (key != null && key.length > 0) {
        var keyArray = key.split(',');
        if (keyArray.length == 3) {
            var manuId = keyArray[1];
            var catId = keyArray[2];
            if (catId > -1 && manuId > -1) {
                // Search category and manufacturer
                document.getElementById('manuId').value = manuId;
                document.getElementById('catId').value = catId;
                //document.getElementById('ssForm').action = getURL("SelectCat.action");
                document.getElementById('ssForm').action = getURL("QuickSearch.action");
                document.getElementById('ssForm').submit();
            } else if (catId > -1) {
                // Search cat
                document.getElementById('manuId').value = "-1";
                document.getElementById('catId').value = catId;
                //document.getElementById('ssForm').action = getURL("SelectCat.action");
                document.getElementById('ssForm').action = getURL("QuickSearch.action");
                document.getElementById('ssForm').submit();
            } else if (manuId > -1) {
                // Search manufacturer
                document.getElementById('manuId').value = manuId;
                //document.getElementById('ssForm').action = getURL("ShowSearchByManufacturerResultsByLink.action");
                document.getElementById('ssForm').action = getURL("QuickSearch.action");
                document.getElementById('ssForm').submit();
            } else {
                // Search based on text
                document.getElementById('searchText').value = text;
                document.getElementById('ssForm').action = getURL("QuickSearch.action");
                document.getElementById('ssForm').submit();
            }
        }
    } else if (text != null && text.length > 0) {
        /*
         * Reach here if someone has entered free text and clicked the search
         * button or the enter key. Rather than doing a search on the text we
         * see if there is a suggested search hit and then use the extra
         * information returned from the suggested search hit to provide better
         * results. i.e. It provides results for a category search whereas a
         * simple search wouldn't show any results.
         */
        callAction(new Array("term", text), suggestedSearchCallback,
				getURL("SuggestedSearchLocal.action"));
    }
}

/*
 * Callback for suggested search
 */
var suggestedSearchCallback = function(result, textStatus, jqXHR) {
    if (result != null && result.length > 0) {
        document.getElementById('kk_key').value = result[0].id;
        document.getElementById('search-input').value = result[0].value;
        kkSearch();
    } else {
        var text = document.getElementById('search-input').value;
        document.getElementById('searchText').value = text;
        document.getElementById('ssForm').action = getURL("QuickSearch.action", new Array("searchInDesc","true"));
        document.getElementById('ssForm').submit();
    }
};

/*
 * Reset key id since user has typed into search box
 */
function kkKeydown() {
    document.getElementById('kk_key').value = "";
}

/*
 * Used by address maintenance panels
 */
function changeCountry() {
    if (document.getElementById('state')) {
        document.getElementById('state').value="";
    }
    //document.getElementById('countryChange').value="1";
  //  document.getElementById('editCustomerform').submit();
}

$(function() {

    $("#minicart-container").click(goToCartPage);
    $("#wish-list").click(goToWishListPage);

    $(".item-over").click(function() {
        var prodId = (this.id).split('-')[1];
        goToProdDetailsPage(prodId);
    });

    /*
     * Hover effects for Add To Cart button
     */
    $(".item").not(".style-small").hover(
        function() {
            $(this).addClass("item-over-container");
            $(this).find(".item-over").show();
        }, function() {
            $(this).removeClass("item-over-container");
            $(this).find(".item-over").hide();
        });


    /*
     * Hover effects for Sliding Cart
     */
    var cartHover=0;
    $("#minicart-container").hover(
        function() {
            // in
            getBasketAndDisplayInfo();
            cartHover=1;
            showCart("#minicart-container");
        }, function() {
            // out
            setTimeout(function(){
                if (cartHover!=2) {
                    cartHover=0;
                    hideCart("#minicart-container");
                }
            }, 500);
        });
    $("#minicart").hover(
        function() {
            // in
            cartHover=2;
            showCart("#minicart-container");
        }, function() {
            // out
            cartHover=0;
            hideCart("#minicart-container");
        });
    $("#shopping-cart-container").hover(
        function() {
            // in
            cartHover=2;
            showCart("#minicart-container");
        }, function() {
            // out
            cartHover=0;
            hideCart("#minicart-container");
        });

    /*
     * Initialise wish list position and visibility
     */
    setWishListPosition();

    /*
     * Hover effects for Sliding Wish list
     */
    var wlHover=0;
    $("#wish-list").hover(
        function() {
            // in
            wlHover=1;
            showWishList("#wish-list");
        }, function() {
            // out
            setTimeout(function(){
                if (wlHover!=2) {
                    wlHover=0;
                    hideWishList("#wish-list");
                }
            }, 500);
        });
    $("#wish-list-container").hover(
        function() {
            // in
            wlHover=2;
            showWishList("#wish-list");
        }, function() {
            // out
            wlHover=0;
            hideWishList("#wish-list");
        });
    /*
     * Add to Cart
     */
    $(".add-to-cart-button")
        .click(
        function() {
            var prodId = (this.id).split('-')[1];
            callJSONPAction(new Array("prodId",prodId),
                addToCartCallback,
                getURL("AddToCartFromProdId.action"));
            return false;
        });

    /*
     * Add to Wish List
     */
    $(".add-to-wishlist")
        .click(
        function() {
            var prodId = (this.id).split('-')[1];
            callAction(new Array("prodId",prodId),
                addToWishListCallback,
                getURL("AddToWishListFromProdId.action"));
            return false;
        });

    /*
     * Subscribe to newslette
     */
    $("#newsletter-button").click(submitNewsletterForm);

    /*
     * Basket checkout button on fade in / out basket widget
     */
//	$("#shopping-cart-checkout-button").click(goToCheckoutPage);

    /*
     * Tooltips
     */
    $(".has-tooltip").tooltip();

    /*
     * Agree to use of cookies
     */
    $("#cookie-warn-button")
        .click(
        function() {
            callAction(null,
                agreeToCookiesCallback,
                getURL("AgreeToCookies.action"));
            return false;
        });

});

/*
 * Submits the sign up to newsletter form
 */
function submitNewsletterForm() {
    var email = $("#newsletter-input").val();
    callAction(new Array("emailAddr", email),
        subscribeNewsletterCallback,
        getURL("SubscribeNewsletter.action"));
    return false;
}

/*
 * Set the position of the wish list slide down control
 */
function setWishListPosition() {
    if ($("#wish-list").length) {
        $("#wish-list-container").hide();
        var shadowWidth  =  $("#wish-list-mouseover-shadow").width();
        var space = $("#minicart-container").position().left - $("#wish-list").position().left-$("#wish-list").width();
        var cartWidth = $("#minicart-container").width();
        $("#wish-list-mouseover-shadow").css("right", cartWidth+space/2-shadowWidth);
        $("#wish-list-contents").css("right", cartWidth+space/2);
    }
}

/*
 * Redirect functions
 */
function goToCartPage() {
    return redirect(getURL("ShowCartItems.action"));
}

function goToCheckoutPage() {
    return redirect(getURL("Checkout.action"));
}

function goToLoginPage() {
    return redirect(getURL("LogIn.action"));
}

function goToWishListPage() {
    return redirect(getURL("ShowWishListItems.action"));
}

function goToProdDetailsPage(prodId){
    return redirect(getURL("SelectProd.action", new Array("prodId",prodId)));
}


function redirect(action) {
    window.location = action;
    return true;
}


/*
 * Code to display the slide out cart
 */
function showCart(cart) {
    $(cart).addClass("small-rounded-corners-top shopping-cart-mouseover");
    $("#minicart").css("display","inline");
}

/*
 * Code to hide the slide out cart
 */
function hideCart(cart) {
    $("#minicart").hide();
    $(cart).removeClass("shopping-cart-mouseover small-rounded-corners-top");
}

/*
 * Code to display the slide out wish list
 */
function showWishList(wishList) {
    $(wishList).addClass("small-rounded-corners-top shopping-cart-mouseover");
    $("#wish-list-container").css("display","inline");
}

/*
 * Code to hide the slide out wish list
 */
function hideWishList(wishList) {
    $("#wish-list-container").hide();
    $(wishList).removeClass("small-rounded-corners-top shopping-cart-mouseover");
}

/*
 * Calculate the product image base
 */
function getProdImageBase(prod, base) {
    return base + prod.imageDir + prod.uuid;
}

/*
 * Calculate the product image extension
 */
function getProdImageExtension(prod) {
    if (prod.image) {
        var ret = prod.image.split('.');
        if (ret.length<2) {
            return "";
        }
        return '.' + ret.pop();
    }
    return "";
}

/*
 * Common code called from addtoCart and addToWishlist callbacks
 */
function getProdOptionText(opts, isWishList) {
    var txt = "";
    if (opts != null && opts.length > 0) {
        for ( var j = 0; j < opts.length; j++) {
            var opt = opts[j];

            if (opt.type == 0) { // Simple options
                txt += '<br><span class="shopping-cart-item-option"> - '+opt.name+': '+opt.value+'</span>';
            } else if (opt.type == 1 && !isWishList) { // Variable quantity
                txt += '<br><span class="shopping-cart-item-option"> - '+opt.name+': '+opt.quantity+' '+opt.value+'</span>';
            } else if (opt.type == 2 && !isWishList) { // Customer price
                txt += '<br><span class="shopping-cart-item-option"> - '+opt.name+': '+opt.formattedCustPrice+'</span>';
            } else if (opt.type == 3 && !isWishList) { // Customer text
                txt += '<br><span class="shopping-cart-item-option"> - '+opt.name+': '+opt.customerText+'</span>';
            }
        }
    }
    return txt;
}

/*
 * Used to view added to cart details in a popup
 */

var addToCartCallback = function(result, textStatus, jqXHR) {

    /*
     * Go to product details page to choose options
     */
    if (result.redirectURL != null) {
        if (result.redirectURL == "Login") {
            goToLoginPage();
        } else {
            goToProdDetailsPage(result.redirectURL);
        }
        return;
    }

    var txt;
    /*
     * Update cart slide-out with new basket items
     */
    if (result.items != null && result.items.length > 0) {
        txt = '<div id="shopping-cart-items">';
        for ( var i = 0; i < result.items.length; i++) {
            var item = result.items[i];
            txt += '<div class="shopping-cart-item">';
            txt += '<a href="../../../Penfolds Wines - Home_files/'+ getURL("SelectProd.action", new Array("prodId",item.prodId)) +'"><img src="../../../Penfolds Wines - Home_files/'+item.prodImgSrc+'" border="0" alt="'+item.prodName+'" title="'+item.prodName+'"></a>';
            txt += '<a href="../../../Penfolds Wines - Home_files/'+ getURL("SelectProd.action", new Array("prodId",item.prodId)) +'" class="shopping-cart-item-title">'+item.prodName+'</a>';
            txt += getProdOptionText(item.opts, /*isWishList*/false);
            txt += '<div class="shopping-cart-item-price">';
            txt += item.formattedPrice;
            txt += ' '+result.quantityMsg+': '+item.quantity;
            txt += '</div>';
            txt += '</div>';
        }
        txt += '</div>';
        txt += '<div id="subtotal-and-checkout">';
        txt += '<div class="subtotal">';
        txt += '<div class="subtotal-label">'+result.subtotalMsg+'</div>';
        txt += '<div class="subtotal-amount">'+result.basketTotal+'</div>';
        txt += '<div id="shopping-cart-checkout-button" class="button small-rounded-corners">'+result.checkoutMsg+'</div>';
        txt += '</div>';
        txt += '</div>';
    } else {
        txt = result.emptyCartMsg;
    }
    $("#shopping-cart-contents").html(txt);

    /*
     * Set event code on checkout button
     */
    $("#shopping-cart-checkout-button").click(goToCheckoutPage);

    /*
     * Update cart summary with new basket data
     */
    txt = result.shoppingCartMsg;
    if (result.numberOfItems > 0) {
        txt += " ("+result.numberOfItems+")";
    }
    $("#shopping-cart").html(txt);

    /*
     * Reset the position of the wish list slide out control since
     * the cart summary length may have changed
     */
    setWishListPosition();

    /*
     * Display cart to show that something has been added
     */
    showCart("#shopping-cart");
    window.setTimeout("hideCart('#shopping-cart')", 2000);
};

/*
 * Used to update the wish list
 */
var addToWishListCallback = function(result, textStatus, jqXHR) {

    /*
     * Go to product details page to choose options
     */
    if (result.redirectURL != null) {
        if (result.redirectURL == "Login") {
            goToLoginPage();
        } else {
            goToProdDetailsPage(result.redirectURL);
        }
        return;
    }

    /*
     * Update wish list slide-out with new wlItems
     */
    if (result.wlItems != null && result.wlItems.length > 0) {
        txt = '<div id="wish-list-items">';
        for ( var i = 0; i < result.wlItems.length; i++) {
            var item = result.wlItems[i];
            txt += '<div class="shopping-cart-item">';
            txt += '<a href="../../../Penfolds Wines - Home_files/'+ getURL("SelectProd.action", new Array("prodId",item.prodId)) +'"><img src="../../../Penfolds Wines - Home_files/'+item.prodImgSrc+'" border="0" alt="'+item.prodName+'" title="'+item.prodName+'"></a>';
            txt += '<a href="../../../Penfolds Wines - Home_files/'+ getURL("SelectProd.action", new Array("prodId",item.prodId)) +'" class="shopping-cart-item-title">'+item.prodName+'</a>';
            txt += getProdOptionText(item.opts, /*isWishList*/true);
            txt += '<div class="shopping-cart-item-price">';
            txt += item.formattedPrice;
            txt += '</div>';
            txt += '</div>';
        }
        txt += '</div>';
        txt += '<div id="wish-list-subtotal">';
        txt += '<div class="subtotal">';
        txt += '<div class="subtotal-label">'+result.subtotalMsg+'</div>';
        txt += '<div class="subtotal-amount">'+result.wishListTotal+'</div>';
        txt += '</div>';
        txt += '</div>';
    } else {
        txt = result.emptyWishListMsg;
    }
    $("#wish-list-contents").html(txt);

    /*
     * Update wish liat summary with new number of wlItems
     */
    var txt = result.wishListMsg;
    if (result.numberOfItems > 0) {
        txt += " ("+result.numberOfItems+")";
    }
    $("#wish-list").html(txt);

    /*
     * Display wish liat to show that something has been added
     */
    showWishList("#wish-list");
    window.setTimeout("hideWishList('#wish-list')", 2000);

};

/*
 * Newsletter subscription callback
 */
var subscribeNewsletterCallback = function(result, textStatus, jqXHR) {

    if (result.msg != null) {
        $("#newsletter-msg").html(result.msg);

        if (result.error==true) {
            $("#newsletter-msg").removeClass("messageStackSuccess");
            $("#newsletter-msg").addClass("messageStackError");
        } else {
            $("#newsletter-msg").removeClass("messageStackError");
            $("#newsletter-msg").addClass("messageStackSuccess");
        }
    }
};

/*
 * Callback for agree to cookies
 */
var agreeToCookiesCallback = function(result, textStatus, jqXHR) {
    $("#cookie-container").slideUp();
};
