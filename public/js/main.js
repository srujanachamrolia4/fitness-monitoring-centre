$(function () {

    "use strict";

    //===== Prealoder

    $('.preloader').delay(500).fadeOut(500);

    
    //===== Sticky

    $(window).on('scroll', function (event) {
        var scroll = $(window).scrollTop();
        if (scroll < 20) {
            $(".navbar-area").removeClass("sticky");
            $(".navbar .navbar-brand img").attr("src", "images/logo-2.png");
        } else {
            $(".navbar-area").addClass("sticky");
            $(".navbar .navbar-brand img").attr("src", "images/logo.png");
        }
    });

    //===== Section Menu Active

    var scrollLink = $('.page-scroll');
    // Active link switching
    $(window).scroll(function () {
        var scrollbarLocation = $(this).scrollTop();

        scrollLink.each(function () {
            if(this.hash.length && $(this.hash).offset() != undefined){
                var sectionOffset = $(this.hash).offset().top - 73;

                if (sectionOffset <= scrollbarLocation) {
                    $(this).parent().addClass('active');
                    $(this).parent().siblings().removeClass('active');
                }
            }
        });
    });


    //===== close navbar-collapse when a  clicked

    $(".navbar-nav a").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });

    $(".navbar-toggler").on('click', function () {
        $(this).toggleClass("active");
    });

    $(".navbar-nav a").on('click', function () {
        $(".navbar-toggler").removeClass('active');
    });    


    //===== Back to top

    // Show or hide the sticky footer button
    $(window).on('scroll', function (event) {
        if ($(this).scrollTop() > 600) {
            $('.back-to-top').fadeIn(200);
        } else {
            $('.back-to-top').fadeOut(200);
        }
    });

    //Animate the scroll to yop
    $('.back-to-top').on('click', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });

    $('.sign-up-area').hide();
    $("a[href='#login']").show();
    $("a[href='#logout']").hide();

    $("a[href='#sign-up']").click(function() {
        $('.login-area').hide();
        $('.sign-up-area').show();
    });

    $("a[href='#login']").click(function() {
        $('.login-area').show();
        $('.sign-up-area').hide();
    });

    $(".login-form").submit(function(e) {
        e.preventDefault();
        var actionurl = $(this).attr('action');
        var params = $(this).serialize().split('&');
        var email = params[0].split('=')[1];
        var pass = params[1].split('=')[1];
        $.get(actionurl+"/"+email+"/"+pass, function(data, status){
            if(data == "mismatch"){
                $('.login-msg').html('Invalid credentials.');
                $('.login-msg').addClass('red');
            }else{
                $('.login-area').html('Welcome, '+data);
                $.cookie("login-user", data, { path: '/' });
                $("a[href='#login']").hide();
                $("a[href='#logout']").show();
            }
        });
    });

    $("a[href='#logout']").click(function(e){
        $.cookie("login-user", null);
        window.location.reload();
    });

    $(".sign-up-form").submit(function(e) {
        e.preventDefault();
        $('.alert-msg').html("");
        var actionurl = $(this).attr('action');
        var params = $(this).serialize().split('&');

        var name = params[0].split('=')[1] != undefined ? params[0].split('=')[1].replaceAll('%20',' '):params[0].split('=')[1] ;
        var email = params[1]!=undefined ? params[1].split('=')[1] != undefined ? params[1].split('=')[1].replace('%40','@'):params[1].split('=')[1] : params[1];
        var pass = params[2]!=undefined ? params[2].split('=')[1]:params[2];
        var heightfeet = params[3]!=undefined ? params[3].split('=')[1]:params[3];
        var heightinch = params[4] != undefined ? params[4].split('=')[1]:params[4];
        var weight = params[5]!=undefined ? params[5].split('=')[1]:params[2];

        var userdata = {
            "id": "",
            "name": name, 
            "email": email,
            "password": pass, 
            "height-feet": heightfeet,
            "height-inches": heightinch,
            "weight": weight
        };

        if(email != undefined){
            $.get('/users/'+email, function(data, status){
                if(data != undefined && data.length > 0){
                    $('.alert-msg').html("Email id already registered, please login.");
                }else{
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: actionurl,
                        data: JSON.stringify(userdata),
                        dataType: "json",
                        statusCode: {
                            202: function() {
                                $(".sign-up-form").trigger("reset");
                                $('.alert-msg').html("Registration successful. Login now.");
                            }
                        }
                    });
                }
            });
        }
    });
});
