var duration = 600;

var visible_popup = '';
var document_scroll;

function stopPropagation(e) {
    var event = e || window.event;
    event.stopPropagation();
}

function trim(string){
    return string.replace(/(^\s+)|(\s+$)/g, "");
}

function setAutoRemoveFormElement( element, def_val, placeholder ) {
    if (!$(element)) return false;

    $(placeholder).click(function(){$(element).focus()});

    $(element).focus(function() {
        if ($(this).val() == def_val) {
            $(this).val('');
            $(placeholder).fadeOut(100);
        }
    });
    $(element).blur(function() {
        if (trim($(this).val()) == '') {
            $(this).val(def_val);
            $(placeholder).fadeIn(100);
        } else {
            if($(placeholder).find(".clean")){
            }else{
                $(placeholder).show();
            }
            
        }
    });

    if ($(element).val() == '') {
        $(element).val(def_val);
        $(placeholder).show().removeClass('none');
    } else {
        $(placeholder).hide().removeClass('none');
    }
    return $(element);
}

function initPopup(popup){
    var close = popup.find('.close');
    close.click(hidePopup);
    $('#back').click(hidePopup);

    $('.popup_holder').hide().removeClass('none');
    $(popup).hide().removeClass('none');
}
function hidePopup(){
    $('.popup_holder').fadeOut(duration,function(){
        $('.popup.act').removeClass('act').hide();
        $('.wrapper').scrollTop(0);
        $('body').removeClass('body_popup');
        $(window).scrollTop(document_scroll);
    });
}
function showPopup(popup){
    if ( $(popup).hasClass('act') ) return;

    if( $('body').hasClass('body_popup') ){
        // we have active popup
        $('.popup.act')
            .fadeOut(duration,function(){
                $(popup).fadeIn(duration);
                $(popup).addClass('act');
            })
            .removeClass('act');
    } else {
        // no visible popup
        document_scroll = $(window).scrollTop();
        $('body').addClass('body_popup');
        $('.wrapper').scrollTop(document_scroll);
        $(window).scrollTop(0);

        $(popup).show().addClass('act');
        $('.popup_holder').stop(1,1).fadeIn(duration);
    }
}

function scrollTo(target) {
    if (typeof target == 'undefined') return;
    target = '.'+target;
    var shift = -5 + (parseInt($(target).attr('data-scroll-shift')) || 0);

    if ($(target).length) {
        $('html, body').stop(1,1).animate({
            scrollTop: $(target).first().offset().top - $('.header .wide_menu').outerHeight() + shift
        }, duration);
    }
}

function initCallBackSelect() {
    var cb_blocks = $('.callback_block');
    var selects = $('.callback_select');
    if (!selects.length) return;

    selects.each(function(i,el){
        var select = $(el);
        select.click(function(){
            $(this).toggleClass('act');
        });

        var cities = select.find('.opt');
        if (cities.length) {
            cities.click(function(){
                cities.removeClass('act');
                $(this).addClass('act');
                selects.find('.cb_city_act').html($(this).html());
                cb_blocks.find('.cb_phone').removeClass('act');
                cb_blocks.find('.cb_phone[data-city='+ $(this).data('city') +']').addClass('act');
            });
        }
    });
}

function initMainMenuWaypoint() {
    var menu = $('.wide_menu');
    var menuTop = menu.offset().top;

    function updatePosition() {
        if ($(document).scrollTop() > menuTop) {
            menu.addClass('fixed').css('left', -$(document).scrollLeft());
        } else {
            menu.removeClass('fixed').css('left', '');
        }
    }

    $(window).bind('scroll', updatePosition);
}

function initMenuDropdown() {
    var menu = $('.menu_dropdown');
    if (menu.length < 1) return;

    function openMenu(e) {
        e.stopPropagation();
        if ( !menu.hasClass('act') ) { $(window).bind('click', closeMenu); }
        menu.css("height", "115%");
        menu.addClass('act');
    }
    function closeMenu() {
        $(window).unbind('click', closeMenu);
        menu.removeClass('act');
        menu.css("height", "100%");
    }

    menu.bind('click', openMenu);
}
function initAjaxSearch() {
    var holder = $('.search_block');
    var form = holder.find('.form');
    var input = holder.find('.field input');
    var results = holder.find('.search_results');
    var ajaxIsRunning = false;
    
    function getSearchData(request){
        if (!ajaxIsRunning && form.attr('action').length) {
            ajaxIsRunning = true;
            $.ajax({
                'url': form.attr('action'),
                'type': 'post',
                'data': { text: request }
            }).done(function(data){
                if (data.length) {
                    results.addClass('act').html(data);
                }
            }).always(function(){
                ajaxIsRunning = false;
            });
        }
    }

    // prevent page from refresh
    form.submit(function(e){
        e.preventDefault();
        getSearchData(input.val());
        return false;
    });

    // make live search
    input.keyup(function(){
        if (input.val().length > 2){
            getSearchData(input.val());
            $("#clean").show();
        } else if (input.val().length < 1) {
            results.removeClass('act');
            $("#clean").show();
        }
    });

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
function initHeaderBubbles() {
    $('.menu_bubble').click(stopPropagation);
    $('[data-bubble]').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        closeBucket();
        $('.menu_bubble').removeClass('act');
        $('.'+$(this).data('bubble')).addClass('act');
        $(window).bind('click', closeBubbles);
    });
}
function closeBubbles() {
    $('.menu_bubble').removeClass('act');
    $(window).unbind('click', closeBubbles);
}
function initBucket() {
    $('.bucket_btn').click(function(e){
        /* Remove bucket_button */
        /*e.stopPropagation();
        closeBubbles();
        $(this).addClass('act');*/
    });
    $(window).bind('click', closeBucket);
}
function closeBucket() {
    $('.bucket_btn').removeClass('act');
}

function initMainSlider() {
    $('.main_slider .bxslider').bxSlider({
        mode: 'horizontal',
        onSliderLoad: function(){
            var amount = $('.main_slider .bxslider > li:not(.bx-clone)').length;
            var shift = $('.main_slider .bx-pager-item').width() * amount / 2;

            $('.main_slider .bx-prev, .main_slider .bx-next').css({
                'margin': ( '0 ' + shift + 'px' )
            });
        }
    });
}
function initMainReviewsSlider() {
    $('.main_corner_slider .bxslider').bxSlider({
        mode: 'horizontal',
        pager: false,
        infiniteLoop: false,
        hideControlOnEnd: true,
        minSlides: 4,
        maxSlides: 4,
        moveSlides: 1,
        slideWidth: 270,
        slideMargin: 15
    });
}

function initSeoBlockToggle() {
    $('.seo_block .read_more').on('click', function(){
        $(".about_shop").animate({"height": "125px"}, 1800, function(){
			$(".read_more").fadeOut(800);
		});
		
    });
}

function initTabBlocks() {
    var holders = $('.tabs_block');

    holders.each(function(i,holder){
        var header = $(holder).find('.tabs_header');
        var selectors = header.find('.tabs_selector');

        var body = $(holder).find('.tabs_body');
        var tabs = body.find('.tabs_tab');

        if (selectors.length) {
            selectors.click(function(){
                var index = selectors.index(this);
                selectors.removeClass('act').eq(index).addClass('act');
                tabs.removeClass('act').eq(index).addClass('act');

                if (tabs.eq(index).find('.bxslider').length && tabs.eq(index).data('slider-inited') != true) {
                    var slider = tabs.eq(index).find('.bxslider');

                    var isGoodsSee = slider.closest('#goods_see').length > 0;

                    if (typeof slider.data('slider-type') != "undefined" && slider.data('slider-type') == 'standard') {
                        slider.bxSlider({
                            mode: 'fade',
                            pager: false
                        });
                    } else {
                    	var options = {
                    		mode: 'horizontal',
                            pager: false,
                            infiniteLoop: false,
                            hideControlOnEnd: true,
                            minSlides: 3,
                            maxSlides: 4,
                            moveSlides: 1,
                            slideWidth: 245,
                            slideMargin: 18
                    	};

                    	if (isGoodsSee) {
                    		options.slideWidth = 260;
                    		options.slideMargin = 15;
                    	}

                        slider.bxSlider(options);
                    }
                    tabs.eq(index).data('slider-inited', true);
                }
            }).eq(0).trigger('click');
        } else {
            tabs.eq(0).addClass('act').find('.bxslider').bxSlider({
                mode: 'horizontal',
                pager: false,
                infiniteLoop: false,
                hideControlOnEnd: true,
                minSlides: 4,
                maxSlides: 4,
                moveSlides: 1,
                slideWidth: 280,
                slideMargin: 0
            });
        }
    });
}


function secondsToHms(date) {
    date = Number(date);
    var d = Math.floor(date / 3600 / 24);
    var h = Math.floor(date / 3600 % 24);
    var m = Math.floor(date % 3600 / 60);
    var s = Math.floor(date % 3600 % 60);

    d = (d < 10 ? '0' : '') + d;
    h = (h < 10 ? '0' : '') + h;
    m = (m < 10 ? '0' : '') + m;
    s = (s < 10 ? '0' : '') + s;

    return [ d, h, m, s ];
}
function initLiveTimer() {
    var time_elements = $('[data-seconds]');

    function timerIntervalFunction() {
        var this_time = new Date();
        var this_time_insec = Date.parse(this_time)/1000;
        time_elements.each(function(i, el){
            var element = $(el);
            if( !element.hasClass('ended') ){

                var _sec = parseInt(element.data('seconds'));
                if( _sec <= this_time_insec ){
                    element.addClass('ended').html('<span>00</span><span>00</span><span>00</span><span>00</span>');
                } else {
                    element.html('<span>'+secondsToHms(_sec-this_time_insec).join('</span><span>')+'</span>');
                }
            }
        });
    }

    var timer = setInterval(timerIntervalFunction,1000);
    timerIntervalFunction();
}

function initProductGallery() {
    var holder = $('.product_gallery');
    var imgBig = holder.find('.product_gallery_big img');
    var slider = holder.find('.product_gallery_pager .bxslider');

    slider.bxSlider({
        mode: 'horizontal',
        pager: false,
        infiniteLoop: false,
        hideControlOnEnd: true,
        minSlides: 4,
        maxSlides: 4,
        moveSlides: 1,
        slideWidth: 110,
        slideMargin: 0,
        onSliderLoad: function(){
            var li = slider.find('li');
            li.eq(0).addClass('act');
            li.click(function(){
                var index = li.index(this);
                li.removeClass('act').eq(index).addClass('act');
                imgBig.attr('src', $(this).find('img').data('imgbig'));
            });
        }
    });
}

function initProductGalleryPopup() {
    var imgBig = $('.product_gallery_inpopup img').first();
    var controls = $('.product_gallery_inpopup_mini div');

    controls.click(function(){
        controls.removeClass('act');
        $(this).addClass('act');
        imgBig.attr('src', $(this).find('img').first().attr('data-imgbig'));
    });
}

function initProductPackSlider() {
    var holder = $('.product_pack_slider');

    holder.find('.bxslider').bxSlider({
        mode: 'fade',
        pager: false,
        onSliderLoad: function(){
            // TODO: add buy_btn events
        }
    });
}

function initProductServicesSlider() {
    var holder = $('.product_services_slider');

    holder.find('.bxslider').bxSlider({
        mode: 'horizontal',
        pager: false,
        infiniteLoop: false,
        hideControlOnEnd: true,
        minSlides: 2,
        maxSlides: 2,
        moveSlides: 1,
        slideWidth: 200,
        slideMargin: 20,
        onSliderLoad: function(){
            // TODO: add buy_btn events
        }
    });
}

function initProductAccordion() {
    var holder = $('.product_accordion');
    var tabs = holder.find('.product_accordion_tab');
    var btns = holder.find('.product_accordion_btn');
    var heightToggleBtn = holder.find('.product_accordion_height_toggle');

    btns.click(function(){
        var index = $(btns).index(this);
        tabs.removeClass('act').eq(index).addClass('act');
    });

    heightToggleBtn.length && heightToggleBtn.click(function(){
        $(this).closest('.product_accordion_tab').toggleClass('short');
    });
    tabs.eq(0).addClass('act');
}

function initStarsFields() {
    var starsFields = $('.field_stars');

    starsFields.each(function(i,field){
        var stars = $(field).find('.star');
        var input = $(field).find('input');

        stars.click(function(){
            stars.removeClass('act');
            $(this).addClass('act');
            input.val(5 - stars.index(this));
        });
    });
}

function initPromoMiniSlider(holder) {
    if (typeof holder == "undefined") return;

    var arr_l = $(holder).find('.arr_left');
    var arr_r = $(holder).find('.arr_right');
    var slides = $(holder).find('.product_promo_slides > div');
    if (slides.length < 2) {
        arr_l.remove();
        arr_r.remove();
        slides.addClass('act');
        return;
    }
    var act;
    if ($(holder).find('.slide.act').length){
        act = slides.index($(holder).find('.slide.act'));
    } else {
        act = 0;
    }
    slides.eq(act).addClass('act');

    var sliderEvent = function(){
        removeSliderEvent();

        var next = act;

        if( $(this).hasClass('arr_left') ){
            next = (next || slides.length) - 1;
        } else {
            next = (next + 1) % slides.length;
        }

        $(slides).removeClass('act');
        $(slides[next]).addClass('act');
        act = next;
        addSliderEvent();
    };

    var addSliderEvent = function(){
        arr_l.bind('click',sliderEvent);
        arr_r.bind('click',sliderEvent);
    };
    var removeSliderEvent = function(){
        arr_l.unbind('click',sliderEvent);
        arr_r.unbind('click',sliderEvent);
    };

    addSliderEvent();
}

function initSubcatSlider() {
    $('.subcat_slider_holder .bxslider').bxSlider({
        mode: 'horizontal',
        onSliderLoad: function(){
            var amount = $('.subcat_slider_holder .bxslider > li:not(.bx-clone)').length;
            var shift = $('.subcat_slider_holder .bx-pager-item').width() * amount / 2;

            $('.subcat_slider_holder .bx-prev, .subcat_slider_holder .bx-next').css({
                'margin': ( '0 ' + shift + 'px' )
            });
        }
    });
}

function initCategorySlider() {
    $('.category_slider_holder .bxslider').bxSlider({
        mode: 'horizontal',
        onSliderLoad: function(){
            var amount = $('.category_slider_holder .bxslider > li:not(.bx-clone)').length;
            var shift = $('.category_slider_holder .bx-pager-item').width() * amount / 2;

            $('.category_slider_holder .bx-prev, .category_slider_holder .bx-next').css({
                'margin': ( '0 ' + shift + 'px' )
            });
        }
    });
}

function initFilterPrice() {
    var parent = $('.filters_price');
    var fromInput = parent.find('.price_from');
    var toInput = parent.find('.price_to');
    var fromDrag = parent.find('.drag_from');
    var toDrag = parent.find('.drag_to');

    var holder = parent.find('.drag_holder');
    var bounds = holder.find('.drag_holder_inner');
    var controls = holder.find('.drag_control');
    var holderW = holder.width();
    var controlW = controls.width();
    var limits = {
        'left': {
            'min': bounds.css('left'),
            'max': holderW - bounds.css('right') - controlW * 2
        },
        'right' : {
            'min': bounds.css('right'),
            'max': holderW - bounds.css('left') - controlW * 2
        }
    };

    var priceMin = parent.data('min');
    var priceMax = parent.data('max');
    var priceRange = priceMax - priceMin;

    $(controls).draggable({
        axis: "x",
        start: function( event, obj ) {},
        drag: function( event, obj ) {}
    });
    $(controls).on( "dragstart", function(e, obj) {
        limits.left.min  = parseInt(bounds.css('left'), 10);
        limits.right.min = parseInt(bounds.css('right'), 10);
        limits.left.max  = holderW - limits.right.min - controlW * 2;
        limits.right.max = holderW - limits.left.min - controlW * 2;
    });
    $(controls).on( "drag", function(e, obj) {
        var step = 0;
        if (obj.helper.hasClass('left')) {
            // left
            step = Math.max(0, obj.position.left + limits.left.min);
            (step > limits.left.max) && (step = limits.left.max);

            fromInput.val(step / holderW * priceRange + priceMin);
            fromDrag.html(step / holderW * priceRange + priceMin);
            bounds.css('left', step);
        } else {
            //right
            step = Math.max(0, holderW - controlW - obj.position.left - limits.left.min);
            (step > limits.right.max) && (step = limits.right.max);

            toInput.val(priceMax - step / holderW * priceRange);
            toDrag.html(priceMax - step / holderW * priceRange);
            bounds.css('right', step);
        }
    });
}

function initCustomCheckboxes() {
    $('label.custom_checkbox').each(function(i, label){
        $(label).find('input').prop('checked') && $(label).addClass('checked');
        $(label).click(function(e){
            e.preventDefault(); e.stopPropagation();
            if ($(this).hasClass('checked')) {
                $(this).removeClass('checked').find('input').prop('checked', '');
            } else {
                $(this).addClass('checked').find('input').prop('checked', 'checked');
            }
        });
    });
}

function initLeftMenuToggle() {
    $('.filters_checkbox').each(function(i,item){
        $(item).find('.name').click(function(){
            $(item).toggleClass('act');
        });
    });
}

function initCategoryFilters() {
    $('.category_filters .category_filter_item').each(function(i,item){
        var filterAct = $(item).find('.filter_act');
        var optHolder = $(item).find('.filter_opts');

        filterAct.click(function(){
            optHolder.toggleClass('act');
        });

        optHolder.find('.opt').click(function(){
            optHolder.removeClass('act').find('.opt').removeClass('act');
            $(this).addClass('act');
            filterAct.html($(this).html());
        });
    });
}

function initLeftMenuScrollBtn() {
    var holder = $('.left_menu_scrollup');
    var btn = holder.find('.left_menu_scrollup_inner');
    var offset = holder.offset().top - $('.wide_menu').height() - 20; // 20 = some extra space

    btn.click(function(){
        $('html, body').stop(1,1).animate({ 'scrollTop': 0 }, duration);
    });

    $(window).bind('scroll', function(){
        offset = holder.offset().top - $('.wide_menu').height() - 20; // 20 = some extra space
        ( $(document).scrollTop() > offset ? holder.addClass('act') : holder.removeClass('act') );
    });
}

function initFaqToggle() {
    var items = $('.faq_block .faq_item');

    items
        .addClass('closed')
        .each(function(i, item) {
            $(item).find('.text').css({
                'max-height': $(item).find('.text_inner').outerHeight()
            });
            $(item).click(function(){
                if ( $(this).hasClass('closed') ) {
                    items.addClass('closed');
                    $(this).removeClass('closed');
                } else {
                    $(this).addClass('closed');
                }
            });
        });
}

$(document).ready(function() {
    // init popups
    if( $('.popup').length ){
        $('.popup').each(function(index, item){
            initPopup($(item));
        });

        if( visible_popup.length ){
            showPopup($('.'+visible_popup));
        }

        // popup btns
        $('[data-popup]').click(function(e){
            e.preventDefault();
            var popup_class = $(this).data('popup');
            showPopup($('.'+popup_class));
        });
		$('[data-popup="popup_basket"]').click(function(e){

            if (!$('.basket_slider_wrap .bxslider').parent().hasClass('bx-viewport')) {
                initBasketSlider();
            }
        });
    }

	// placeholder for inputs
    if( $('.placeholder').length ){
        setTimeout(function(){
            $('.placeholder').each(function(i, e){
                if( $(e).siblings('input').length ){
                    setAutoRemoveFormElement($(e).siblings('input'), '', $(e));
                } else {
                    setAutoRemoveFormElement($(e).siblings('textarea'), '', $(e));
                }
            });
        },100);
    }

    // scrollto links
    if( $('[data-scrollto]').length ){
        $('[data-scrollto]').click(function(e){
            var target = $(this).attr('data-scrollto');
            if ($('.'+target).length){
                e.preventDefault();
                scrollTo(target);
            } else {
                if ($(this).attr('href').length) {
                    e.preventDefault();
                    window.location.href = $(this).attr('href') + '#' + $(this).attr('data-scrollto');
                }
            }
        });
        //if (window.location.hash.length){
        //    $(window).load(function(){
        //        setTimeout(function(){
        //            scrollTo(window.location.hash.substring(1));
        //        },1000);
        //    });
        //}
    }

    // custom select
    if ($('.custom_select').length) {
        $('.custom_select').selecter();
    }

    // init callback select
    if ($('.callback_select').length) {
        initCallBackSelect();
    }

    // init main menu waypoint
    if ($('.wide_menu').length) {
        initMainMenuWaypoint()
    }

    // init menu dropdown list
    if ($('.menu_dropdown').length) {
        initMenuDropdown();
    }

    // init ajax search
    if ($('.search_block').length) {
        initAjaxSearch();
    }

    // init personal page bubbles
    if ($('.menu_bubble').length && $('[data-bubble]').length) {
        initHeaderBubbles();
    }

    // open/close bucket btn
    if ($('.bucket_btn').length) {
        initBucket();
    }

    // init footer seo block toggle
    if ($('.seo_block').length) {
        initSeoBlockToggle();
    }

    // init tabs switching
    if ($('.tabs_block').length) {
        initTabBlocks();
    }

    // init live timer on main page
    if ($('.live_timer').length) {
        initLiveTimer();
    }

    /****************
     * main page
     * */
    // init main page promotions slider
    if ($('.main_slider').length) {
        initMainSlider();
    }

    // init main page review slider
    if ($('.main_corner_slider').length) {
        initMainReviewsSlider();
    }

    /****************
     * product page
     * */
    // init product gallery
    if ($('.product_gallery').length) {
        initProductGallery();
    }

    // init product gallery in popup
    if ($('.product_gallery_inpopup').length) {
        initProductGalleryPopup();
    }

    // init product pack slider
    if ($('.product_pack_slider').length) {
        initProductPackSlider();
    }

    // init product services slider
    if ($('.product_services_slider').length) {
        initProductServicesSlider();
    }

    // init product accordion
    if ($('.product_accordion').length) {
        initProductAccordion();
    }

    // init review stars fields to be clickable
    if ($('.field_stars').length) {
        initStarsFields();
    }

    // init product promo mini slider
    if ($('.product_promo_slider').length) {
        $('.product_promo_slider').each(function(i,slider){
            initPromoMiniSlider(slider);
        });
    }

    /****************
     * category page
     * */
    // init sub category slider
    if ($('.subcat_slider_holder').length) {
        initSubcatSlider();
    }

    // init category slider
    if ($('.category_slider_holder').length) {
        initCategorySlider();
    }

    // init left menu filter
    if ($('.filters_price .drag_holder').length) {
        initFilterPrice();
    }

    // init custom checkboxes
    if ($('label.custom_checkbox').length) {
        initCustomCheckboxes();
    }

    // init left menu toggle
    if ($('.filters_checkbox').length) {
        initLeftMenuToggle();
    }

    // init category select filters
    if ($('.category_filters').length) {
        initCategoryFilters();
    }

    // init scroll to top button below left menu
    if ($('.left_menu_scrollup').length) {
        initLeftMenuScrollBtn();
    }

    /****************
     * promo page
     * */
    // init toggle more info button
    if ($('.promos_info_btn').length) {
        $('.promos_info_btn').click(function(){
            $('.promos_info').toggleClass('act');
        });
    }

    /****************
     * shipping page
     * */
    if ($('.red_block_toggle').length) {
        $('.red_block_toggle').click(function(){
            $(this).parent().toggleClass('closed');
        });
    }

    /****************
     * feedback page
     * */
    if ($('.feedback_add_text').length) {
        $('.feedback_add_text').click(function(){
            $('.feedback_add_text').parent().find('.field_notice').toggleClass('collapsed');
        });
    }

    /****************
     * faq page
     * */
    if ($('.faq_block').length) {
        initFaqToggle();
    }
    var count = 1;
    $(".location_order").on("click", function(){
    /*$("#goods_place").on("click", function(){ */
        $(".popUp_location").toggle();
        if(count ==1){
            $(".location_order").css("padding-bottom", "20px");
            count = 0;
        }else{
            $(".location_order").css("padding-bottom", "10px");
            count = 1;
        }

    });
    
    $("#clean").on('click', function(){
        $("#search_input").val("");
        $("#clean").hide();
    });
    
    setTimeout(function(){
        $(".notification").fadeOut();
    }, 3000);
    


    var delay = 1000; 
    $('.upward').click(function () { 
      $('body').animate({
        scrollTop: 0
      }, delay);
    });
 
    $(".tab_title_1").on("click", function(){
        $(".corner_one").show();
        $(".corner_two").hide();
    });
    $(".tab_title_2").on("click", function(){
        $(".corner_one").hide();
        $(".corner_two").show();
    });
    
    $('.bxslider_1').bxSlider({
          minSlides: 6,
          maxSlides: 6,
          moveSlides: 1,
          slideWidth: 170,
          slideHeight: 130,
          slideMargin: 10,
          pager: false,
          infiniteLoop: false,
          hideControlOnEnd: true
        }, function(){
            console.log(1);
        });
	$(window).bind('click', function(e){
		thisTarget = e.target;
		if(!($(thisTarget).parents(".search_block").length > 0))
			$(".search_results").removeClass("act");
	});	

});