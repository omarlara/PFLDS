jQuery(function() {
    jQuery.fn.reverse = [].reverse;

    $('.show-all').on('click', function(e){
        var $this = $(this);
        $this.hide();
        $('.hide-all').css("display", "block");
        $('.tmp-hide').each(function(i) {
            $(this).delay((i++) * 200).show().fadeTo(500, 1); 
        });
        e.preventDefault();
    }); 
    $('.hide-all').on('click', function(e){
        e.preventDefault();
        var $this = $(this);
        $this.hide();
        $('.show-all').css("display", "block");
        $('.tmp-hide').reverse().each(function(i) {
            $(this).delay((i++) * 100).fadeTo(500, 0); 
        });
        setTimeout(function(){
            $('.tmp-hide').hide();
        }, 1000);                   
    });  

    $('#occasions').waypoint(function(){
       $('#occasions .thumb').addClass('fadeInUps');  
       $('#occasions .fadeInUps').each(function(i) {
            $(this).delay((i++) * 200).show().fadeTo(500, 1); 
            //$(this).addClass('animated fadeInUp');
        });
    }, { offset: '60%'}); 

    $('#hero').waypoint(function() {
      $('#hero .wrapper-inner-hero').addClass('hero-container'); 
    }, { offset: '1%'}); 

    $('.wine-top-section').waypoint(function() {
      $('.wine-top-section .product-inner h1').addClass('animated slideInUp'); 
    }, { offset: '75%'});

    $('.wine-top-section').waypoint(function() {
        $('.wine-top-section .product-inner h2').addClass('animated slideInUp'); 
    }, { offset: '68%'});    

    $.stellar({
        horizontalScrolling: false,
        verticalOffset: 40
    });
    
    $(".wines-grid a.btn-cta, .wines-grid a.btn-default").click(function(e) {
        $('#collections-modal').modal('show');
        $('div.entire-components').addClass('blur');
        //e.preventDefault();
        return false;
    });

    $('#collections-modal').on('hidden.bs.modal', function () {
       $('div.entire-components').removeClass('blur');
    });
    

    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();
        if (scroll > 100) {
            $(".hero-2").addClass("heroFix");
            console.log(scroll);
        }
        else{
             $(".hero-2").removeClass("heroFix");
        }
    });

    //Occasions
    $('.fathers-day-photo').hover(
        function(){$('.fathers-day-photo').css("background-image", "url(includes/Penfolds/images/occasions/cinema.gif)")},
        function(){$('.fathers-day-photo').css("background-image", "url(includes/Penfolds/images/occasions/cinema1.jpg)")}
    );

})();
    
