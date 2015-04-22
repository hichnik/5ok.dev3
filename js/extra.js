/**
 * Created by 314 on 25.12.14.
 */
function setWidth() {
    var w1 = $('.compare_wrap .div_sim1');
    var w2 = $('.compare_wrap .div_sim2');
    var l = $('.compare_wrap .compare_desc_item').length;
    var foolW = l * 186;
    w1.width(foolW);
    w2.width(foolW);
}

function initCompareItemPos() {
    var compare = $('.compare_right_head');
    var compareTop = compare.offset().top;

    function updatePosition() {
        var marg = $(document).scrollTop() - compareTop;
        var leftPanel = $('.compare_left_head');

        if ($(document).scrollTop() > compareTop + 145) {
            compare.addClass('fixed').css('margin-top', marg);
            leftPanel.addClass('fixed').css('margin-top', marg);
        }
        if ( $(document).scrollTop() < compareTop + 145) {
            compare.removeClass('fixed').css('margin-top', '');
            leftPanel.removeClass('fixed').css('margin-top', '');
        }
    }

    $(window).bind('scroll', updatePosition);
}
function initBasketSlider() {
    $('.basket_slider_wrap .bxslider').bxSlider({
        mode: 'horizontal',
        pager: false,
        infiniteLoop: false,
        hideControlOnEnd: true,
        minSlides: 3,
        maxSlides: 3,
        moveSlides: 1,
        slideWidth: 229,
        slideMargin: 3
    });
}

$(document).ready(function() {
    if ($('.compare_right_head').length) {
        initCompareItemPos();
    }
    setWidth();
    $(function(){
        $(".wrap_sim1").scroll(function(){
            $(".wrap_sim2").scrollLeft($(".wrap_sim1").scrollLeft());
        });
        $(".wrap_sim2").scroll(function(){
            $(".wrap_sim1").scrollLeft($(".wrap_sim2").scrollLeft());
        });
    });

    $(".private_tab_menu a").click(function(e) {
        e.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".private_tab_content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });
    $(".my_order_toggle").click(function() {
        $(this).parent().toggleClass("act");
        $(this).parent().next().slideToggle();
    });
    $(".my_order_default").click(function() {
        $(".my_order_default").removeClass("act");
        $(this).addClass("act");
    });
    $(".my_order_list_edit").click(function(e) {
        e.stopPropagation();
        $(this).parent().addClass('act');
        $(this).siblings("input").removeAttr("disabled").focus();
        $(this).blur().attr({disabled: "disabled"});
    });
    $(".my_order_list input").click(function(e) {
        e.stopPropagation();
    });
    $("body").click(function() {
        $(".my_order_list input").attr({disabled: "disabled"});
        $('.my_order_list').removeClass('act');
    });
    $(".data_toggle").click(function() {
        $(this).toggleClass('act');
    });
        
		$('[data-popup="popup_basket"]').click(function(e){

            if (!$('.basket_slider_wrap .bxslider').parent().hasClass('bx-viewport')) {
                initBasketSlider();
            }
        });
})
