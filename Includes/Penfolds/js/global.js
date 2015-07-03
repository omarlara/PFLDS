//Prevent being loaded in an iframe
if (top != self) { top.location.replace(self.location.href); }

$(function () {


    $("#form1").validate({
        onsubmit: false
    });

    // GLOBAL FUNCTIONS
    window.showLoginModal = function () {
        $('#login-modal').modal('show');
    }

    window.hideLoginModal = function () {
        $('#login-modal').modal('hide');

    }

    window.showForgotPasswordModal = function () {
        $('#login-modal').modal('show');
        $('#login-modal .login').addClass('hide');
        $('#login-modal .forgot-password').removeClass('hide');
        $('#login-modal .forgot-password input').focus();
        $('#login-modal').validate().resetForm();
    }

    window.hideForgotPasswordModal = function () {
        hideLoginModal();
    }

    window.resetLoginModal = function () {
        $("#emailAddr-login").val("");
        $("#password-login").val("");
        $('#login-modal-error').css({ display: "none" });

        $('#login-modal .login, #login-modal .forgot-password form').removeClass('hide');
        $('#login-modal .forgot-password, #login-modal .forgot-password .emailed').addClass('hide');
        $('#login-modal .btn.cancel').addClass('hide');
        $('#login-modal').validate().resetForm();
    }

    window.CC = {
        MASTERCARD: 0x0001,
        VISA: 0x0002,
        AMEX: 0x0004,
        DINERSCLUB: 0x0008,
        ENROUTE: 0x0010,
        DISCOVER: 0x0020,
        JCB: 0x0040,
        UNKNOWN: 0x0080
    }

    window.getCreditCardName = function (type) {
        var name = null;
        $.each(CC, function (index, value) {
            if (value == type) {
                name = index + '';
                return false;
            }
        });
        return name;
    }

    window.getCreditCardType = function (value, validTypes) {
        if (/[^0-9\-]+/.test(value)) {
            return null;
        }

        value = value.replace(/\D/g, "");
        if (validTypes & 0x0001 && /^(5[12345])/.test(value) && value.length === 16) { //mastercard
            return CC.MASTERCARD;
        } else if (validTypes & 0x0002 && /^(4)/.test(value) && value.length === 16) { //visa
            return CC.VISA;
        } else if (validTypes & 0x0004 && /^(3[47])/.test(value) && value.length === 15) { //amex
            return CC.AMEX;
        } else if (validTypes & 0x0008 && /^(3(0[012345]|[68]))/.test(value) && value.length === 14) { //dinersclub
            return CC.DINERSCLUB;
        } else if (validTypes & 0x0010 && /^(2(014|149))/.test(value) && value.length === 15) { //enroute
            return CC.ENROUTE;
        } else if (validTypes & 0x0020 && /^(6011)/.test(value) && value.length === 16) { //discover
            return CC.DISCOVER;
        } else if (validTypes & 0x0040 && ((/^(3)/.test(value) && value.length === 16) || (/^(2131|1800)/.test(value) && value.length === 15))) { //jcb
            return CC.JCB;
        }

        return null;
    }

    var scrollToTop = $("#scroll-to-top");
    $(window).scroll(function () {
        scrollToTop.toggleClass("active", $(this).scrollTop() >= 400);
    });

    // Add hovernav to all navbar elements to create hover effect on navigation
    var hoverTimer;
    $('#navigation-collapse').hover(function () {
        var $this = $(this);
        hoverTimer = setTimeout(function () {
            $this.addClass('hover');
        }, 300);
    }, function () {
        clearTimeout(hoverTimer);
        $(this).removeClass('hover');
    });
    //$('ul.navbar-nav li, #minicart-container').addClass('hovernav');

    // Search functionality
    var $suggestions = $('#header #search-bar .suggestions');
    var $search = $('#header #search-bar [type="search"]');

    function searchFocus() {
        $search.focus();
    }

    function searchReset() {
        $search.val('');
        $suggestions.addClass('hide');
        searchFocus();
    }



    $('#header #search-bar').on('shown.bs.collapse', searchFocus).on('hidden.bs.collapse', searchReset);
    $('#header #search-bar [type="reset"]').click(function () {
        $('#header [data-toggle="collapse"][data-target="#search-bar"]').click();
    });
    // TODO: fix this focus bug that doesn't fire.
    $search.on('keyup focus blur', function () {
        var $this = $(this);
        if ($this.is(":focus") && $this.val().length != 0) {
            $suggestions.removeClass('hide');
        } else if ($this.val().length == 0) {
            $suggestions.addClass('hide');
        }
    });

    // Add scroll to functionality for all anchor tags
    $(document).on('click', 'a[href^="#"]', function (e) {
        e.preventDefault();
        if ($(this).attr('href') != '#') {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top
            }, 1000);
        }
    });

    $(document).on('click', 'a, input, button', function (e) {
        if ($(this).is("[disabled]") || $(this).is(".disabled")) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
    });

    if (!$("#product-listing").hasClass("range")) {
        $('.carousel').hammer({
            drag_min_distance: 1,
            swipe_velocity: 0.1
        }).on("drag swipe", function (e) {
            // only horizontal swipe
            if (Hammer.utils.isVertical(e.gesture.direction)) {
                return;
            }

            // prevent scrolling, so the drag/swipe handler is getting called
            e.gesture.preventDefault();
            // swipe!
            if (e.type == 'swipe') {
                switch (e.gesture.direction) {
                    case 'left':
                        if (!App.isMobile) {
                            $(this).find('.carousel-control.right.hidden-xs').trigger('click');
                        } else {
                            $(this).find('.carousel-control.right.visible-xs').trigger('click');
                        }
                        break;
                    case 'right':
                        if (!App.isMobile) {
                            $(this).find('.carousel-control.left.hidden-xs').trigger('click');
                        } else {
                            $(this).find('.carousel-control.left.visible-xs').trigger('click');
                        }
                        break;
                }
            }

        }).on('tap', function (e) {
            //e.preventDefault();
            var currentURL = $(e.target).attr("data-url");
            if (typeof currentURL !== 'undefined') {
                window.location = currentURL;
            }
        });
    }

    /* Video modal stuff */
    $('a[data-target="#video-modal"]').on('click', function (e) {
        var vidId = $(this).data("video-id");
        $('#video-modal .youtube-player').data('video-id', vidId);
    });


    /* FORM STUFF */
    $.validator.addMethod('checkboxes', function (value, elem, params) {
        var $elem = $(elem),
			isChecked = $elem.attr('checked');

        if (isChecked) {
            $elem.siblings('.checkbox').removeClass('error');
            return true;
        } else {
            $elem.siblings('.checkbox').addClass('error');
            return false;
        }
    });

    $.validator.addMethod('selectbox', function (value, elem, params) {
        var $elem = $(elem),
			isSelected = $elem.val() !== '';

        if (isSelected) {
            $elem.parent('.select-box').removeClass('error');
            return true;
        } else {
            $elem.parent('.select-box').addClass('error');
            return false;
        }
    });

    $.validator.addMethod('passwordRegex', function (value, elem, params) {
        // regex to check for minimum of 8 characters, all alphanumeric, numbers and special characters, no whitespace, 1 uppercase, 1 lowercase and one number minimum
        return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9~`!@#$%^&*()+=_-{}\[\]\|:;”’?\/<>,.]{8,}$/.test($(elem).val());
    });

    $.validator.addMethod('phone', function (value, elem, params) {
        if (/[^0-9\-]+/.test(value)) {
            return false;
        }

        value = value.replace(/\D/g, "");
        // Check if phone number is valid, min 7 max 8 numbers
        return (value.length == 0 && this.optional(elem)) || (value.length >= 7 && value.length <= 16);
    });

    var validCardTypes = CC.AMEX | CC.MASTERCARD | CC.VISA;

    $.validator.addMethod("creditcardtypes", function (value, element, param) {
        var type = getCreditCardType(value, validCardTypes);
        var name = type ? getCreditCardName(type) : 'none';
        $(element).trigger('creditcardchange', [name]);
        return type;
    }, "Please ensure the credit card number is correct");

    $.validator.addMethod("cvv", function (value, element, param) {
        if (/[^0-9\-]+/.test(value)) {
            return false;
        }

        value = value.replace(/\D/g, "");

        // Get CC type
        switch (getCreditCardType($('.vCreditCard').val(), validCardTypes)) {
            case CC.AMEX:
                return value.length === 4;
                break;
            case CC.MASTERCARD:
            case CC.VISA:
            case CC.DINERSCLUB:
                return value.length === 3;
                break;
            default:
                return false;
        }

        return false;
    }, "Please check the CVV is correct");

    /*$.validator.methods.maxlength = function(value, element, param) {
	 var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
	 return this.optional(element) || length <= param;
	 }*/

    $.validator.addClassRules({
        vEmail: {
            email: true,
            required: true
        },
        vNumber: {
            number: true,
            required: true
        },
        vCheckbox: {
            checkboxes: true
        },
        vSelectbox: {
            selectbox: true
        },
        vPassword: {
            passwordRegex: true
        },
        vCreditCard: {
            creditcardtypes: true
        },
        vCVV: {
            cvv: {
                depends: function () {
                    return $('.vCreditCard.valid').length != 0;
                }
            }
        },
        vPhone: {
            number: {
                depends: function () {
                    return $('.vPhone').length != 0
                }
            }
        }
    });

    // Form Validator Defaults
    $('form:not(.ignore)').each(function () {
        $(this).validate({
            ignore: ".ignore,:hidden,#footerEmail",
            errorLabelContainer: $(this).find(".errors"),
            messages: {
                title: "Please select a title.",
                firstname: "Please enter your first name.",
                lastname: "Please enter your last name.",
                country: "Please select your country.",
                address: "Please enter your address.",
                city: "Please enter your city.",
                state: "Please select your state.",
                zipcode: "Please enter your post code.",
                postcode: "Please enter your post code.",
                phone: "Please enter a valid phone number.",
                vPhone: "Please enter a valid phone number.",
                email: "Please enter a valid email address.",
                birthmonth: "Please select your birth month.",
                birthyear: "Please select your birth year.",
                password: "Please enter a valid password.<br/>Passwords must be 8 characters or more and have at least one lowercase letter, one uppercase letter and one number.",
                confirmpassword: "The passwords that you have entered do not match, please try again.",
                creditcard: { required: "Please enter a valid credit card number." },
                cvs: { required: "Please enter a valid cvv number." }
            },
            rules: {
                field: {
                    maxlength: 4
                },
                phone: {
                    integer: true
                }
            }
        });
    });

    // footer email
    /*$('#frmFriendsOfPenfolds').validate({
        invalidHandler: function(event, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                $('#frmFriendsOfPenfolds label.error').show();
            } else {
                $('#frmFriendsOfPenfolds label.error').hide();
            }
        },
        rules: {
            email: {
                required: true,
                email: true
            }
        }
    });
    
    $('.friends-of-penfolds').validate({
        invalidHandler: function (event, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                $('#frmFriendsOfPenfolds label.error').show();
            } else {
                $('#frmFriendsOfPenfolds label.error').hide();
            }
        },
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            email: "Please enter a valid email address"
        }
    });*/

    // Listen for all reset events, uncheck all checkboxes
    $("form").bind("reset", function (e) {
        $(this).find('[type="checkbox"][checked="checked"]').removeAttr('checked').change();
    });

    // CHECKBOX & RADIO BUTTONS
    // TODO: change this to use the checkbox change event, make sure it works on mobile
    $('[type="checkbox"]').on('keyup', function (e) {
        if (e.which == 32) {
            $(this).siblings('label').hammer().trigger('tap');
        }
    });

    $('[type="checkbox"] ~ label').hammer().on('tap', function (e) {
        if ($(e.target).is('label')) {
            var $this = $(this), $checkbox = $this.siblings('[type="checkbox"]');
            $checkbox.attr('checked', !$checkbox.attr('checked'));
        }
    });

    $('[type="radio"]').on('keyup', function (e) {
        if (e.which == 32) {
            $(this).siblings('label').hammer().trigger('tap');
        }
    });

    $('[type="radio"] ~ label').hammer().on('tap', function (e) {
        if ($(e.target).is('label')) {
            var $this = $(this),
				$radio = $this.siblings('[type="radio"]');
            // Remove all other checked radio under form
            $('[type="radio"][name="' + $radio.attr('name') + '"]').removeAttr('checked');
            $radio.attr('checked', 'checked');
        }
    });

    // TODO: need to fix breadcrumb to use more CSS
    /* Breadcrumbs */
    if ($.fn.niceScroll) {
        $('.breadcrumb-container').niceScroll({
            touchbehavior: true,
            sensitiverail: false,
            cursorwidth: 0,
            cursoropacitymax: 0,
            grabcursorenabled: false,
            smoothscroll: false
        });
    }

    // Serialize form into json
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    // Function to change password field to text
    $.fn.togglePassword = function (showPass) {
        return this.each(function () {
            var $this = $(this);
            if ($this.attr('type') == 'text' || $this.attr('type') == 'password') {
                var clone = null;
                if ((showPass == null && ($this.attr('type') == 'text')) || (showPass != null && !showPass)) {
                    clone = $('<input type="password" />');
                } else if ((showPass == null && ($this.attr('type') == 'password')) || (showPass != null && showPass)) {
                    clone = $('<input type="text" />');
                }
                $.each($this.prop("attributes"), function () {
                    if (this.name != 'type') {
                        clone.attr(this.name, this.value);
                    }
                });
                clone.val($this.val());
                $this.replaceWith(clone);
            }
        });
    };

    $.fn.isChecked = function () {
        var $this = $(this);
        return ($this.attr('type') == 'checkbox' || $this.attr('type') == 'radio') && Boolean($this.attr('checked'));
    }

    // Popover
    if ($.fn.popover) {
        $('[data-toggle="popover"]').popover().on('shown.bs.popover', function () {
            var $popover = $(this), data = $popover.data('bs.popover');
            data.tip().click(function () {
                $popover.popover('hide');
            });
        }).on('show.bs.popover', function () {
            $(this).addClass('open');
        }).on('hide.bs.popover', function () {
            $(this).removeClass('open');
        });
    }

    // Numeric input
    if ($.fn.numeric) {
        $("input.numeric").numeric();
    }

    // Carousel Counter
    if ($.fn.carousel && $('.carousel .count').length != 0) {
        $('.carousel').bind('slid.bs.carousel', function () {
            var $this = $(this);
            var index = $this.find('.item.active').index() + 1;
            var total = $this.find('.item').length;
            $this.find('.count').html(index + '/' + total);
        }).trigger('slid.bs.carousel'); // set initial count
    }

    $(document).on("click", '.form-inline.friends-of-penfolds .btn-submit-form', function (e) {
        e.preventDefault();
        if ($('.form-inline.friends-of-penfolds .vEmail').valid()) {
            var obj = $(this);
            var email = obj.prev().find('.vEmail').val()
            var url = obj.data('fop-url');
            window.location = url + "?email=" + email;
        } else {
            $('.form-inline.friends-of-penfolds label.error').css('display', 'block');
        }
    });

    $('.form-inline.friends-of-penfolds .vEmail').on('keyup', function (event) {
        if (event.which == '13') {
            if ($('.form-inline.friends-of-penfolds .vEmail').valid()) {
                var obj = $(this);
                var email = obj.val();
                var url = obj.parent().next().data('fop-url');
                window.location = url + "?email=" + email;
            } else {
                $('.form-inline.friends-of-penfolds label.error').css('display', 'block');
            }
        }
    });


    $('.friends-of-penfolds-container .btn-submit-form').click(function (e) {
        e.preventDefault();
        if ($('.friends-of-penfolds-container .vEmail').valid()) {
            if ($('.friends-of-penfolds-container .vEmail').val() == "") {
                $('.friends-of-penfolds-container label.error').text($(this).data('error-msg'));
            }
            var obj = $(this);
            var email = obj.prev('.vEmail').val()
            var url = obj.data('fop-url');
            window.location = url + "?email=" + email;
        } else {
            $('.friends-of-penfolds-container label.error').css('display', 'block');
        }
    });

    $('.friends-of-penfolds-container .vEmail').on('keyup', function (event) {
        if (event.which == '13') {
            if ($('.friends-of-penfolds-container .vEmail').valid()) {
                if ($('.friends-of-penfolds-container .vEmail').val() == "") {
                    $('.friends-of-penfolds-container label.error').text($(this).data('error-msg'));
                }
                var obj = $(this);
                var email = $('.friends-of-penfolds-container .vEmail').val(); // obj.val()
                var url = obj.parent().find('.btn-submit-form').data('fop-url');
                window.location = url + "?email=" + email;
            } else {
                $('.friends-of-penfolds-container label.error').css('display', 'block');
            }
        }
    });

    $('#friends-of-penfolds-modal').on('shown.bs.modal', function () {
        $(this).find('#club-first-name').focus();
    });

    $('#friends-of-penfolds-modal form').submit(function (e) {
        e.preventDefault();
        if ($(this).valid()) {
            $('#friends-of-penfolds-modal .join-form').addClass('hide');
            $('#friends-of-penfolds-modal .thank-you').removeClass('hide');
        }
    });

    // Login Modal
    $('#login-modal').on('hidden.bs.modal', resetLoginModal).on('shown.bs.modal', function () {
        $('#login-modal input:visible:first').focus();
    });

    $('#login-modal .btn.cancel').click(resetLoginModal);

    $('#login-modal .login form').submit(function (e) {
        e.preventDefault();
        if ($(this).valid()) {
            hideLoginModal();
        }
    });

    $('#login-modal .login #show-password').change(function () {
        $('#login-modal .login #user-password').togglePassword($(this).isChecked());
    });

    $('#login-modal .login .forgot-password-link').click(function () {
        $('#login-modal .forgot-password .cancel').removeClass('hide');
        showForgotPasswordModal();
    });

    $('#login-modal .forgot-password form').submit(function (e) {
        e.preventDefault();
        if ($(this).valid()) {
            $(this).addClass('hide');
            $('#login-modal .forgot-password .emailed').removeClass('hide');
        }
    });

    // Quick Buy Modal
    $('#quick-buy-modal').on('hidden.bs.modal', function (e) {
        var $this = $(this);
        $this.find('.buy').removeClass('hide');
        $this.find('.confirmed').addClass('hide');
    }).find('form').submit(function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.valid()) {
            $this.trigger('reset').validate().resetForm();
            $('#quick-buy-modal .buy').addClass('hide');
            $('#quick-buy-modal .confirmed').removeClass('hide');
            setTimeout(function () {
                $('#quick-buy-modal').modal('hide');
            }, 3000);
        }
    });

    // Share to friend modal
    $('#email-friend-modal').on('hidden.bs.modal', function (e) {
        var $this = $(this);
        $this.find('.email').removeClass('hide');
        $this.find('.sent').addClass('hide');
    }).find('form').submit(function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.valid()) {
            $('#email-friend-modal form').trigger('reset').validate().resetForm();
            $('#email-friend-modal .email').addClass('hide');
            $('#email-friend-modal .sent').removeClass('hide');
            setTimeout(function () {
                $('#email-friend-modal').modal('hide');
            }, 3000);
        }
    });

    $('#video-modal').on('show.bs.modal', function () {
        var player = $(this).find('.youtube-player');
        player.append('<iframe src="//www.youtube.com/embed/' + player.data('video-id') + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
    }).on('hide.bs.modal', function () {
        $(this).find('.youtube-player').empty();
    });

    // Dropdown select key functionality
    $('.dropdown-select').on('click', '.dropdown-menu a', function (e) {
        e.preventDefault();
        var $this = $(this);
        var parent = $this.parents(".dropdown-menu");
        parent.find('.active').removeClass('active');
        $this.addClass('active');
        parent.siblings("[data-toggle=dropdown]").text($this.text());

        window.location = $this.attr("href");
    }).on('show.bs.dropdown', function () {
        $(this).find('.dropdown-menu a:first-of-type').focus();
    }).on('keypress', function (e) {
        var code = e.which || e.keyCode;
        var $this = $(this);
        switch (code) {
            case 13: // Enter key
                if ($this.is('.open')) {
                    e.preventDefault();
                    $this.find('.dropdown-menu a:focus').click();
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

    $('.dropdown-select .dropdown-menu li.active a').click();
});

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
$('#search-results .carousel').hammer().off();
$('#suggestion-carousel').hammer().off();
$('#suggestion-carousel').find('.left.carousel-control').addClass('visuallyhidden');
$('#suggestion-carousel').bind('slide.bs.carousel', function () {
    var $this = $(this);
    $this.find('.carousel-control').addClass('visuallyhidden');
});
$('#suggestion-carousel').bind('slid.bs.carousel', function () {
    var $this = $(this);
    var index = $this.find('.item.active').index();
    var total = $this.find('.item').length;

    $this.find('.carousel-control').removeClass('visuallyhidden');

    if (index == 0) {
        $this.find('.left.carousel-control').addClass('visuallyhidden');
    } else if ((!App.isMobile && total - index < 3) || (App.isMobile && (total - 1) == index)) {
        $this.find('.right.carousel-control').addClass('visuallyhidden');
    }
});

$('.portfolio-item').on('click', function (e) {
    window.location = $(this).attr("data-url");
});

//$('#carousel-scores .portfolio-item').removeAttr("data-url");


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }

}(function ($) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch (er) { }
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
            config.raw ? key : encodeURIComponent(key),
            '=',
            config.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            $.cookie(key, '', $.extend(options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));


