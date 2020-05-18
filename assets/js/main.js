jQuery(function($) {

	/* -- WINDOW WIDTH CHECK --*/

	/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (coffee) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */
	window.matchMedia||(window.matchMedia=function(){var b=(window.styleMedia||window.media);if(!b){var c=document.createElement("style"),a=document.getElementsByTagName("script")[0],d=null;c.type="text/css";c.id="matchmediajs-test";a.parentNode.insertBefore(c,a);d=("getComputedStyle" in window)&&window.getComputedStyle(c,null)||c.currentStyle;b={matchMedium:function(e){var f="@media "+e+"{ #matchmediajs-test { width: 1px; } }";if(c.styleSheet){c.styleSheet.cssText=f}else{c.textContent=f}return d.width==="1px"}}}return function(e){return{matches:b.matchMedium(e||"all"),media:e||"all"}}}());
	
	var media_queries = {
		tablet: window.matchMedia('(min-width:768px) and (max-width: 991px)'),
		mobile: window.matchMedia('(max-width:767px)')
	}

	function refreshMediaQueries() {
		media_queries.tablet = window.matchMedia('(min-width:768px) and (max-width: 991px)');
		media_queries.mobile = window.matchMedia('(max-width:767px)');
	}

	function isSmall() { return media_queries.mobile.matches; }
	function isMedium() { return media_queries.tablet.matches; }
	function isXLarge() { return (!media_queries.tablet.matches && !media_queries.mobile.matches); }

	jQuery(function($) {
		$(window).on('resize', refreshMediaQueries());
	});

	

	/* -- HEADER NAV MENU --*/
	
		$(window).scroll(function(){
			if($(document).scrollTop() !== 0){
				$('.header-main').addClass('header-scrolled',500);
			} else {
				$('.header-main').removeClass('header-scrolled',500);
			}
		});
		

		/* -- nav drop down menu(s) -- */
		$('#nav-ul .menu-item-has-children').on('mouseenter', function() {
		
			if(isXLarge()) {
				$(this).find('> a').addClass('submenu-active');
				$(this).find('> .sub-menu').stop().fadeIn(250);
			}

		}).on('mouseleave', function() {
			if(isXLarge()) {
				$(this).find('> a').removeClass('submenu-active');
				$(this).find('> .sub-menu').hide();
			}
		});

		

	/* -- MOBILE/TABLET MENU -- */
		
		/* -- width of sidebar menu -- */
		function mob_nav_width(){
		
			if(isSmall()){
				var slide_amount = $('#header-nav').width();
			} else {
				var slide_amount = '275';
			}
			
			$('#header-nav').css({'right': -slide_amount});

			return(slide_amount);
			
		}
		
		
		/* -- width of page -- */
		function mob_nav_page_width(){
		
			if($('#header-nav').hasClass('menu-active')){
				$('.medium-header-container,#main-content,footer').css('transform', 'translate(-' + mob_nav_width() + 'px)');
			} else {
				$('.medium-header-container,#main-content,footer').css('transform', 'translate(0)');
			}
			
		}
		
		
		/* -- on page resize -- */
		if(!isXLarge()) {
			mob_nav_width();

			$(window).on('resize', function(){
				mob_nav_width();
				mob_nav_page_width();
			});
		}
		
		
		/* -- nav menu button click -- */
		$( '#mobile-nav-button' ).click(function(e) {
			e.preventDefault();
			
			if(!$('#mobile-nav-button').is( '.active' )){
				$('#mobile-nav-button').addClass('active');
			} else {
				$('#mobile-nav-button').removeClass('active');
			}
			
			$('#header-nav,#main-content,.medium-header-container,footer').toggleClass('menu-active');
			
			mob_nav_page_width();
			
		});
		
		
		/* -- mobile drop down menu(s) -- */
		$('.sub-drop-icon').on('click', function(e) {
		
			e.preventDefault();
		
			if(!isXLarge()) {
				if (!$(this).hasClass('sub-second-drop')){
					// first level drop down
					$(this).parents('.menu-item').find('> .sub-menu-first').slideToggle(250).toggleClass('opened');
				} else { 
					// second level drop down
					$(this).parents('.menu-item').find('> .sub-second-tier').slideToggle(250).toggleClass('opened');
				}
				
				$(this).toggleClass('fa fa-angle-down fa fa-angle-up');
			
			}

		});
		
		

	/* ONE PAGE TEMPLATE SECTION SCROLLING -- */
	
		var sections = $('#main-content section'), nav = $('nav');
		
		if(isXLarge()) {
			var offset = 100;
		} else {
			var offset = 70;
		}
		
		 /* -- scroll page sections -- */
		$(window).on('scroll', function () {
			var cur_pos = $(this).scrollTop();
			sections.each(function() {
			
				var top = $(this).offset().top - offset,bottom = top + $(this).outerHeight();
				
				if (cur_pos >= top && cur_pos <= bottom) {
				  nav.find('a').removeClass('active');
				  sections.removeClass('active');
				  $(this).addClass('active');
				  nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
				}
				
			});
			
		});
	
		
		/* -- nav item click -- */
		$('nav a').on('click', function() {
			var $el = $(this), id = $el.attr('href');
			$('html, body').animate({
				scrollTop: $(id).offset().top - offset
			}, 500);
			return false;
		});
	
	

	/* -- HOME PAGE SLIDESHOW / BANNER -- */

		/* width & height of home page feature */
		function slideshowWidth(){
			$('.home-slideshow-outer,#home-slideshow,.home-slide').width( $( window ).width() ).height( $( window ).height());
		}

		if(isXLarge()) {
			slideshowWidth();
			$(window).on('resize', function(){
				slideshowWidth();
			});
		}
		
	
	
	/* -- CONTACT MAP SHOW/HIDE -- */

		$('.view-map-section').on('click', function() {
			
			if($('#contact-map-container').hasClass('opened')){
				$('#contact-map').hide();
			} else {
				$('#contact-map').show();
			}
			
			$('#contact-map-container').slideToggle(250).toggleClass('opened');

			/* Change coordinates below to your desired location */
			var lat_lng = '51.5286416,-0.1015987'.split(',');
		
			var mapOptions = {
				center: new google.maps.LatLng(lat_lng[0], lat_lng[1]),
				/* Level of zoom */
				zoom: 12,
				disableDefaultUI: true,
				scrollwheel: false,
				zoomControl: true,
				mapTypeControlOptions: {
				  mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
				}
			};
			
			var map = new google.maps.Map(document.getElementById("contact-map"), mapOptions);
			
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat_lng[0], lat_lng[1]),
				clickable: false,
				map: map, 
				title: 'Lucid Themes',
				icon: {
					url: 'assets/img/map_pin.png',
					size: new google.maps.Size(27, 37)
				}
			});
			
		});

		
	
	/* -- SLIDESHOWS -- */

		if($('.carousel .featured-slide,.carousel .testimonial-slide,.carousel .portfolio-slide').length > 1) {
		
			var slideshow_autoplay = $('.carousel').attr('data-autoplay');
			
			if(slideshow_autoplay == "true"){
				var carousel_auto = true;
				var carousel_speed = $('.carousel').attr('data-autoplay-speed');
			}
		
			$('#home-featured-slideshow,#testimonial-slideshow,#portfolio-slideshow').owlCarousel({
				autoplay:carousel_auto,
				autoplayTimeout:carousel_speed,
				autoplayHoverPause:true,
				items: 1,
				margin: 0,
				navigation: true,
				loop: true,
			});
		}
		
	
	
	/* -- PORTFOLIO LAYOUT BUTTONS -- */
	
		$('.layout-button-padding').on('click', function() {
			$('#portfolio-items').toggleClass('padding no-padding');
			$('#portfolio-items').isotope({itemSelector: '.col-xlarge-3'});
		});
		
		
		$('.layout-button-width').on('click', function() {
			$('#portfolio-items').toggleClass('full-width boxed-width');
			$('#portfolio-items').isotope({itemSelector: '.col-xlarge-3'});
		});
		
		
	
	/* -- THEME COLOR SWITCHER -- */
	
		$('.color-switcher-btn').on('click', function() {
			$('.theme-color-switcher-outer').toggleClass('opened');
		});
		
		$('.color-swatch').on('click', function() {
			var color = $(this).attr("data-color");
			
			if(color){
				$('head').find('#theme-color').attr('href','assets/css/theme-colors/theme-color-'+color+'.css');
			} else {
				$('head').find('#theme-color').attr('href','assets/css/theme-colors/theme-color.css');
			}
			
		});
	
		
});



$(window).load(function() {

    "use strict";

	/* -- PORTOLIO FILTER -- */

	$('#portfolio-items').isotope({
        itemSelector: '.col-xlarge-3'
    });
	
	$(function() {
	
		var $container = $('#portfolio-items').isotope({
			itemSelector: '.portfolio-item'
		});
		
		// hash of functions that match data-filter values
		var filterFns = {
			// show if number is greater than 50
			numberGreaterThan50: function() {
			var number = $(this).find('.number').text();
			return parseInt( number, 10 ) > 50;
			},
			// show if name ends with -ium
			ium: function() {
			var name = $(this).find('.name').text();
			return name.match( /ium$/ );
			}
		};

		// filter items on button click
		$('#portfolio-item-filter').on( 'click', 'a', function(e) {
			 e.preventDefault();
			var filterValue = $(this).attr('data-filter');
			// use filter function if value matches
			filterValue = filterFns[ filterValue ] || filterValue;
			$container.isotope({ filter: filterValue });
		});
		
		// change active class on buttons
        $('#portfolio-item-filter').each(function(i, filterbutton) {
            var $filterbutton = $(filterbutton);
            $filterbutton.on('click', 'a', function() {
                $filterbutton.find('.active').removeClass('active');
                $(this).addClass('active');
            });
        });
	
	});
	
});