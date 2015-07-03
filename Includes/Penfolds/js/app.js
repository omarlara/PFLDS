/// <reference path="header.js" />
var App = {
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

        if ($windowWidth >= App.breakpoints.desktop) {
            App.isDesktop = true;
        } else if ($windowWidth >= App.breakpoints.tablet && $windowWidth < App.breakpoints.desktop) {
            App.isTablet = true;
        } else {
            App.isMobile = true;
        }

        self.common();
        self.about_cellar_reserve();
        self.account_shipping();
        self.age_verification();
        self.basket();
        self.cellar_door_details();
        self.cellar_reserve_details();
        self.change_password();
        self.checkout();
        self.contact_us();
        self.experience_penfolds();
        self.home();
        self.myacc();
        self.other_product_details();
        self.our_stockists();
        self.penfolds_club();
        self.product_details();
        //self.product_listing_filter();
        self.restaurant_details();
        self.vineyard_details();
        self.vineyards();
        self.shareTools();
        self.timeline();
    },

    shareTools: function () {
        /* For Facebook */
        $(".share-dd-container .popover-content .share-content .facebook").on("click", function (e) {
            AWESM.share.facebook_share({
                title: document.title
            })
        });

        /* for twitter */

        $(".share-dd-container .popover-content .share-content .twitter").on("click", function (e) {
            var ctl = $(this);

            AWESM.share.twitter({
                text: ctl.data("twitter-text"),
                via: ctl.data("twitter-via"),
                hashtags: ctl.data("twitter-hashtags"),
                related: ctl.data("twitter-related")
            });
        });

        /* for LinkedIn */

        $(".share-dd-container .popover-content .share-content .linkedin").on("click", function (e) {
            AWESM.share.linkedin();
        });

        /* for Email */
        $('#email-friend-modal').on('shown.bs.modal', function () {
            $("#email-friend-modal .email").show();
            $('#email-friend-modal .sent').addClass('hide');
            $("#email-friend-modal .email .submit-section .btn-submit-form").removeAttr('disabled');
            $("#email-friend-modal .email .modal-body #your-name").focus();
        })

        $('#email-friend-modal').on('hidden.bs.modal', function () {
            $('#form1').trigger("reset");
            $('#email-friend-modal .email .errors').empty();
        })

        $(".email .submit-section .btn-submit-form").on("click", function (e) {
            e.preventDefault();
            var $this = $(this);

            var data = data || {
                'senderName': $(".email #your-name").val(),
                'senderEmail': $(".email #your-email").val(),
                'receiverName': $(".email #friend-name").val(),
                'receiverEmail': $(".email #friend-email").val(),
                'bodyText': $(".email #message").val(),
                'url': window.location.href.toString(),
                'currentItemId': $this.data("sitecoreitemid")
            }

            $('#email-friend-modal .form-wrapper').wrap('<form id="temp_form_id" />');
            $('#temp_form_id').each(function () {
                $(this).validate({
                    ignore: ".ignore,:hidden",
                    errorLabelContainer: $(this).find(".errors")
                });
            });
            var isValid = $('#temp_form_id').valid();
            $('#email-friend-modal .form-wrapper').unwrap();
            if (isValid) {
                $this.attr('disabled', 'disabled');
                ShareMailSend(data);
            }

            return false;
        });

        function ShareMailSend(data) {
            if (data) {
                var url = location.protocol + "//" + location.host;

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: data,
                    url: url + '/api/ShareEmail/MailSend',  // This URL is currently not set up/working??
                    success: function (data) {
                        if (data) {
                            $('#email-friend-modal .email').hide();
                            $('#email-friend-modal .sent').removeClass('hide');
                            setTimeout(function () {
                                $('#email-friend-modal').modal('hide');
                            }, 3000);
                        } else {
                            var errorMsgText = $("#email-friend-modal .sent .modal-body").data("error-message");
                            $("#email-friend-modal .errors").html("<label class='error'>" + errorMsgText + "</label>").show();
                            $("#email-friend-modal .email .submit-section .btn-submit-form").removeAttr('disabled');
                        }
                    },
                    beforeSend: function (xhr) { },
                    error: function (xhr) { },
                    complete: function () { }
                });
            }
        }
    },

    common: function () {
        $(document).on('click', 'a.share', function () {
            $('.share-dd-container').slideToggle();
        });
        $("#wine").on("change", function () {
            window.location = $(this).val();
        });
        $(".col-xs-12.col-md-4").matchHeight(true);

        var $login_modal = $('#login-modal');

        $login_modal.on('click', '.forgot-password .btn-submit-form', function (e) {
            e.preventDefault();
            var $email = $login_modal.find('.forgot-password #forgot-password-email');

            if ($.trim($email.val()).length == 0) {
                // Fail
                error = '<label for="forgot-password-email" class="error">' + $login_modal.find('#emailAddr-login').attr('data-error-msg') + '</label>';
                $email.after(error).addClass('error');
                return false;
            }

            if ($email.hasClass('error')) {
                //Fail
                return false;
            } else {
                //Success
                var url = $("#hdnTWEeCommerceURL").val();
                var email = $("#forgot-password-email").val();

                var newForm = $('<form id="temp_new_form" style="display:none" action="../../../Penfolds Wines - Home_files/' + url + 'ForgotPasswordSubmit.action' + '" method="POST"><input type="hidden" name="emailAddr" value="' + email + '"/></form>');
                $('body').append(newForm);

                //Show the messageing
                $login_modal.find('.form-inline').addClass('hide');
                $login_modal.find('.emailed').removeClass('hide');

                //Delay and refresh the page so that the messaging can be seen
                setTimeout(function () {
                    $('#temp_new_form').submit();
                }, 1000)
            }
        });
    },
    about_cellar_reserve: function () {
        if ($('#about-cellar-reserve .sidebar .vineyards .map').length > 0) {
            var bounds = new google.maps.LatLngBounds();

            var map = null, selectedVineyard = null,
                     infowindow = new InfoBox({
                         maxWidth: 0,
                         boxStyle: {
                             background: '#fff',
                             opacity: 1,
                             width: "170px"
                         },
                         pixelOffset: new google.maps.Size(-85, -45),
                         closeBoxURL: "",
                         enableEventPropagation: true,
                         infoBoxClearance: new google.maps.Size(1, 1),
                         alignBottom: true
                     });

            // Create map
            google.maps.event.addDomListener(window, 'load', function () {
                map = new google.maps.Map($('#about-cellar-reserve .sidebar .vineyards .map')[0], {
                    zoom: 6,
                    scrollwheel: false,
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE
                    },
                    styles: [
                        {
                            "stylers": [
                                { "saturation": -100 }
                            ]
                        },
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [
                                { visibility: "off" }
                            ]
                        }
                    ]
                });

                // Add all vineyards to map
                $.each(vineyards, function (index, vineyard) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(vineyard.Lat, vineyard.Lon),
                        map: map,
                        title: vineyard.name,
                        icon: '/includes/penfolds/images/maps-marker.png'
                    });
                    bounds.extend(marker.position);

                    var description = '<a href="#" class="close">×</a><div class="dialog"><h5>' + vineyard.Name + '</h5><div class="content"><p>' + vineyard.Address + '</p>' + (vineyard.Description ? '<p>' + vineyard.Description + '</p>' : '') + '</div></div>';
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.setContent(description);
                        infowindow.open(map, marker);
                    });
                });

                // Select first one in list to center on
                selectVineyard(vineyards[0]);
            });

            $(window).resize(centerMap);

            var centerMap = function () {
                if (map && selectedVineyard) {
                    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
                        var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.3, bounds.getNorthEast().lng() + 0.3);
                        var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.3, bounds.getNorthEast().lng() - 0.3);
                        bounds.extend(extendPoint1);
                        bounds.extend(extendPoint2);
                    }
                    map.fitBounds(bounds);
                    //map.setCenter(new google.maps.LatLng(selectedVineyard.Lat, selectedVineyard.Lon));
                }
            }

            var selectVineyard = function (vineyard) {
                selectedVineyard = vineyard;
                centerMap();
            }
        }
    },
    account_shipping: function () {
        if (!$('#account-shipping').length) return;

        $('#account-shipping #add-new form').submit(function (e) {
            var $this = $(this);
            e.preventDefault();
            if ($this.valid()) {
                $('#account-shipping #address-verification-modal').on('hidden.bs.modal', function () {
                    // Create new address entry
                    var entry = $('#account-shipping #addresses .list .template').clone().removeClass('template');
                    var addressId = 'address' + ($('#account-shipping #addresses .list > div').length - 1);
                    entry.find('[name="default-address"]').attr('id', addressId);
                    var defaultAddress = $this.find('#default-address').attr('checked');
                    entry.find('label').attr('for', addressId).html(formatAddress($this.serializeObject()));

                    // Close form
                    $this.find('.cancel').click();

                    // Add to display list, animate it in
                    entry.appendTo('#account-shipping #addresses .list').collapse('show');
                    if (defaultAddress) {
                        entry.find('[type="radio"]').trigger('click');
                    }
                }).modal('show');
            }
        });

        $('#account-shipping #edit form').submit(function (e) {
            var $this = $(this);
            e.preventDefault();
            if ($this.valid()) {
                $('#account-shipping #address-verification-modal').on('hidden.bs.modal', function () {
                    // Create new address entry
                    /*var entry = $('#account-shipping #addresses .list .template').clone().removeClass('template').removeClass('collapse');
                    var addressId = 'address' + ($('#account-shipping #addresses .list > div').length - 1);
                    entry.find('[name="default-address"]').attr('id', addressId);
                    var defaultAddress = $this.find('#default-address').attr('checked');
                    entry.find('label').attr('for', addressId).html(formatAddress($this.serializeObject()));
                    */
                    // Close form
                    $this.find('.cancel').click();

                    // Add to display list, animate it in
                    /*$('#account-shipping #addresses .list > div:first-child').replaceWith(entry);
                    if (defaultAddress) {
                        entry.find('[type="radio"]').trigger('click');
                    }*/
                }).modal('show');
            }
        });

        $('#account-shipping #add-new form .cancel, #account-shipping #edit form .cancel').click(function () {
            $(this).parents('form').trigger("reset").validate().resetForm();
        });

        $('#account-shipping a[data-toggle="tab"][data-target="#edit"]').on('show.bs.tab', function (e) {
            var $form = $('#account-shipping #edit form');

            // TODO: remove this and replace with real info
            $form.find('#firstNameInput').val('');
            $form.find('#lastNameInput').val('');
            $form.find('#addressInput').val('');
            $form.find('#cityInput').val('');
            $form.find('#stateSelect').val('');
            $form.find('#postCodeInput').val('');
            $form.find('#countrySelect').val('');
            $form.find('#emailInput').val('');
            $form.find('#phoneInput').val('');
        });

        function formatAddress(data) {
            if (!data) {
                return '';
            }

            return data.firstname + ' ' + (data.initial.length != 0 ? data.initial + ' ' : '') + data.lastname + '<br/>'
                + data.address + '<br/>'
                + (data.address2.length != 0 ? data.address2 + '<br/>' : '')
                + data.city + ', ' + data.state + ' ' + data.postcode + '<br/>'
                + data.country + '<br/>'
                + data.email
                + (data.phone.length != 0 ? '<br/>' + data.phone : '')
        }
    },
    age_verification: function () {
        if (!$('#age-verification').length) return;

        $(function () {
            $('.checkbox').click(function (e) {
                e.preventDefault();
                var $this = $(this), $checkbox = $this.siblings('[type="checkbox"]');
                $checkbox.attr('checked', !$checkbox.attr('checked'));
                if ($checkbox.attr('checked')) {
                    $("#age-verification .enter-section .btn").removeClass('disabled');
                } else {
                    $("#age-verification .enter-section .btn").addClass('disabled');
                }
            });

            $(".dropdown-menu a").click(function (e) {
                e.preventDefault();
                var $this = $(this);
                $this.parents(".dropdown-menu").siblings(".dropdown-toggle").text($this.text());
            });

            $(".dropdown-select").on('click', '.dropdown-menu a', function (e) {
                e.preventDefault();
                var $this = $(this);
                var hfSite = $('#hfSiteEtr input');
                hfSite.val($this.attr('data-site'));
                $this.parents(".dropdown-menu").siblings("[data-toggle=dropdown]").text($this.attr('data-country'));
                $('#ageTitlePrefix').text($this.attr('data-country-prefix'));
            }).on('show.bs.dropdown', function () {
                $(this).find('.dropdown-menu a:first-of-type').focus();
            }).on('keypress', function (e) {
                var code = e.which || e.keyCode;
                var $this = $(this);
                switch (code) {
                    case 13: // Enter key
                        if ($this.is('.open')) {
                            e.preventDefault();
                            $this.find('.dropdown-menu a:focus').trigger('click');
                        }
                        break;
                    case 32: // Space bar
                        if ($(e.target).is('[data-toggle=dropdown]') && !$this.is('.open')) {
                            e.preventDefault();
                            $this.find('[data-toggle=dropdown]').dropdown('toggle');
                        }
                        break;
                    default:
                        var char = $.trim(String.fromCharCode(code)).toLowerCase();
                        if (char.length != 0) {
                            $this.find(".dropdown-menu a").each(function (index, element) {
                                var $element = $(element);
                                if ($.trim($element.text()).toLowerCase().indexOf(char) == 0) {
                                    $element.focus();
                                    /*var menu = $this.find(".dropdown-menu");
                                     if(menu.scrollHeight > this.height()) {
                                     menu.scrollTo($element.parent().position().top);
                                     }*/
                                    return false;
                                }
                            });
                        }
                        break;
                }
            });
        });
    },
    basket: function () {
        var $page;

        if ($('body').has($('#wine_slider')).length) {
            $page = 'basket';
        } else {
            $page = 'confirmation'
        }

        $('#msg-apply-promo, #co-edit-billing').hide();
        $('#btn-apply-promo').css({ 'visibility': 'hidden' });

        $('#input-apply-promo').on('keyup paste', function () {
            // remove all whitespace from input
            $(this).val(function (_, v) {
                return v.replace(/\s+/g, '');
            });

            if ($(this).val().length >= 3) {
                $('#btn-apply-promo').css({ 'visibility': 'visible' });
            } else {
                $('#btn-apply-promo').css({ 'visibility': 'hidden' });
                $('#msg-apply-promo').slideUp(200);
            }
        });

        $('#btn-apply-promo').on('click', function () {
            $('#msg-apply-promo').slideDown(200);
        });

        if ($page == 'basket') {
            var wine_item_count;
            var containerWidth;

            $("#wine_folio .slideshow .arrow").click(function () {
                if ($(this).hasClass("left")) {
                    $("#wine_slider").flexslider('prev');
                }
                else if ($(this).hasClass("right")) {
                    $("#wine_slider").flexslider('next');
                }
            });
        }

        if ($page == 'confirmation') {
            // show/hide password
            $('#create_acc-showpassword').change(function () {
                $('#create_acc-password2, #create_acc-password1').togglePassword($(this).isChecked());
            });

            $('#create_acc-policy').change(function () {
                if ($(this).isChecked()) {
                    $('#create_acc-reg').removeClass('disabled');
                } else {
                    $('#create_acc-reg').addClass('disabled');
                }
            });
        }
    },
    cellar_door_details: function () {
        if (!$('#cellar-door-details').length) return;

        // Create map
        google.maps.event.addDomListener(window, 'load', function () {
            map = new google.maps.Map($('#cellar-door-details .side-container .map')[0], {
                zoom: 9,
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE
                },
                styles: [
                    {
                        "stylers": [
                            { "saturation": -100 }
                        ]
                    },
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ]
            });

            // Add all vineyards to map
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(vineyard.Lat, vineyard.Lon),
                map: map,
                title: vineyard.name,
                icon: '/includes/penfolds/images/maps-marker.png'
            });

            centerMap();
        });

        $(window).resize(centerMap);

        function centerMap() {
            if (map && vineyard) {
                map.setCenter(new google.maps.LatLng(vineyard.Lat, vineyard.Lon));
            }
        }
    },
    cellar_reserve_details: function () {
        if (!$('#cellar-reserve-details').length) return;

        $('#cellar-reserve-details .notes input[type=checkbox]').change(function () {
            $('#cellar-reserve-details #discussions .btn.download').toggleClass('disabled', $('#cellar-reserve-details .notes input[type=checkbox]').filter(function () { return $(this).isChecked() }).length == 0);
        });

        $("#discussions .dropdown .dropdown-menu.sans-serif li a").on("click", function () {
            if ($(this).text().toLowerCase() == "oldest to newest") {
                $("#discussions .dropdown a.dropdown-toggle").html("Oldest To Newest");
                $(this).html("NEWEST TO OLDEST");
                $(".col-xs-12.notes .row").sort(function (a, b) {
                    return a.dataset.date < b.dataset.date ? -1 : 1;
                }).appendTo(".col-xs-12.notes");
            } else if ($(this).text().toLowerCase() == "newest to oldest") {
                $("#discussions .dropdown a.dropdown-toggle").html("Newest to Oldest");
                $(this).html("OLDEST TO NEWEST");
                $(".col-xs-12.notes .row").sort(function (a, b) {
                    return a.dataset.date < b.dataset.date ? 1 : -1;
                }).appendTo(".col-xs-12.notes");
            }

            //$($(".col-xs-12.notes .row").get().reverse()).appendTo(".col-xs-12.notes");
        });

        $(".btn-primary.download").on("click", function () {
            $(".col-xs-12.notes .row").each(function () {
                var $chkBox = $(this).find("input[type='checkbox']");

                if ($chkBox.attr("checked") == "checked") {
                    var url = $chkBox.attr("data-tasting-notes-link");
                    window.open(url);
                }
            });
        });
    },
    change_password: function () {
        if (!$('#change-password').length) return;

        //$('#change-password #show-password').change(function () {
        //    $('#change-password form input:not([type=checkbox])').togglePassword($(this).isChecked());
        //});

        $('#change-password form').submit(function (e) {
            e.preventDefault();
            if ($(this).valid()) {
                $(this).trigger('reset').validate().resetForm();
                $('#change-password #change-password-modal').modal('show');
                setTimeout(function () {
                    $('#change-password #change-password-modal').modal('hide');
                }, 3000);
            }
        });
    },
    checkout: function () {
        if (!$('#checkout').length) return;

        $('#checkout #login-collapse').on('shown.bs.collapse', function (event) {
            $(event.target).find('input')[0].focus();
        });

        $('#checkout #login form.login').submit(function (e) {
            e.preventDefault();
            if ($(this).valid()) {
                $('#checkout').addClass('authed'); // Adding class to top level to add logged in behavior
                $('#login').collapse('hide'); // Hide login
                $('#checkout .address-book').prop('selectedIndex', 1).change();
            }
        });

        $('#checkout #login .login-btn').click(function () {
            $('#login form.login').submit();
        });

        $('#checkout #login .forgot-password-link').click(showForgotPasswordModal);

        $('#checkout #forgot-password form').submit(function (e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.valid()) {
                $this.addClass('hide');
                $('#forgot-password .email-sent').removeClass('hide');
                $this.trigger("reset").validate().resetForm();
            }
        });

        $('#checkout #forgot-password').on('hidden.bs.collapse', function (event) {
            $('#forgot-password form').removeClass('hide');
            $('#forgot-password .email-sent').addClass('hide');
        });

        $('#checkout .continue').each(function (i, elem) {
            var $elem = $(elem);
            $elem.click(function (e) {
                e.preventDefault();

                var $panel = $elem.parents('.panel');
                var $forms = $panel.find('form:not(.novalidate)').filter(':visible');
                //var $forms =  $panel.hasClass('three')?$panel.find('form:not(.novalidate)'):$elem.parents('form');
                var valid = true;
                $.each($forms, function (index, element) {
                    valid = valid && $(element).valid();
                });
                if (valid) {
                    var preventComplete = false;

                    // If shipping Address or billing address
                    var json = $forms.serializeObject(), $title = $panel.find('.panel-title');
                    if ($panel.hasClass('one') || $panel.hasClass('three')) {
                        if (!$panel.hasClass('three') || ($panel.hasClass('three') && !$title.find('#same-as-shipping').isChecked())) {
                            if ($('#checkout').hasClass('authed')) {
                                $add = $panel.find('.add-new');
                                if (!$add.hasClass('collapsed')) {
                                    $title.find('.address').html(formatAddress(json));
                                }
                            } else {
                                $title.find('.address').html(formatAddress(json));
                                if ($panel.hasClass('one')) {
                                    preventComplete = true;
                                    $('#address-verification-modal').on('hidden.bs.modal', function () {
                                        $('#address-verification-message-modal').on('hidden.bs.modal', function () {
                                            panelComplete($panel);
                                        }).on('shown.bs.modal', function () {
                                            setTimeout(function () {
                                                $('#address-verification-message-modal').modal('hide');
                                            }, 5000)
                                        }).modal('show');
                                    }).modal('show');
                                }
                            }
                        }

                        if ($panel.hasClass('three')) {
                            $elem.html('PROCESSING...');
                            $elem.attr('disabled', 'disabled');

                            // REMOVE THIS BIT WHEN INTEGRATING
                            setTimeout(function () {
                                window.location = "confirmation.html";
                            }, 2000);
                        }
                    } else if ($panel.hasClass('two')) {
                        $panel.find('.panel-title .method').html(json['shipping-method']);
                    }

                    if (!preventComplete) {
                        panelComplete($panel);
                    }

                    // Reset form
                    //$form.trigger('reset').validate().resetForm();
                }
            });
        });

        $('#checkout #co_form .vCreditCard').blur(function () {
            if ($('#checkout #co_form .vCVV').val().length != 0) {
                $('#checkout  #co_form .vCVV').valid();
            }
        });

        $('#checkout .address-book').change(function () {
            var $this = $(this), $parent = $this.parent().parent(), $address = $this.parents('.panel-title').find('.address');
            var $form = $($this.data("target")).parents('form'), $continue = $form.find('.continue');

            if ($this.val() == 'choose') {
                $address.empty();
                $continue.attr('disabled', 'disabled');
            } else {
                $address.html('Mrs. Victoria Mershon<br/>567 Main St,<br/>New York<br/>United States');
                $parent.find('.add-new:not(.collapsed)').click();
                $continue.removeAttr('disabled');
            }
        });

        $('#checkout .add-new').click(function () {
            var $form = $($(this).data("target")).parents('form'), $continue = $form.find('.continue'),
                $title = $(this).parents('.panel-title'), $address = $title.find('.address'), $addressbook = $title.find('.address-book');

            if ($(this).hasClass('collapsed')) {
                $continue.removeAttr('disabled');
                $address.empty();
                $addressbook.prop('selectedIndex', 0);
            } else {
                $continue.attr('disabled', 'disabled');
            }
        });

        $('#checkout #same-as-shipping').change(function () {
            var $this = $(this), $panel = $this.parents('.panel'), $title = $panel.find('.panel-title'),
                $form = $panel.find('form:not(#co_form)'), $inputs = $form.find('.inputs'), $address = $title.find('.address'),
                $submit = $panel.find('.logged-in form [type="submit"]'), $book = $panel.find('.address-book option');

            if ($(this).isChecked()) {
                $title.find('.co_info-address-stored').addClass('hide');
                $title.find('.add-new:not(.collapsed)').click();
                $inputs.addClass('hide');
                $form.addClass('novalidate');
                $address.html($('#checkout #accordion .panel.one .panel-title .address').html());
                $submit.removeAttr('disabled');
            } else {
                $address.empty();
                $book.eq(0).prop('selected', true);
                $title.find('.co_info-address-stored').removeClass('hide');
                $inputs.removeClass('hide');
                $form.removeClass('novalidate');
                if (!($('#checkout').hasClass('authed') && !$title.find('.add-new').hasClass('collapsed'))) {
                    $submit.attr('disabled', 'disabled');
                }
            }
        });

        $('#checkout #accordion #co_info-tnc').change(function () {
            var $form = $(this).parents('form'), $continue = $form.find('.continue');

            if ($(this).isChecked()) {
                $continue.removeAttr('disabled');
            } else {
                $continue.attr('disabled', 'disabled');
            }
        });

        //$('#checkout #login #checkout-show-password').change(function () {
        //    $('#checkout #login #checkout-user-password').togglePassword($(this).isChecked());
        //});

        var $accordion = $('#checkout #accordion .panel-collapse');
        $accordion.on('show.bs.collapse', function (event) {
            if ($(event.target).is('.panel-collapse')) {
                var $panel = $(this).parents('.panel');
                $panel.addClass('active');
                if ($panel.hasClass('three')) {
                    $('#same-as-shipping').change();
                }
            }
        });

        $accordion.on('hide.bs.collapse', function (event) {
            if ($(event.target).is('.panel-collapse')) {
                $(this).parents('.panel').removeClass('active');
                $(this).find('form').validate().resetForm();
            }
        });

        $('#checkout .vCreditCard').on('creditcardchange', function (e, type) {
            $('#checkout .creditcard-types .active').removeClass('active');
            $('#checkout .creditcard-types .' + type.toLowerCase()).addClass('active');
        });

        function panelComplete($panel) {
            $panel.addClass('complete');
            var $next = $panel.next();
            if ($next.length != 0) {
                $next.find('.btn-edit[data-toggle="collapse"]').click();
            }
        }

        function formatAddress(data) {
            if (!data) {
                return '';
            }

            return '<div>' + data.firstname + ' ' + (data.initial.length != 0 ? data.initial + ' ' : '') + data.lastname + '</div>'
                + '<div>' + data.address + '</div>'
                + (data.address2.length != 0 ? '<div>' + data.address2 + '</div>' : '')
                + '<div>' + data.city + ', ' + data.state + '</div>'
                + '<div>' + data.country + ', ' + data.postcode + '</div>'
                + '<div>' + data.email + '</div>'
                + (data.phone ? '<div>' + data.phone + '</div>' : '');
        }
    },
    contact_us: function () {
        if (!$('#contact-us').length) return;

        var map = null, selectedOffice = null;

        // Add locations
        var dropdown = $('#contact-us #select-location-container .dropdown-menu');

        /*dropdown.find('a').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            //selectOffice(offices[Number($this.data('id'))]);
            var result = $.grep(offices, function (e) { return e.Id == $this.data('id'); });
            if (result) {
                selectOffice(result[0]);
            }
        });*/

        // Create map
        google.maps.event.addDomListener(window, 'load', function () {
            map = new google.maps.Map($('#map')[0], {
                zoom: 6,
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE
                },
                styles: [
                    {
                        "stylers": [
                            { "saturation": -100 }
                        ]
                    },
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ]
            });

            selectedOffice = offices[currentOfficeIndex];

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(selectedOffice.Lat, selectedOffice.Lon),
                map: map,
                title: selectedOffice.Title,
                icon: '/includes/penfolds/images/maps-marker.png'
            });

            centerMap();
        });

        $(window).resize(centerMap);

        function centerMap() {
            var latlng = $("#map").data("lat-lon").split(",");
            map.setCenter(new google.maps.LatLng(latlng[0], latlng[1]));
        }

        function selectOffice(office) {
            selectedOffice = office;
            $('#contact-us #select-location-container .dropdown-menu .selected').removeClass('selected');
            $('#contact-us #select-location-container .dropdown-menu [data-id="' + office.Id + '"]').addClass('selected');
            centerMap();
            $('#contact-us #title').html(selectedOffice.Title);
            $('#contact-us #address').html(selectedOffice.Address);
            $('#contact-us #consumer-info').html(selectedOffice.Info);
        }

        $('#contact-us #contact-country').change(function () {
            var useFreeText = true;
            var selectedCountry = this.value.toLowerCase();
            //
            var stateDdl = $('#contact-state');

            if (countries) {
                var result = $.grep(countries, function (e) { return e.Name.toLowerCase() == selectedCountry; });
                if (result.length > 0 && result[0].State.length > 0) {
                    //contact-state
                    var opt;
                    for (i = 0; i < result[0].State.length; i++) {
                        opt += "<option value=\"" + result[0].State[i].Name + "\">" + result[0].State[i].Name + "</option>";
                    }
                    $('#contact-state').find('option').remove().end().append(opt);
                    useFreeText = false;
                    $('#contact-state').removeClass('hidden');
                    $('#contact-state-text').addClass('hidden');
                    stateDdl.parent().addClass('select-box');
                }
            }
            if (useFreeText) {
                $('#contact-state-text').removeClass('hidden');
                $('#contact-state').addClass('hidden');
                stateDdl.parent().removeClass('select-box');
            }
            //ForgotPasswordSubmit
        });

        // Needs to be specific, otherwise this targets the share email form
        $('#contact-us .row .col-lg-7 .btn-submit-form').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            $('#contact-us .row .col-lg-7 .form-wrapper').wrap('<form id="temp_form_contact" />');
            $('#temp_form_contact').each(function () {
                $(this).validate({
                    ignore: ".ignore,:hidden",
                    errorLabelContainer: $(this).find(".errors")
                });
            });
            var state = "";
            if ($('#contact-state').is(':visible')) {
                state = $('#contact-state').val();
            } else {
                state = $('#state-text').val();
            }

            var isValid = $('#temp_form_contact').valid();

            $('#contact-us .row .col-lg-7 .form-wrapper').unwrap();

            if (isValid) {
                var htmlForm = "<form action='../../../Penfolds Wines - Home_files/" + $('#sfPostUrl').val() + "'>";
                htmlForm += "<input type='hidden' id='brand' name='brand' value='" + $('#sfBrand').val() + "' />";
                htmlForm += "<input type='hidden' id='type' name='type' value='" + $('#sfRecordType').val() + "' />";
                htmlForm += "<input type='hidden' id='lang' name='lang' value='" + $('#sfLang').val() + "' />";
                htmlForm += "<input type='hidden' id='retUrl' name='retUrl' value='" + $('#sfRetURL').val() + "' />";
                htmlForm += "<input type='hidden' id='lead_source' name='lead_source' value='" + $('#sfLeadSource').val() + "' />";
                htmlForm += "<input type='hidden' id='recordType' name='recordType' value='" + $('#sfRecordType').val() + "' />";
                htmlForm += "<input type='hidden' id='country' name='country' value='" + htmlEscape($('#contact-country').val()) + "' />";
                htmlForm += "<input type='hidden' id='subject' name='subject' value='" + htmlEscape($('#contact-subject').val()) + "' />";
                htmlForm += "<input type='hidden' id='state' name='state' value='" + state + "' />";
                htmlForm += "<input type='hidden' id='email' name='email' value='" + $('#contact-email').val() + "' />";
                htmlForm += "<input type='hidden' id='phone' name='phone' value='" + htmlEscape($('#contact-phone').val()) + "' />";
                htmlForm += "<input type='hidden' id='comments' name='comments' value='" + htmlEscape($('#contact-comment').val()) + "' />";
                htmlForm += "<input type='hidden' id='first_name' name='first_name' value='" + htmlEscape($('#contact-first-name').val()) + "' />";
                htmlForm += "<input type='hidden' id='last_name' name='last_name' value='" + htmlEscape($('#contact-last-name').val()) + "' />";
                htmlForm += "</form>";

                //Submit the form
                $(htmlForm).appendTo("body").submit();
            }
        });
    },
    experience_penfolds: function () {
        if (!$('#experience-penfolds').length) return;

        var retailers = [
            {
                id: '0',
                name: 'Magill Estate',
                coordinates: { lat: -34.920975, lon: 138.678863 },
                address: '78 Penfold Road, Magill, 5072, Australia',
                info: '+61 8 8301 5400',
                description: null
            },
            {
                id: '1',
                name: 'Kalimna',
                coordinates: { lat: -37.879966, lon: 147.962560 },
                address: 'Kalimna, 3909, Australia',
                info: '',
                description: null
            },
            {
                id: '2',
                name: 'The Waltons',
                coordinates: { lat: -37.879966, lon: 147.962560 },
                address: 'Unknown, Australia',
                info: '',
                description: null
            },
            {
                id: '3',
                name: 'Marananga',
                coordinates: { lat: -34.484026, lon: 138.937441 },
                address: 'Marananga, South Australia, 5355, Australia',
                info: '',
                description: null
            },
            {
                id: '4',
                name: 'Koonunga Hill',
                coordinates: { lat: -34.379846, lon: 138.993171 },
                address: 'Koonunga, South Australia, 5373, Australia',
                info: '',
                description: null
            },
            {
                id: '5',
                name: 'Partalunga',
                coordinates: { lat: -34.765365, lon: 139.057103 },
                address: 'Mt Pleasant, South Australia, 5235, Australia',
                info: '',
                description: null
            },
            {
                id: '6',
                name: 'Clare Valley Estate',
                coordinates: { lat: -33.881429, lon: 138.679001 },
                address: 'Clare Valley, South Australia, 5453 , Australia',
                info: '',
                description: null
            },
            {
                id: '7',
                name: 'Stonewell',
                coordinates: { lat: -34.524995, lon: 138.925935 },
                address: 'Stonewell, South Australia, 5352, Australia',
                info: '',
                description: null
            },
            {
                id: '8',
                name: 'Robe',
                coordinates: { lat: -37.193886, lon: 139.902253 },
                address: 'Robe, South Australia, 5276, Australia',
                info: '',
                description: null
            },
            {
                id: '9',
                name: 'Bordertown',
                coordinates: { lat: -36.311166, lon: 140.773380 },
                address: 'Bordertown, South Australia, 5268, Australia',
                info: '',
                description: null
            },
            {
                id: '10',
                name: 'Coonewarra',
                coordinates: { lat: -37.291274, lon: 140.839002 },
                address: 'Coonawarra, South Australia, 5263, Australia',
                info: '',
                description: null
            }
        ];
        var restaurants = [
            {
                id: '0',
                name: 'Magill Estate',
                coordinates: { lat: -34.920975, lon: 138.678863 },
                address: '78 Penfold Road, Magill, 5072, Australia',
                info: '+61 8 8301 5400',
                description: null
            },
            {
                id: '1',
                name: 'Kalimna',
                coordinates: { lat: -37.879966, lon: 147.962560 },
                address: 'Kalimna, 3909, Australia',
                info: '',
                description: null
            },
            {
                id: '2',
                name: 'The Waltons',
                coordinates: { lat: -37.879966, lon: 147.962560 },
                address: 'Unknown, Australia',
                info: '',
                description: null
            },
            {
                id: '3',
                name: 'Marananga',
                coordinates: { lat: -34.484026, lon: 138.937441 },
                address: 'Marananga, South Australia, 5355, Australia',
                info: '',
                description: null
            },
            {
                id: '4',
                name: 'Koonunga Hill',
                coordinates: { lat: -34.379846, lon: 138.993171 },
                address: 'Koonunga, South Australia, 5373, Australia',
                info: '',
                description: null
            },
            {
                id: '5',
                name: 'Partalunga',
                coordinates: { lat: -34.765365, lon: 139.057103 },
                address: 'Mt Pleasant, South Australia, 5235, Australia',
                info: '',
                description: null
            },
            {
                id: '6',
                name: 'Clare Valley Estate',
                coordinates: { lat: -33.881429, lon: 138.679001 },
                address: 'Clare Valley, South Australia, 5453 , Australia',
                info: '',
                description: null
            },
            {
                id: '7',
                name: 'Stonewell',
                coordinates: { lat: -34.524995, lon: 138.925935 },
                address: 'Stonewell, South Australia, 5352, Australia',
                info: '',
                description: null
            },
            {
                id: '8',
                name: 'Robe',
                coordinates: { lat: -37.193886, lon: 139.902253 },
                address: 'Robe, South Australia, 5276, Australia',
                info: '',
                description: null
            },
            {
                id: '9',
                name: 'Bordertown',
                coordinates: { lat: -36.311166, lon: 140.773380 },
                address: 'Bordertown, South Australia, 5268, Australia',
                info: '',
                description: null
            },
            {
                id: '10',
                name: 'Coonewarra',
                coordinates: { lat: -37.291274, lon: 140.839002 },
                address: 'Coonawarra, South Australia, 5263, Australia',
                info: '',
                description: null
            }
        ];
        var markers = [], bounds, infowindow = new InfoBox({
            maxWidth: 0,
            boxStyle: {
                background: '#fff',
                opacity: 1,
                width: "240px"
            },
            pixelOffset: new google.maps.Size(-120, -45),
            closeBoxURL: "",
            enableEventPropagation: true,
            infoBoxClearance: new google.maps.Size(1, 1),
            alignBottom: true
        });

        // Create map
        google.maps.event.addDomListener(window, 'load', function () {
            map = new google.maps.Map($('#experience-penfolds .where .map')[0], {
                zoom: 9,
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE
                },
                styles: [
                    {
                        "stylers": [
                            { "saturation": -100 }
                        ]
                    },
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ]
            });

            populateMap($('#experience-penfolds .where .tab-container .active a').data('target'));
        });

        $(window).resize(centerMap);

        function centerMap() {
            if (bounds) {
                map.fitBounds(bounds);
            }
        }

        function clearMap() {
            for (var i = 0, len = markers.length; i < len; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }

        function populateMap(value) {
            clearMap();

            var data = [];
            switch (value) {
                case 'retailers':
                    data = retailers;
                    break;
                case 'restaurants':
                    data = restaurants;
                    break;
            }

            bounds = new google.maps.LatLngBounds();
            var latlon;
            for (var i = 0, len = data.length; i < len; i++) {
                latlon = new google.maps.LatLng(data[i].coordinates.lat, data[i].coordinates.lon);
                bounds.extend(latlon);
                markers.push(new google.maps.Marker({
                    position: latlon,
                    map: map,
                    title: data[i].name,
                    icon: '/includes/penfolds/images/maps-marker.png'
                }));
            }

            centerMap();
        }

        $('#experience-penfolds .where a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var $this = $(this);
            //$this.closest('.tab-container').scrollLeft($this.parent().position().left);
            $this.closest('.tab-container').scrollLeft(parent.position().left + parseInt(parent.css('margin-left')) - parseInt($this.closest('.nav-tabs').css('padding-left')));
            populateMap($this.data('target'));
        });

        $('#experience-penfolds .where .tab-container').niceScroll({
            touchbehavior: true,
            sensitiverail: false,
            cursorwidth: 0,
            cursoropacitymax: 0,
            grabcursorenabled: false,
            smoothscroll: false
        });
    },
    home: function () {
        if (!$('#home').length) return;

        $('#home #pairing-carousel').bind('slid.bs.carousel', function () {
            var $this = $(this);
            var index = $this.find('.item.active').index() + 1;
            var total = $this.find('.item').length;
            $this.closest('.pairing-container').find('.count').html(index + '/' + total);
        });
    },
    myacc: function () {
        //if (!$('#test').length)   return;

        var changePass = false;
        $('#myacc-password2').parent().hide();
        $('#btn_change-pass').on('click', function () {
            if (!changePass) {
                $(this).text('Cancel');
                $('#myacc-password1').removeAttr('disabled').addClass('vPassword').val('').focus();
                $('#myacc-password2').removeAttr('disabled').attr('equalto', '#myacc-password1').attr('required', 'required').parent().slideDown();

                changePass = true;
            } else {
                $(this).text('Change Password');
                $('#myacc-password1').attr('disabled', 'disabled').removeClass('vPassword').val('password').blur();
                $('#myacc-password2').attr('disabled', 'disabled').removeAttr('equalto').removeAttr('required').val('').blur();
                $('#myacc-password1, #myacc-password2').validate();
                $('#myacc-password2').parent().slideUp();

                changePass = false;
            }
        });

        var containerWidth = $("#account-profile .container").width();

        $('.toggleAccordion').on('click', function () {
            var detailOpen = $(this).attr('data-open');
            $(this).parent().find('.accordion-item').slideToggle(500);

            if (detailOpen == 0) {
                $(this).parent().find('.toggleAccordion').text('Hide details -').attr('data-open', '1');
            } else {
                $(this).parent().find('.toggleAccordion').text('View details +').attr('data-open', '0');
            }
        });

        $(".paginationContent > a").unbind("click").on("click", function (e) {
            e.preventDefault();
            $(".paginationContent").hide();
            $(".paginationAltContent").show();
        });
        $(".paginationAltContent > a").unbind("click").on("click", function (e) {
            e.preventDefault();
            $(".paginationAltContent").hide();
            $(".paginationContent").show();
        });
    },
    other_product_details: function () {
        if (!$('#other-product-details').length) return;

        $('#other-product-details .tab-container').niceScroll({
            touchbehavior: true,
            sensitiverail: false,
            cursorwidth: 0,
            cursoropacitymax: 0,
            grabcursorenabled: false,
            smoothscroll: false
        });

        $('#other-product-details a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var $this = $(this);
            $this.closest('.tab-container').scrollLeft(parent.position().left + parseInt(parent.css('margin-left')) - parseInt($this.closest('.nav-tabs').css('padding-left')));
        });

        /*$('#product-details .carousel .count').closest('.carousel').bind('slid.bs.carousel', function() {
            var $this = $(this);
            var index = $this.find('.item.active').index() + 1;
            var total = $this.find('.item').length;
            $this.find('.count').html(index+'/'+total);
        });*/

        $('#other-product-details [data-toggle="replace"]').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            $this.replaceWith($this.data('target'));
        });
    },
    our_stockists: function () {
        if (!$('#our-stockists').length) return;

        var retailers = [
            {
                id: '0',
                name: 'Magill Estate',
                coordinates: { lat: -34.920975, lon: 138.678863 },
                address: '78 Penfold Road, Magill, 5072, Australia',
                info: '+61 8 8301 5400',
                description: null
            },
            {
                id: '1',
                name: 'Kalimna',
                coordinates: { lat: -37.879966, lon: 147.962560 },
                address: 'Kalimna, 3909, Australia',
                info: '',
                description: null
            },
            {
                id: '2',
                name: 'The Waltons',
                coordinates: { lat: -37.879968, lon: 147.962560 },
                address: 'Unknown, Australia',
                info: '',
                description: null
            },
            {
                id: '3',
                name: 'Marananga',
                coordinates: { lat: -34.484026, lon: 138.937441 },
                address: 'Marananga, South Australia, 5355, Australia',
                info: '',
                description: null
            },
            {
                id: '4',
                name: 'Koonunga Hill',
                coordinates: { lat: -34.379846, lon: 138.993171 },
                address: 'Koonunga, South Australia, 5373, Australia',
                info: '',
                description: null
            },
            {
                id: '5',
                name: 'Partalunga',
                coordinates: { lat: -34.765365, lon: 139.057103 },
                address: 'Mt Pleasant, South Australia, 5235, Australia',
                info: '',
                description: null
            },
            {
                id: '6',
                name: 'Clare Valley Estate',
                coordinates: { lat: -33.881429, lon: 138.679001 },
                address: 'Clare Valley, South Australia, 5453 , Australia',
                info: '',
                description: null
            },
            {
                id: '7',
                name: 'Stonewell',
                coordinates: { lat: -34.524995, lon: 138.925935 },
                address: 'Stonewell, South Australia, 5352, Australia',
                info: '',
                description: null
            },
            {
                id: '8',
                name: 'Robe',
                coordinates: { lat: -37.193886, lon: 139.902253 },
                address: 'Robe, South Australia, 5276, Australia',
                info: '',
                description: null
            },
            {
                id: '9',
                name: 'Bordertown',
                coordinates: { lat: -36.311166, lon: 140.773380 },
                address: 'Bordertown, South Australia, 5268, Australia',
                info: '',
                description: null
            },
            {
                id: '10',
                name: 'Coonewarra',
                coordinates: { lat: -37.291274, lon: 140.839002 },
                address: 'Coonawarra, South Australia, 5263, Australia',
                info: '',
                description: null
            }
        ];
        var restaurants = [
            {
                id: '0',
                name: 'Magill Estate',
                coordinates: { lat: -34.920975, lon: 138.678863 },
                address: '78 Penfold Road, Magill, 5072, Australia',
                info: '+61 8 8301 5400',
                description: null
            },
            {
                id: '1',
                name: 'Kalimna',
                coordinates: { lat: -37.879966, lon: 147.962560 },
                address: 'Kalimna, 3909, Australia',
                info: '',
                description: null
            },
            {
                id: '2',
                name: 'The Waltons',
                coordinates: { lat: -37.879966, lon: 147.962560 },
                address: 'Unknown, Australia',
                info: '',
                description: null
            },
            {
                id: '3',
                name: 'Marananga',
                coordinates: { lat: -34.484026, lon: 138.937441 },
                address: 'Marananga, South Australia, 5355, Australia',
                info: '',
                description: null
            },
            {
                id: '4',
                name: 'Koonunga Hill',
                coordinates: { lat: -34.379846, lon: 138.993171 },
                address: 'Koonunga, South Australia, 5373, Australia',
                info: '',
                description: null
            },
            {
                id: '5',
                name: 'Partalunga',
                coordinates: { lat: -34.765365, lon: 139.057103 },
                address: 'Mt Pleasant, South Australia, 5235, Australia',
                info: '',
                description: null
            },
            {
                id: '6',
                name: 'Clare Valley Estate',
                coordinates: { lat: -33.881429, lon: 138.679001 },
                address: 'Clare Valley, South Australia, 5453 , Australia',
                info: '',
                description: null
            },
            {
                id: '7',
                name: 'Stonewell',
                coordinates: { lat: -34.524995, lon: 138.925935 },
                address: 'Stonewell, South Australia, 5352, Australia',
                info: '',
                description: null
            },
            {
                id: '8',
                name: 'Robe',
                coordinates: { lat: -37.193886, lon: 139.902253 },
                address: 'Robe, South Australia, 5276, Australia',
                info: '',
                description: null
            },
            {
                id: '9',
                name: 'Bordertown',
                coordinates: { lat: -36.311166, lon: 140.773380 },
                address: 'Bordertown, South Australia, 5268, Australia',
                info: '',
                description: null
            },
            {
                id: '10',
                name: 'Coonewarra',
                coordinates: { lat: -37.291274, lon: 140.839002 },
                address: 'Coonawarra, South Australia, 5263, Australia',
                info: '',
                description: null
            }
        ];

        var markers = [], bounds, infowindow = new InfoBox({
            maxWidth: 0,
            boxStyle: {
                background: '#fff',
                opacity: 1,
                width: "240px"
            },
            pixelOffset: new google.maps.Size(-120, -45),
            closeBoxURL: "",
            enableEventPropagation: true,
            infoBoxClearance: new google.maps.Size(1, 1),
            alignBottom: true
        });

        // Create map
        google.maps.event.addDomListener(window, 'load', function () {
            map = new google.maps.Map($('#our-stockists #locations .map')[0], {
                zoom: 9,
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE
                },
                styles: [
                    {
                        "stylers": [
                            { "saturation": -100 }
                        ]
                    },
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ]
            });

            populateMap($('#our-stockists .tab-container li.active a').data('value'));
        });

        $(window).resize(centerMap);

        function centerMap() {
            if (bounds) {
                map.fitBounds(bounds);
            }
        }

        function clearMap() {
            for (var i = 0, len = markers.length; i < len; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }

        function populateMap(value) {
            clearMap();

            var data = [];
            switch (value) {
                case 'retailers':
                    data = retailers;
                    break;
                case 'restaurants':
                    data = restaurants;
                    break;
            }

            bounds = new google.maps.LatLngBounds();
            var latlon;
            for (var i = 0, len = data.length; i < len; i++) {
                latlon = new google.maps.LatLng(data[i].coordinates.lat, data[i].coordinates.lon);
                bounds.extend(latlon);
                markers.push(
                    new MarkerWithLabel({
                        position: latlon,
                        map: map,
                        draggable: false,
                        labelContent: i + 1, // your number
                        icon: '/includes/penfolds/images/maps-marker.png',
                        labelAnchor: new google.maps.Point(0, 0),
                        labelClass: "marker-label", // the CSS class for the label
                        labelInBackground: false,
                        title: data[i].name,
                        zIndex: google.maps.Marker.MAX_ZINDEX - i
                    })
                );
            }

            centerMap();
        }

        function filterLocations() {
            // Get checkbox filters
            var filter = {
                location: [],
                range: [],
                style: [],
                varietal: []
            };
            $('#our-stockists .controls [type=checkbox][checked]').each(function (index, value) {
                var $this = $(this);
                filter[$this.data('category')].push($this.val());
            });

            // Do something with data
        }

        $('#our-stockists .tab-container').niceScroll({
            touchbehavior: true,
            sensitiverail: false,
            cursorwidth: 0,
            cursoropacitymax: 0,
            grabcursorenabled: false,
            smoothscroll: false
        });

        $('#our-stockists a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var $this = $(this);
            $this.closest('.tab-container').scrollLeft(parent.position().left + parseInt(parent.css('margin-left')) - parseInt($this.closest('.nav-tabs').css('padding-left')));
            populateMap($this.data('value'));
        });
    },
    penfolds_club: function () {
        if (!$('#penfolds-club').length) return;

        $(document).on('click', '#club-show-password', function () {
            var $this = $(this);
            if ($this.is('[checked]')) {
                $('#club-password').replaceWith($('#club-password').clone().attr('type', 'text'));
                $('#club-confirm-password').replaceWith($('#club-confirm-password').clone().attr('type', 'text'));
            } else {
                $('#club-password').replaceWith($('#club-password').clone().attr('type', 'password'));
                $('#club-confirm-password').replaceWith($('#club-confirm-password').clone().attr('type', 'password'));
            }
        });

        $('#penfolds-club #club-privacy-policy').change(function () {
            var $this = $(this),
            $submit = $('#penfolds-club input[type="submit"]');
            if ($(this).isChecked()) {
                $submit.removeClass('disabled');
            } else {
                $submit.addClass('disabled');
            }
        });

        $('#penfolds-club #club-country').change(function () {
            var useFreeText = true;
            var selectedCountry = this.value.toLowerCase();
            //
            var stateDdl = $('#club-state');

            if (countries) {
                var result = $.grep(countries, function (e) { return e.Name.toLowerCase() == selectedCountry; });
                if (result.length > 0 && result[0].State.length > 0) {
                    //club-state
                    var opt;
                    for (i = 0; i < result[0].State.length; i++) {
                        opt += "<option value=\"" + result[0].State[i].Name + "\">" + result[0].State[i].Name + "</option>";
                    }
                    $('#club-state').find('option').remove().end().append(opt);
                    useFreeText = false;
                    $('#club-state').removeClass('hidden');
                    $('#club-state-text').addClass('hidden');
                    stateDdl.parent().addClass('select-box');
                }
            }
            if (useFreeText) {
                $('#club-state-text').removeClass('hidden');
                $('#club-state').addClass('hidden');
                stateDdl.parent().removeClass('select-box');
            }
            //
        });

        /* ALTER FOR FREINDS OF PENFOLDS */

        $('#penfolds-club .join .btn-submit-form').click(function (e) {
            var penfolds_club_form = $('#penfolds-club .join.form-wrapper');
            e.preventDefault();
            var $this = $(this);
            //var validCount = 0;
            penfolds_club_form.wrap('<form id="temp_form_club" />');
            $('#temp_form_club').each(function () {
                /*if ($(this).valid()) {
                    validCount++;
                }*/
                $(this).validate({
                    ignore: ".ignore,:hidden",
                    errorLabelContainer: $(this).find(".errors")
                });
            });
            var state = "";
            if ($('#club-state').is(':visible')) {
                state = $('#club-state').val();
            }
            else {
                state = $('#club-state-text').val();
            }
            //var isValid = $('#temp_form_club').valid();
            $('#penfolds-club .join.form-wrapper').unwrap();

            var isValid = validateForm(penfolds_club_form);

            if (isValid.length == 0) {
                /* MERGE BIRTHDAY - this is ready to go */

                var newBirthdayDay = $('#club-birthday-day').val();
                var newBirthdayMonth = $('#club-birthday-month').val();
                var newBirthdayYear = $('#club-birthday-year').val();

                var newSate = htmlEscape(!$('#club-state').hasClass("hidden") ? $('#club-state').val() : $('#club-state-text').val());

                /* REWRITE THIS FOR THE KONA KART FORMAT */
                var hdnLanguage = $("#hdnLanguage").val();
                var htmlForm = "<form method='POST'  action='../../../Penfolds Wines - Home_files/" + $('#sfPostUrl').val() + "'>";
                if (hdnLanguage && (hdnLanguage.toLowerCase() == 'en' || hdnLanguage.toLowerCase() == 'en-au')) {
                    var newBirthday = newBirthdayDay + '/' + newBirthdayMonth + '/' + newBirthdayYear;

                    htmlForm += "<input type='hidden' id='title' name='title' value='" + htmlEscape($('#club-title').val()) + "' />";
                    htmlForm += "<input type='hidden' id='firstName' name='firstName' value='" + htmlEscape($('#club-first-name').val()) + "' />";
                    htmlForm += "<input type='hidden' id='lastName' name='lastName' value='" + htmlEscape($('#club-last-name').val()) + "' />";
                    htmlForm += "<input type='hidden' id='emailAddr' name='emailAddr' value='" + $('#club-email').val() + "' />";
                    htmlForm += "<input type='hidden' id='countryId' name='countryId' value='" + htmlEscape($('#club-country').val()) + "' />";

                    htmlForm += "<input type='hidden' id='state' name='state' value='" + newSate + "' />";

                    htmlForm += "<input type='hidden' id='postcode' name='postcode' value='" + htmlEscape($('#club-postcode').val()) + "' />";
                    htmlForm += "<input type='hidden' id='birthDateString' name='birthDateString' value='" + newBirthday + "' />";
                    htmlForm += "<input type='hidden' id='telephoneNumber' name='telephoneNumber' value='" + htmlEscape($('#phone').val()) + "' />";
                    htmlForm += "<input type='hidden' id='password' name='password' value='" + htmlEscape($('#club-password').val()) + "' />";

                    /* FORM SETTINGS */
                    htmlForm += "<input type='hidden' id='retUrl' name='retUrl' value='" + $('#sfRetURL').val() + "' />";
                    htmlForm += "<input type='hidden' id='brand' name='brand' value='" + $('#sfBrand').val() + "' />";
                    htmlForm += "<input type='hidden' id='type' name='type' value='" + $('#sfRecordType').val() + "' />";
                    htmlForm += "<input type='hidden' id='lang' name='lang' value='" + $('#sfLang').val() + "' />";

                    /* NOT NEEDED FOR THIS FORM ANY LONGER (?)

                      var preferredName = "";
                      if ($('#preferredname') && $('#preferredname').is(':visible')) {
                                preferredName = htmlEscape($('#preferredname').val());
                      }
                      htmlForm += "<input type='hidden' id='preferred_name' name='preferred_name' value='" + preferredName + "' />";

                      htmlForm += "<input type='hidden' id='country' name='country' value='" + htmlEscape($('#club-country').val()) + "' />";
                    htmlForm += "<input type='hidden' id='dob_month' name='dob_month' value='" + htmlEscape($('#club-birthmonth').val()) + "' />";
                      htmlForm += "<input type='hidden' id='dob_year' name='dob_year' value='" + htmlEscape($('#club-birthyear').val()) + "' />";

                      */
                }
                else {
                    var newBirthday = newBirthdayMonth + '/' + newBirthdayDay + '/' + newBirthdayYear;

                    htmlForm += "<input type='hidden' id='title' name='title' value='" + htmlEscape($('#club-title').val()) + "' />";
                    htmlForm += "<input type='hidden' id='first_name' name='first_name' value='" + htmlEscape($('#club-first-name').val()) + "' />";
                    htmlForm += "<input type='hidden' id='last_name' name='last_name' value='" + htmlEscape($('#club-last-name').val()) + "' />";
                    htmlForm += "<input type='hidden' id='email' name='email' value='" + $('#club-email').val() + "' />";
                    htmlForm += "<input type='hidden' id='country' name='country' value='" + htmlEscape($('#club-country').val()) + "' />";

                    htmlForm += "<input type='hidden' id='state' name='state' value='" + newSate + "' />";
                    htmlForm += "<input type='hidden' id='post_code' name='post_code' value='" + htmlEscape($('#club-postcode').val()) + "' />";
                    htmlForm += "<input type='hidden' id='birthDate' name='birthDate' value='" + newBirthday + "' />";
                    htmlForm += "<input type='hidden' id='phone' name='phone' value='" + htmlEscape($('#phone').val()) + "' />";
                    htmlForm += "<input type='hidden' id='club' name='club' value='Friends of Penfolds' />";
                    var preferredName = "";
                    if ($('#preferredname') && $('#preferredname').is(':visible')) {
                        preferredName = htmlEscape($('#preferredname').val());
                    }
                    htmlForm += "<input type='hidden' id='preferred_name' name='preferred_name' value='" + preferredName + "' />";
                    /* FORM SETTINGS */
                    htmlForm += "<input type='hidden' id='retUrl' name='retUrl' value='" + $('#sfRetURL').val() + "' />";
                    htmlForm += "<input type='hidden' id='brand' name='brand' value='" + $('#sfBrand').val() + "' />";
                    htmlForm += "<input type='hidden' id='type' name='type' value='" + $('#sfRecordType').val() + "' />";
                    htmlForm += "<input type='hidden' id='lang' name='lang' value='" + $('#sfLang').val() + "' />";
                }
                htmlForm += "</form>";
                //Submit the form
                $(htmlForm).appendTo("body").submit();
            } else {
                penfolds_club_form.find(".errors").empty().append(isValid).show();
            }
        });

        //Accepts jQuery object of the form to validate
        var validateForm = function ($form) {
            if (typeof ($form) === 'undefined' || $form == false) {
                //console.log('No form provided to validate');
                return false;
            }

            var errorMsg = "";
            if ($form.find("#club-title").val().trim().length == 0) {
                errorMsg += "<label class='error'>" + $form.find("#club-title").data("error-msg") + "</label>";
                $form.find("#club-title").addClass("error");
            } else {
                $form.find("#club-title").removeClass("error");
            }
            if ($form.find("#club-first-name").val().trim().length == 0) {
                errorMsg += "<label class='error'>" + $form.find("#club-first-name").data("error-msg") + "</label>";
                $form.find("#club-first-name").addClass("error");
            } else {
                $form.find("#club-first-name").removeClass("error");
            }
            if ($form.find("#club-last-name").val().trim().length == 0) {
                errorMsg += "<label class='error'>" + $form.find("#club-last-name").data("error-msg") + "</label>";
                $form.find("#club-last-name").addClass("error");
            } else {
                $form.find("#club-last-name").removeClass("error");
            }
            if ($form.find("#club-email").val().trim().length == 0) {
                errorMsg += "<label class='error'>" + $form.find("#club-email").data("error-msg") + "</label>";
                $form.find("#club-email").addClass("error");
            } else {
                if (!validateEmail($form.find("#club-email").val().trim())) {
                    errorMsg += "<label class='error'>" + $form.find("#club-email").data("invalid-msg") + "</label>";
                    $form.find("#club-email").addClass("error");
                }
                $form.find("#club-email").removeClass("error");
            }
            if ($form.find("#club-country").val().trim().length == 0) {
                errorMsg += "<label class='error'>" + $form.find("#club-country").data("error-msg") + "</label>";
                $form.find("#club-country").addClass("error");
            } else {
                $form.find("#club-country").removeClass("error");
            }
            if ($form.find("#club-postcode").val().trim().length == 0) {
                errorMsg += "<label class='error'>" + $form.find("#club-postcode").data("error-msg") + "</label>";
                $form.find("#club-postcode").addClass("error");
            } else {
                $form.find("#club-postcode").removeClass("error");
            }
            if ($form.find("#phone").val().trim().length != 0 && isNaN($form.find("#phone").val())) {
                errorMsg += "<label class='error'>" + $form.find("#phone").data("error-msg") + "</label>";
                $form.find("#phone").addClass("error");
            } else {
                $form.find("#phone").removeClass("error");
            }
            if ($form.find("#club-birthday-day").val().trim().length == 0 || $form.find("#club-birthday-day").val() == 'DD') {
                errorMsg += "<label class='error'>" + $form.find("#club-birthday-day").data("error-msg") + "</label>";
                $form.find("#club-birthday-day").addClass("error");
            } else {
                $form.find("#club-birthday-day").removeClass("error");
            }
            if ($form.find("#club-birthday-month").val().trim().length == 0 || $form.find("#club-birthday-month").val() == 'MM') {
                errorMsg += "<label class='error'>" + $form.find("#club-birthday-month").data("error-msg") + "</label>";
                $form.find("#club-birthday-month").addClass("error");
            } else {
                $form.find("#club-birthday-month").removeClass("error");
            }
            if ($form.find("#club-birthday-year").val().trim().length == 0) {
                errorMsg += "<label class='error'>" + $form.find("#club-birthday-year").data("error-msg") + "</label>";
                $form.find("#club-birthday-year").addClass("error");
            } else {
                $form.find("#club-birthday-year").removeClass("error");
            }
            /* VALIDATE BIRTHDAY FOR INTEGERS */
            var birthdayDay = $form.find("#club-birthday-day").val();
            if (isNaN(birthdayDay) == true) {
                //errorMsg += "<label class='error'>Birthday needs to be a number.</label>";
                $form.find("#club-birthday-day").addClass("error");
            }
            var birthdayMonth = $form.find("#club-birthday-month").val();
            if (isNaN(birthdayMonth) == true) {
                //errorMsg += "<label class='error'>Birthdate Month needs to be a number.</label>";
                $form.find("#club-birthday-month").addClass("error");
            }
            var birthdayYear = $form.find("#club-birthday-year").val();
            if (isNaN(birthdayYear) == true) {
                //errorMsg += "<label class='error'>Birthdate Year needs to be a number.</label>";
                $form.find("#club-birthday-year").addClass("error");
            }
            /* VALIDATE BIRTHDAY FOR NUM CHARS */
            var birthdayMonthLength = $form.find("#club-birthday-month").val().length;
            if (birthdayMonthLength < 2) {
                //errorMsg += "<label class='error'>Birthdate Month is incorrect.</label>";
                $form.find("#club-birthday-month").addClass("error");
            }
            var birthdayYearLength = $form.find("#club-birthday-year").val().length;
            if (birthdayYearLength < 4) {
                //errorMsg += "<label class='error'>Birthdate Year is incorrect.</label>";
                $form.find("#club-birthday-year").addClass("error");
            }
            /* VALIDATE BIRTHDAY FOR DATE RANGES */
            var birthdayDayDate = $form.find("#club-birthday-day").val();
            if (birthdayDayDate > 31) {
                //errorMsg += "<label class='error'>There's too many days in your month.</label>";
                $form.find("#club-birthday-day").addClass("error");
            }
            var birthdayMonthDate = $form.find("#club-birthday-month").val();
            if (birthdayMonthDate > 12) {
                //errorMsg += "<label class='error'>There's too many months in your year.</label>";
                $form.find("#club-birthday-month").addClass("error");
            }
            /*
            var birthdayYearDate = $form.find("#club-birthday-year").val();
            if (birthdayYearDate < 1900) {
                errorMsg += "<label class='error'>You're not that old!</label>";
                $form.find("#club-birthday-year").addClass("error");
            }
            if (birthdayYearDate > 2017) {
                errorMsg += "<label class='error'>You aren't born yet!</label>";
                $form.find("#club-birthday-year").addClass("error");
            }
            */
            
            //Start: Validation For age>=18
			var CurrentDate = new Date();
			var year = $form.find("#club-birthday-year").val();
			var month = $form.find("#club-birthday-month").val();
			var day = $form.find("#club-birthday-day").val();
			var BirthDate = new Date(year, month, day);
			
			if (BirthDate.toString() != "Invalid Date") {
			var currentmonth = CurrentDate.getMonth();
            var age = (CurrentDate.getYear() - BirthDate.getYear());
            if ((currentmonth + 1) < BirthDate.getMonth()) {
				age--;
		    }
            else if ((currentmonth + 1) >= BirthDate.getMonth() && CurrentDate.getDate() < BirthDate.getDate()) {
                age--;
				
            }
            if (age <= 17) {
				
				errorMsg += "<label class='error'>Looks like you're too young to be joining Penfolds!</label>";
                $form.find("#age-calculate").addClass("error");
			}
			else{
				$form.find("#age-calculate").removeClass("error");
			}
			}
				
		    //End: Validation For age>=18

            if ($form.find('#club-password').is(":visible")) {
                var password_error = false;
                //Password Step 1: Box 1 not empty
                if ($form.find("#club-password").val().trim().length == 0) {
                    password_error = true;
                    $form.find("#club-password, #club-confirm-password").addClass("error");
                    errorMsg += "<label class='error'>" + $form.find("#club-password").data("error-msg") + "</label>";
                }

                //Password Step 2: Box 1 is valid pattern
                if (!password_error) {
                    //If theres already an error, we'll skip
                    var password_pattern_error = false,
                        passwordHasNums = $form.find('#club-password').val(),
                        matches = passwordHasNums.match(/\d+/g);

                    //Length
                    if ($form.find("#club-password").val().length < 8) {
                        password_pattern_error = true;
                    }

                    //No numbers
                    if (matches == null) {
                        password_pattern_error = true;
                    }

                    //No uppercase
                    if ($form.find('#club-password').val().match(/[A-Z]+/) == null) {
                        password_pattern_error = true;
                    }

                    if (password_pattern_error) {
                        password_error = true;
                        $form.find("#club-password, #club-confirm-password").addClass("error");
                        errorMsg += "<label class='error'>" + $form.find("#club-password").data("error-msg") + "</label>";
                    }
                }

                //Password Step 3: Box 2 is same as Box 1
                if (!password_error) {
                    //If theres already an error, we'll skip
                    if (($form.find("#club-password").val()) !== ($form.find("#club-confirm-password").val())) {
                        password_error = true;
                        $form.find("#club-password, #club-confirm-password").addClass("error");
                        errorMsg += "<label class='error'>" + $form.find("#club-password").data("error-nomatch-msg") + "</label>";
                    }
                }
            }

            return errorMsg;
        };
        var validateEmail = function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };
        //$('#penfolds-club #club-show-password').change(function () {
        //    $('#penfolds-club #club-password, #penfolds-club #club-confirm-password').togglePassword($(this).isChecked());
        //});

        $("#penfolds-club #club-country option[value='中国']").remove();

        /* END FRIENDS OF PENFOLDS FORM (?) */
    },
    product_details: function () {
        if (!$('#product-details').length) return;

        $('#product-details .vintage-history .scroll').click(function () {
            var container = $('#product-details .vintage-history .dropdown-menu ul');
            var delta = container.find('li').outerHeight() * ($(this).is('[data-scroll="up"]') ? -1 : 1);
            container.animate({
                scrollTop: container.scrollTop() + delta
            }, 500);
        });

        $('#product-details .tab-container').niceScroll({
            touchbehavior: true,
            sensitiverail: false,
            cursorwidth: 0,
            cursoropacitymax: 0,
            grabcursorenabled: false,
            smoothscroll: false
        });

        $('#product-details a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var $this = $(this), parent = $this.parent();
            $this.closest('.tab-container').scrollLeft(parent.position().left + parseInt(parent.css('margin-left')) - parseInt($this.closest('.nav-tabs').css('padding-left')));
        });

        $('#product-details [data-toggle="replace"]').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            $this.replaceWith($this.data('target'));
        });

        $('#product-details a[data-toggle="collapse"]').next("div").on('shown.bs.collapse', function (e) {
            $("body, html").animate({ scrollTop: $(this).offset().top - 55 });
        });

        var ofspan = $('#description-collapse').wrapInner('<span />').find('span');
        var hasOverflow = $('#description-collapse').height() < ofspan.height();
        if (!hasOverflow) {
            $('#readmore').css('display', 'none');
        }

        $(document).on('click', '#readmore', function () {
            $(this).css('display', 'none');
            $('#description-collapse').addClass('out');
        });

        var rowCount = $('#scores-collapse table tbody').find('tr');
        var rowThreshold = 5; // 5 for testing, change to 10

        if (rowCount.length > rowThreshold) {
            $(rowCount).slice(rowThreshold, rowCount.length).each(function (index, item) {
                $(item).css('display', 'none');
            });
            $('#load-more').removeClass('visuallyhidden');
            $(document).on('click', '#load-more', function (event) {
                var rowsHidden = $('#scores-collapse table').find('tr:hidden');
                $(rowsHidden).slice(0, rowThreshold).each(function (index, item) {
                    $(item).slideDown('slow');
                });
                if (rowsHidden.length <= rowThreshold) {
                    $('#load-more').css('display', 'none');
                }
            });
        }
    },
    product_list: null,
    product_list_filtered: [],
    product_listing_filter: function () {
        if (!$('.productListing-main').length) return;

        var ITEMS_PER_PAGE = 12;
        var currentPage = 1;
        var totalItems = $(".item:not(.visuallyhidden)").length;
        var isRangePage = $('#product-listing').hasClass('range');

        var self = this;
        App.product_list = $('.item');
        var filter = {
            grape_variety: ["all"],
            food_pairing: ["all"],
            occasions: ["all"],
            wine_type: ["all"],
            wine_year: ["all"]
        };
        var filter_labels = {
            grape_variety: ["all"],
            food_pairing: ["all"],
            occasions: ["all"],
            wine_type: ["all"],
            wine_year: ["all"]
        };

        var first = true;

        var createFilterData = function () {
            filter.grape_variety = [], filter.food_pairing = [], filter.occasions = [], filter.wine_type = [], filter.wine_year = [];    // Delete all filters first
            filter_labels.grape_variety = [], filter_labels.food_pairing = [], filter_labels.occasions = [], filter_labels.wine_type = [], filter_labels.wine_year = [];
            $('#accordionRefine input[type=checkbox][checked]').each(function (index, value) {
                var $this = $(this);
                filter[$this.data('category')].push($this.val());
                filter_labels[$this.data('category')].push($this.data('value'));
            });
        };
        var removeRedundantFilterOptions = function () {
            var items = $('.item').find('.slide');

            var wineYearFilters = $('input[data-category=wine_year][data-value!=all]');
            wineYearFilters.each(function (index, value) {
                var count = 0;
                var wineYearFilterVal = $(value).val();
                items.each(function (index, value) {
                    var wineYear = $(this).data('wine-year').split('|');
                    $(wineYear).each(function (index, value) {
                        if (wineYearFilterVal == wineYear) count++;
                    });
                });
                if (count == 0) $(value).parent().parent().remove();
                //$(value).next('label').append(' <span>(' + count + ')</span>');
            });

            var grapeVarietyFilters = $('input[data-category=grape_variety][data-value!=all]');
            grapeVarietyFilters.each(function (index, value) {
                var count = 0;
                var grapeVarietyFilterVal = $(value).val();
                items.each(function (index, value) {
                    var grapeVariety = $(this).data('wine-grape-variety').split('|');
                    $(grapeVariety).each(function (index, value) {
                        if (grapeVarietyFilterVal == grapeVariety) count++;
                    });
                });
                if (count == 0) $(value).parent().parent().remove();
                //$(value).next('label').append(' <span>(' + count + ')</span>');
            });

            var foodPairingFilters = $('input[data-category=food_pairing][data-value!=all]');
            foodPairingFilters.each(function (index, value) {
                var count = 0;
                var foodPairingFilterVal = $(value).val();
                items.each(function (index, value) {
                    var foodPairing = $(this).data('wine-food-pairing').split('|');
                    $(foodPairing).each(function (index, value) {
                        if (foodPairingFilterVal == value) count++;
                    });
                });
                if (count == 0) $(value).parent().parent().remove();
                //$(value).next('label').append(' <span>(' + count + ')</span>');
            });

            var occasionsFilters = $('input[data-category=occasions][data-value!=all]');
            occasionsFilters.each(function (index, value) {
                var count = 0;
                var occasionFilterVal = $(value).val();
                items.each(function (index, value) {
                    var occasion = $(this).data('wine-occasions').split('|');
                    $(occasion).each(function (index, value) {
                        if (occasionFilterVal == value) count++;
                    });
                });
                if (count == 0) $(value).parent().parent().remove();
                //$(value).next('label').append(' <span>(' + count + ')</span>');
            });

            var wineTypeFilters = $('input[data-category=wine_type][data-value!=all]');
            wineTypeFilters.each(function (index, value) {
                var count = 0;
                var wineTypeFilterVal = $(value).val();
                items.each(function (index, value) {
                    var wineType = $(this).data('wine-type').split('|');
                    $(wineType).each(function (index, value) {
                        if (wineTypeFilterVal == value) count++;
                    });
                });
                if (count == 0) $(value).parent().parent().remove();
                //$(value).next('label').append(' <span>(' + count + ')</span>');
            });
        };

        var filterProducts = function (viewAll) {
            App.product_list.addClass('visuallyhidden');
            App.product_list_filtered = [];
            $(".no-results-all").addClass('visuallyhidden');
            if (App.isDesktop || App.isTablet) {
                showPaginationContainer();
            }
            $('.pagination-showpages').hide();
            $('.pagination').show();

            $.grep(App.product_list, function (element, index) {
                var $elem = $(element);
                var $elemSlide = $elem.find(".slide");

                var productGrapeVariety = $elemSlide.data("wine-grape-variety").split("|");
                var isGrapeVarietyMatch = false;
                $(productGrapeVariety).each(function (i, item) {
                    if ($.inArray(item, filter.grape_variety) > -1) isGrapeVarietyMatch = true;
                });

                var productFoodPairing = $elemSlide.data("wine-food-pairing").split("|");
                var isFoodPairingMatch = false;
                $(productFoodPairing).each(function (i, item) {
                    if ($.inArray(item, filter.food_pairing) > -1) isFoodPairingMatch = true;
                });

                var productOccasion = $elemSlide.data("wine-occasions").split("|");
                var isOccasionMatch = false;
                $(productOccasion).each(function (i, item) {
                    if ($.inArray(item, filter.occasions) > -1) isOccasionMatch = true;
                });

                var productWineStyle = $elemSlide.data("wine-type").split("|");
                var isWineStyleMatch = false;
                $(productWineStyle).each(function (i, item) {
                    if ($.inArray(item, filter.wine_type) > -1) isWineStyleMatch = true;
                });

                var productYear = $elemSlide.data("wine-year").split("|");
                var isYearMatch = false;
                $(productYear).each(function (i, item) {
                    if ($.inArray(item, filter.wine_year) > -1) isYearMatch = true;
                });

                if ((isGrapeVarietyMatch || filter.grape_variety == 'all') && (isFoodPairingMatch || filter.food_pairing == 'all') &&
                (isOccasionMatch || filter.occasions == 'all') && (isWineStyleMatch || filter.wine_type == 'all') && (isYearMatch || filter.wine_year == 'all')) {
                    $elem.addClass("displayblock").removeClass("visuallyhidden");
                    App.product_list_filtered.push($elem);
                }
            });

            if (App.product_list_filtered.length == 0 && !isRangePage) { // If no results at all, show message and hide pagination
                $(".no-results-all").removeClass('visuallyhidden');
                hidePaginationContainer();
            }
            if (App.product_list_filtered.length < ITEMS_PER_PAGE) {
                hidePaginationContainer();
            }

            totalItems = $(".item:not(.visuallyhidden)").length;
            populatePaginationDropdown();
            if (!viewAll) createPagination();

            if (App.isMobile) {
                $(".item").removeClass("active");
                $(".carousel-control").attr('style', 'display: none !important;');
            }
        };

        var initRangeLandingPage = function () {
            if (!isRangePage) {
                return
            }

            var count = $('.item').length;

            if (App.isDesktop || App.isTablet) {
                $(".carousel-control").attr('style', 'display: none !important;');
                populatePaginationDropdown();
            }

            if (count > ITEMS_PER_PAGE && (App.isDesktop || App.isTablet)) {
                showPaginationContainer();
                filterProducts(false);
            }

            createPagination();

            if (App.isMobile) {
                hidePaginationContainer();
                $(".item").first().addClass("active");//.css("display","block");
                if (count == 1) {
                    $(".carousel-control").attr('style', 'display: none !important;');
                }
            }
        };

        var toggleRefineSection = function (elem, onlyHide) {
            var $this = $(elem);
            var $accordionrefine = $("#accordionRefine");
            var $topcaret = $(".refineWrap .top-caret");
            if ($this.hasClass("open") || onlyHide) {
                $this.removeClass("open");
                $topcaret.hide();
                $accordionrefine.hide();
            } else {
                $this.addClass("open");
                if (App.isDesktop || App.isTablet) $(".panel-collapse").removeClass("collapse").addClass("in");
                $topcaret.show();
                $accordionrefine.show();
            }
        };

        var hidePaginationContainer = function () {
            $("#product-listing .paginationWrap").attr('style', 'display: none');
        };
        var showPaginationContainer = function () {
            $("#product-listing .paginationWrap").attr('style', 'display: block');
        };
        var hideExtraContent = function () {
            $(".heroWrap, .promoWrap").animate({ opacity: 0 }, 500, function () {
                $(".heroWrap, .promoContent, .twoColumnPromoWrap").addClass("hide");
                if (App.isDesktop || App.isTablet) {
                    $(".filterWrap .filterContent").css("top", "14px");
                }
                //$("#product-listing .paginationWrap").attr('style', function(i, s) { return 'display: block !important;'; });
                //Stop the carousel
                if (App.isDesktop || App.isTablet) {
                    $(".carousel").hammer().off("drag swipe");
                    $(".carousel").carousel({ interval: false });
                    $(".carousel").carousel('pause');
                    $(".carousel").on('mouseleave', function () {
                        $(this).carousel('pause');
                    });
                    $(".carousel").removeClass('carousel');
                    $(".carousel-control").remove();
                    //showPaginationContainer();
                }
                //$(".singleProductRangeWrap").animate({ opacity: 1 }, 500);
            }).addClass('visuallyhidden');
        };

        var hideRangeWithNoItems = function () {
            $(".singleProductRangeWrap").each(function () {
                var $this = $(this);
                $this.show();
                $this.find('.no-results').addClass('visuallyhidden');
                $this.find(".carousel-control").attr('style', 'display: block  !important');

                var count = $this.find(".item:not(.visuallyhidden)").length;
                if (count == 0) {
                    // Hide the whole section if on the ALL RANGES page, else just show the no_results message
                    if (isRangePage) {
                        $this.find('.no-results').removeClass('visuallyhidden');
                    } else {
                        $this.hide();
                    }
                }
                if (count < 2 && App.isMobile) {
                    $this.find(".carousel-control").attr('style', 'display: none !important'); // Hide the left/right arrows if there is only 1 (or none) item
                }
                if (App.isDesktop || App.isTablet)
                    $this.find(".carousel-control").attr('style', 'display: none !important');
            });
        };

        var populatePaginationDropdown = function () {
            var numOfPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
            var pagListItems = "";
            for (var i = 0; i < numOfPages; i++) {
                pagListItems += "<li><a href='#'>" + (i + 1) + "</a></li>";
            }
            $(".pagination ul.dropdown-menu").html(pagListItems);
            $(".pagination .totalPages").html(numOfPages);
        };
        var createPagination = function () {
            if (App.isDesktop || App.isTablet) {    // Dont do any pagination if on mobile
                $(App.product_list_filtered).each(function (index, item) {
                    $(item).addClass('visuallyhidden');
                });

                var startFrom = (currentPage - 1) * ITEMS_PER_PAGE;
                var endOn = startFrom + ITEMS_PER_PAGE;

                $(App.product_list_filtered).slice(startFrom, endOn).each(function (index, item) {
                    $(item).removeClass('visuallyhidden');
                });
            }

            hideRangeWithNoItems();
        };
        var updateCurrentPage = function () {
            $('.pagination .dropdown-toggle').text(currentPage);  // Update the page number on the dropdown (for both top and bottom pagination)
        };
        var generateFilterSelections = function () {
            var $container = $(".selected-filters");
            var filterHtml = "";
            for (var i = 0; i < filter_labels.grape_variety.length; i++) {
                if (filter_labels.grape_variety[i] != "all")
                    filterHtml += "<li><a href='#'>" + filter_labels.grape_variety[i] + "<span></span></a></li>";
            }
            for (var j = 0; j < filter_labels.food_pairing.length; j++) {
                if (filter_labels.food_pairing[j] != "all")
                    filterHtml += "<li><a href='#'>" + filter_labels.food_pairing[j] + "<span></span></a></li>";
            }
            for (var k = 0; k < filter_labels.occasions.length; k++) {
                if (filter_labels.occasions[k] != "all")
                    filterHtml += "<li><a href='#'>" + filter_labels.occasions[k] + "<span></span></a></li>";
            }
            for (var l = 0; l < filter_labels.wine_type.length; l++) {
                if (filter_labels.wine_type[l] != "all")
                    filterHtml += "<li><a href='#'>" + filter_labels.wine_type[l] + "<span></span></a></li>";
            }
            for (var m = 0; m < filter_labels.wine_year.length; m++) {
                if (filter_labels.wine_year[m] != "all")
                    filterHtml += "<li><a href='#'>" + filter_labels.wine_year[m] + "<span></span></a></li>";
            }
            $container.find("ul").html(filterHtml);
            $container.show();
        };

        var refineByOnChange = function (obj) {
            var $this = obj;

            if ($this.is(":checked")) {
                if ($this.val() == 'all') {
                    $('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][value!="all"]').removeAttr('checked').prop("checked", false);
                } else {
                    $('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][value="all"]').removeAttr('checked').prop("checked", false);
                }
                $this.attr('checked', 'checked').prop("checked", true);
            }
            else {
                $this.removeAttr('checked').prop("checked", false);
            }

            if ($('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][checked]').length == 0) {
                $('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][value!="all"]').removeAttr('checked').prop("checked", false);
                $('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][value="all"]').attr('checked', 'checked').prop("checked", true);
            }

            if (first) {
                hideExtraContent();
                first = false;
            }
            createFilterData();
            currentPage = 1;
            updateCurrentPage();
            filterProducts(false);
            if (App.isMobile)
                generateFilterSelections();
        };

        $(document).on('click', '.pagination ul.dropdown-menu a', function (e) {
            currentPage = $(this).text();
            updateCurrentPage();
            createPagination();
        });
        $(document).on('click', '.pagination .view-all', function (e) {
            currentPage = 1;
            updateCurrentPage();
            filterProducts(true);
            hideRangeWithNoItems();
            $('.pagination').hide();
            $('.pagination-showpages').show();
        });
        $(document).on('click', '.pagination-showpages .view-pages', function (e) {
            createPagination();
            $('.pagination-showpages').hide();
            $('.pagination').show();
        });
        $(document).on('change', '#accordionRefine input[type="checkbox"]', function () {
            refineByOnChange($(this));
        });
        $(document).on('click', '.selected-filters a', function (e) {
            var $this = $(this);
            var filterText = $(this).text();
            var filterCheckbox = $('#accordionRefine input[type="checkbox"][data-value="' + filterText + '"]');
            filterCheckbox.removeAttr('checked').prop("checked", false); // Uncheck the filter option
            refineByOnChange($(filterCheckbox));
            $this.parent().remove();
        });
        $(".allRangeWrap .btn-group").on("click", function () {
            toggleRefineSection($("#refineButton"), true);  // Hide the refine wines section if it is open
        });
        $("#accordionRefine .panel-title a").on("click", function (e) {
            $("#accordionRefine").css("display", "block");
        });
        $("#refineButton").on("click", function (e) {
            toggleRefineSection(this, false);
        });

        initRangeLandingPage();
        createFilterData();
        //removeRedundantFilterOptions();
        if (App.isMobile) $(".carousel-control").attr('data-slide-increment', '1');
    },
    restaurant_details: function () {
        if (!$('#restaurant-details').length) return;

        var vineyard = {
            id: '0',
            name: 'Magill Estate',
            coordinates: { lat: -34.920975, lon: 138.678863 },
            address: '78 Penfold Road, Magill, 5072, Australia',
            info: '+61 8 8301 5400',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus urna vitae mi auctor tristique. Donec id enim felis. Donec adipiscing purus nisl, quis dignissim nulla consectetur eget'
        };

        // Create map
        google.maps.event.addDomListener(window, 'load', function () {
            map = new google.maps.Map($('#restaurant-details .images .map')[0], {
                zoom: 9,
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE
                },
                styles: [
                    {
                        "stylers": [
                            { "saturation": -100 }
                        ]
                    },
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ]
            });

            // Add all vineyards to map
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(vineyard.coordinates.lat, vineyard.coordinates.lon),
                map: map,
                title: vineyard.name,
                icon: '/includes/penfolds/images/maps-marker.png'
            });

            centerMap();
        });

        $(window).resize(centerMap);

        function centerMap() {
            if (map && vineyard) {
                map.setCenter(new google.maps.LatLng(vineyard.coordinates.lat, vineyard.coordinates.lon));
            }
        }
    },
    vineyard_details: function () {
        if ($('#vineyard-details').length > 0) {
            $("#instagram-carousel .item").first().addClass("active");
            // Create map
            google.maps.event.addDomListener(window, 'load', function () {
                map = new google.maps.Map($('#vineyard-details .side-container .map')[0], {
                    zoom: 9,
                    scrollwheel: false,
                    disableDefaultUI: true,
                    zoomControl: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE
                    },
                    styles: [
                        {
                            "stylers": [
                                { "saturation": -100 }
                            ]
                        },
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [
                                { visibility: "off" }
                            ]
                        }
                    ]
                });

                // Add all vineyards to map
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(vineyard.Lat, vineyard.Lon),
                    map: map,
                    title: vineyard.name,
                    icon: '/includes/penfolds/images/maps-marker.png'
                });

                centerMap();
            });

            $(window).resize(centerMap);

            var centerMap = function () {
                if (map && vineyard) {
                    map.setCenter(new google.maps.LatLng(vineyard.Lat, vineyard.Lon));
                }
            }
        }
    },
    vineyards: function () {
        if (!$('#vineyards #locations .map').length) return;

        var filter = {
            location: ["all"],
            range: ["all"],
            style: ["all"],
            varietal: ["all"]
        };
        var filtered_vineyards = [];    // Contains the list of vineyards after filtering
        var vineyards_markers = [];     // Contains the Google Map Marker objects

        var map = null, selectedVineyard = null,
            infowindow = new InfoBox({
                maxWidth: 0,
                boxStyle: {
                    background: '#fff',
                    opacity: 1,
                    width: "240px"
                },
                pixelOffset: new google.maps.Size(-120, -45),
                closeBoxURL: "",
                enableEventPropagation: true,
                infoBoxClearance: new google.maps.Size(1, 1),
                alignBottom: true
            });

        // Create map
        google.maps.event.addDomListener(window, 'load', function () {
            map = new google.maps.Map($('#vineyards #locations .map')[0], {
                zoom: 6,
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE
                },
                styles: [
                    {
                        "stylers": [
                            { "saturation": -100 }
                        ]
                    },
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ]
            });

            renderMarkers(filterList(vineyardsList));

            // Select first one in list to center on
            selectVineyard(vineyardsList[0]);
        });

        $(window).resize(centerMap);

        function renderMarkers(filterVineyards) {
            // Delete all previous markers first
            for (var i = 0; i < vineyards_markers.length; i++) {
                vineyards_markers[i].setMap(null);
            }
            // Add all vineyards to map
            $.each(filterVineyards, function (index, vineyard) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(vineyard.Lat, vineyard.Lon),
                    map: map,
                    title: vineyard.Name,
                    icon: '/includes/penfolds/images/maps-marker.png'
                });

                //var description = '<a href="#" class="close">×</a><div class="dialog"><h5>' + vineyard.name + '</h5><div class="content"><p>' + vineyard.address + '<br/>' + vineyard.info + '</p>' + (vineyard.description?'<p>'+vineyard.description+'</p>':'') + '</div></div>';
                var description = '<a href="#" class="close">×</a><div class="dialog"><h5>' + vineyard.Name + '</h5><div class="content"><p>' + vineyard.Address + '</p></div></div>';
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(description);
                    infowindow.open(map, marker);
                });

                vineyards_markers.push(marker);
            });
        }

        function filterList(list) {
            var filtered_list = [];
            $.grep(list, function (element, index) {
                var addItem = false;

                if ($.inArray(element.Filters.Location, filter.location) > -1 || filter.location == 'all') {
                    if (filter.range != 'all') {
                        var elementFilterRange = element.Filters.Range.split('|');
                        $.grep(filter.range, function (elementRange, indexItem) {
                            if ($.inArray(elementRange, elementFilterRange) > -1) {
                                addItem = true;
                            }
                        });
                    }
                    else
                        addItem = true;
                    if (addItem) {
                        addItem = false;
                        if (filter.style != 'all') {
                            var elementFilterStyle = element.Filters.Style.split('|');
                            $.grep(filter.style, function (elementStyle, indexItem) {
                                if ($.inArray(elementStyle, elementFilterStyle) > -1) {
                                    addItem = true;
                                }
                            });
                        }
                        else
                            addItem = true;

                        if (addItem) {
                            addItem = false;
                            if (filter.varietal != 'all') {
                                var elementFilterVarietal = element.Filters.Varietal.split('|');
                                $.grep(filter.varietal, function (elementVarietal, indexItem) {
                                    if ($.inArray(elementVarietal, elementFilterVarietal) > -1) {
                                        addItem = true;
                                    }
                                });
                            }
                            else
                                addItem = true;

                            if (addItem) {
                                filtered_list.push(element);
                            }
                        }
                    }
                    else {
                    }
                }
                //if (($.inArray(element.Filters.Location, filter.location) > -1 || filter.location == 'all') &&
                //  ($.inArray(element.Filters.Range, filter.range) > -1 || filter.range == 'all') &&
                //  ($.inArray(element.Filters.Style, filter.style) > -1 || filter.style == 'all') &&
                //  ($.inArray(element.Filters.Varietal, filter.varietal) > -1 || filter.varietal == 'all')) {
                //    console.log("***************================added" + element.Name);
                //  filtered_list.push(element);
                //}
            });

            return filtered_list;
        }

        function centerMap() {
            if (map && selectedVineyard) {
                map.setCenter(new google.maps.LatLng(selectedVineyard.Lat, selectedVineyard.Lon));
            }
        }

        function selectVineyard(vineyard) {
            selectedVineyard = vineyard;
            centerMap();
        }

        function createFilterData() {
            filter.location = [], filter.range = [], filter.style = [], filter.varietal = [];
            $('#vineyards .controls [type=checkbox][checked]').each(function (index, value) {
                var $this = $(this);
                filter[$this.data('category')].push($this.val());
            });
        }

        // Stopping all click events for dropdown menu
        $(document).on('click.bs.dropdown.data-api', '#vineyards .map-container', function (e) {
            e.stopPropagation()
        });

        $('#vineyards #controls-collapse').on('hidden.bs.collapse', function () {
            // use setTimeout() to execute
            var timer = setTimeout(function () {
                clearTimeout(timer);
                google.maps.event.trigger(map, 'resize');
            }, 250);
        })

        // Adding events for checkboxes
        $('#vineyards .controls [type="checkbox"]').change(function () {
            var $this = $(this);
            if ($('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][checked]').length == 0) {
                $('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][value!="all"]').removeAttr('checked').prop("checked", false);
                $('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][value="all"]').attr('checked', 'checked').prop("checked", true);
            }

            if ($this.attr("checked")) {
                if ($this.val() == 'all')
                    $('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][value!="all"]').removeAttr('checked').prop("checked", false);
                else
                    $('input[type="checkbox"][data-category="' + $this.attr('data-category') + '"][value="all"]').removeAttr('checked').prop("checked", false);
            }
            createFilterData();
            renderMarkers(filterList(vineyardsList));
        });
        createFilterData();
    },

    timeline: function () {
        /*PENFOLDS TIMELINE */
        var isiPad = /ipad/i.test(navigator.userAgent.toLowerCase()),
		carouselTimeline = function () {
		    if ($(".new-timeline").hasClass("beginning")) {
		        var currentHeight = $(".timeline-intro-container").height();
		        $(".elastislide-list").css({ "height": currentHeight });
		        $(".timeline-intro").animate({ "opacity": 1 }, 2000);
		        $(".timeline-intro-container .arrow-down-content, .timeline-intro-container h4").click(function () {
		            $(".timeline-carousel-container").css({ "opacity": 1 });
		            $(".timeline-intro-container").animate({ marginTop: -currentHeight }, 500, function () {
		                $(".timeline-intro-container").css('display', 'none');
		                $(".timeline").removeClass("beginning");
		                $(".elastislide-list").css({ "height": "100%" });
		                if (!isMobileDevice()) {
		                    $(".elastislide-list .area-heading").show().css({ "height": "100%" });
		                } else {
		                    $(".elastislide-list .area-heading").show().css({ "min-height": "160px" });
		                }
		            });
		        })
		    }
		    if (isiPad) {
		        $(".new-timeline .arrow-content .arrow").addClass("arrow-ipad");
		    }
		}

        if (isMobileDevice()) {
            $(window).load(function () {
                carouselTimeline();
                $(".new-timeline").addClass("timeline-mobile");
                setTimeout(function () {
                    var args = {
                        fx: 'carousel',
                        slides: "> div ",
                        next: "#nexttimeline",
                        prev: "#prevtimeline",
                        pager: "#pagination",
                        pagerTemplate: "#per-slide-template",
                        carouselVisible: 1,
                        timeout: 0,
                        swipe: true,
                        autoHeight: 0,
                        carouselFluid: true
                    }

                    $(".timeline-slideshow").cycle(args)

                    $('#pagination a').each(function () {
                        $(this).attr('data-pagination-offset-left', $(this).position().left);
                    });
                }, 500);
            });
        } else {
            $(window).load(function () {
                carouselTimeline();
                setTimeout(function () {
                    var args = {
                        fx: 'carousel',
                        slides: "> div ",
                        next: "#nexttimeline",
                        prev: "#prevtimeline",
                        pager: "#pagination",
                        pagerTemplate: "#per-slide-template",
                        carouselVisible: 1,
                        carouselVertical: true,
                        timeout: 0,
                        carouselFluid: true
                    }

                    $(".timeline-slideshow").cycle(args);
                    $('#pagination a').each(function () {
                        $(this).attr('data-pagination-offset-top', $(this).position().top)
                    });
                    $('.pagination-wrapper .scroll').click(function () {
                        var container = $('.pagination-wrapper #pagination');
                        var delta = container.find('a').outerHeight() * ($(this).is('[data-scroll="up"]') ? -1 : 1);
                        container.animate({
                            scrollTop: container.scrollTop() + delta
                        }, 500);
                    });

                    $(".new-timeline .pagination-dot-container:not('.cycle-pager-active')").hover(function () {
                        if (!isiPad) {
                            $(this).find(".pagination-year").show();
                        }
                    }, function () {
                        if (!isiPad) {
                            $(this).find(".pagination-year").hide();
                        }
                    })
                }, 500);
            });

            $(window).resize(function () {
                carouselTimeline();
            })
        }

        $(".timeline-slideshow").on('cycle-after', function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
            if ($(".new-timeline").hasClass("timeline-mobile")) {
                var offset = $('#pagination .cycle-pager-active').attr('data-pagination-offset-left'),
                    width = $('#pagination').outerWidth(),
                    new_offset = (offset - (width / 2));

                $('#pagination').animate({ scrollLeft: new_offset + 10 });
            } else {
                var offset = $('#pagination .cycle-pager-active').attr('data-pagination-offset-top'),
                    height = $('#pagination').outerHeight(),
                    new_offset = (offset - (height / 2));

                $('#pagination').animate({ scrollTop: new_offset + 5 });
            }
        });

        function isMobileDevice() {
            return (jQuery.browser.mobile);
        }
        /*PENFOLDS TIMELINE */
    },

    end: function () {
        //if (!$('#test').length)   return;
    }
}

$(document).ready(function () {
    App.init();
});

// Search Box JS
$(document).ready(function () {
    $(document).on("click", '#search-button', function (e) {
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