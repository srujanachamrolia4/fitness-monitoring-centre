$(function () {
    "use strict";

    //=====registering service worker
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../sw.js');
    };

    if (!navigator.onLine) {
        toastr.error('You are now offline..');
    }

    if (navigator.onLine) {
        toastr.info('You are now online..');
    }

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

    //==== user email from cookie
    var useremail = $.cookie("login-user");

    //===== load reminders values
    var setReminders = function (){
        $.get('/users/'+useremail, function(data, status){
            if(data != undefined && data.length > 0 && data[0].reminders != undefined){
                if(data[0].reminders.sleep){
                    $('input[name="sleep"]').attr("checked","checked"); 
                }
                if(data[0].reminders.water){
                    $('input[name="water"]').attr("checked","checked"); 
                }
                if(data[0].reminders.exercise){
                    $('input[name="exercise"]').attr("checked","checked"); 
                }
                if(data[0].reminders.handwash){
                    $('input[name="handwash"]').attr("checked","checked"); 
                }
                if(data[0].reminders.walk){
                    $('input[name="walk"]').attr("checked","checked"); 
                }
            }
        });
    }

    if(useremail != undefined && useremail != "null"){
        setReminders();
        $('.update-section').show();
        
        // login from cookie
        $.get("/users/"+useremail, function(data, status){
            var user = data[0];
            doLogin(user);
        });
    }else{
        $('.update-section').hide();
    }

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

    //BMI calculator
    var calculateBMI = (weight, heightfeet, heightinch) => {
        var height = heightfeet*30.48 + heightinch*2.54;
        if (weight > 0 && height > 0) {
            var finalBmi = (weight / (height * height)) * 10000;
            $('.bmi-value').text(new Number(finalBmi).toFixed(2));
            $('.bmi-value').css('font-weight','bold');

            if (finalBmi < 18.5) {
                $('.bmi-meaning').text("Underweight");
                $('.bmi-meaning').css('color','orange');
            }
            if (finalBmi > 18.5 && finalBmi < 25) {
                $('.bmi-meaning').text("Normal");
                $('.bmi-meaning').css('color','green');
            }
            if (finalBmi > 25 && finalBmi < 30) {
                $('.bmi-meaning').text("Overweight");
                $('.bmi-meaning').css('color','orange');
            }
            if (finalBmi > 30 && finalBmi < 35) {
                $('.bmi-meaning').text("Obese");
                $('.bmi-meaning').css('color','red');
            }
            if (finalBmi > 35) {
                $('.bmi-meaning').text("Extremely Obese");
                $('.bmi-meaning').css('color','red');
            }
        }
    }

    var doLogin = (user) => {
        if(user != undefined){
            $('.login-section').html('Welcome, '+ user.name + '<br><br>Your BMI is <span class="bmi-value"></span> and you are <span class="bmi-meaning"></span>');
            $("a[href='#login']").hide();
            $("a[href='#logout']").show();
            calculateBMI(parseInt(user.weight), parseInt(user.heightfeet), parseInt(user.heightinches));
        }
    }

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
                var user = data[0];
                doLogin(user);
                $.cookie("login-user", user.email, { path: '/' });
                $('.update-section').show();
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
        var heightfeet = params[5]!=undefined ? params[5].split('=')[1]:params[5];
        var heightinch = params[6] != undefined ? params[6].split('=')[1]:params[6];
        var weight = params[7]!=undefined ? params[7].split('=')[1]:params[7];
        var age = params[3]!=undefined ? params[3].split('=')[1]:params[3];
        var gender = params[4]!=undefined ? params[4].split('=')[1]:params[4];

        var userdata = {
            "id": "",
            "name": name, 
            "email": email,
            "password": pass, 
            "heightfeet": heightfeet,
            "heightinches": heightinch,
            "weight": weight,
            "age":age,
            "gender":gender
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

    $('form[name="reminder-form"]').submit(function(e) {
        e.preventDefault();
        if(useremail == undefined){
            $('.reminders-alert-msg').html("You need to login to use this feature...");
            $('.reminders-alert-msg').css("color","red");
            return;
        }

        var actionurl = $(this).attr('action');
        var params = $(this).serialize();
        var reminderJson = {};
        reminderJson.sleep = params.indexOf("sleep") != -1;
        reminderJson.water = params.indexOf("water") != -1;
        reminderJson.exercise = params.indexOf("exercise") != -1;
        reminderJson.handwash = params.indexOf("handwash") != -1;
        reminderJson.walk = params.indexOf("walk") != -1;

        if(Object.keys(reminderJson).length > 0 && useremail != undefined){
            var finalRemindersJson = {
                "email": useremail,
                "reminders": reminderJson
            }

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: actionurl,
                data: JSON.stringify(finalRemindersJson),
                dataType: "json",
                statusCode: {
                    202: function() {
                        $('.reminders-alert-msg').html("Your reminders successfully set.");
                        $('.reminders-alert-msg').css("color","green");
                    }
                }
            });
        }
    });

    $('.update-form').submit(function(e) {
        e.preventDefault();
        if(useremail == undefined){
            $('.update-alert-msg').html("You need to login to use this feature...");
            $('.update-alert-msg').css("color","red");
            return;
        }

        var actionurl = $(this).attr('action');
        var params = $(this).serialize().split("&");
        var heightfeet = params[0]!=undefined ? params[0].split('=')[1]:params[0];
        var heightinch = params[1] != undefined ? params[1].split('=')[1]:params[1];
        var weight = params[2]!=undefined ? params[2].split('=')[1]:params[2];

        var postJson = { 
            "heightfeet": heightfeet, 
            "heightinch" : heightinch, 
            "weight": weight, 
            "useremail": useremail
        };

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: actionurl,
            data: JSON.stringify(postJson),
            dataType: "json",
            statusCode: {
                202: function() {
                    $('.update-alert-msg').html("Your reminders successfully set.");
                    $('.update-alert-msg').css("color","green");
                }
            }
        });
    });

    $('select[name="theme-color"]').change(function(){
        var themeColor = $(this).val();
        if(themeColor == "green"){
            $('.header-hero').css('background-image','url(images/banner-green-bg.svg)');
            $('.footer-area').append('<div id="footer-style"><style>.footer-area::before {background-image: url(../images/footer-green-bg.svg)!important;}</style></div>');
        }
        if(themeColor == "blue"){
            $('.header-hero').css('background-image','url(images/banner-bg.svg)');
            $('.footer-area').append('<div id="footer-style"><style>.footer-area::before {background-image: url(../images/footer-bg.svg)!important;}</style></div>');
        }
        if(themeColor == "red"){
            $('.header-hero').css('background-image','url(images/banner-red-bg.svg)');
            $('.footer-area').append('<div id="footer-style"><style>.footer-area::before {background-image: url(../images/footer-red-bg.svg)!important;}</style></div>');
        }
        if(themeColor == "red-pink-shade"){
            $('.header-hero').css('background-image','url(images/banner-red-pink-bg.svg)');
            $('.footer-area').append('<div id="footer-style"><style>.footer-area::before {background-image: url(../images/footer-red-pink-bg.svg)!important;}</style></div>');
        }
    });
});
