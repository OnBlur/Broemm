(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        console.log("works as intended");

        $(document).ready(function () {
            console.log("Document is ready!");

            var $body = $("body");

            var $container = $(".container");
            var $routeviewer = $("#routeviewer");
            var $assessor = $(".assessor");

            /* Swipe */
            var $assesspage1 = $("#acceleration");     
            var $assesspage2 = $("#turns");
            var $assesspage3 = $("#speed");

            var totalpages = 4;
            var currentpage = 1;            
            
            $assesspage1.hide();
            $assesspage2.hide();
            $assesspage3.hide();

            $body.hammer().on("swipe", function (event) {
                //console.log(event.gesture.direction + " gesture detected");
                                
                if (event.gesture.direction === 2) { // right -> left
                    console.log("gesture right -> left detected");

                    if (currentpage < totalpages) {
                        currentpage += 1;
                        console.log("page: " + currentpage);

                        switch (currentpage) {
                            /*case 1:
                                break;*/
                            case 2:
                                $routeviewer.hide();
                                $container.css("padding-top", 0);
                                $assesspage1.show();
                                /*$routeviewer.addClass("animated slideOutLeft", function () {
                                    $routeviewer.hide();
                                    // has an duration, so it can be animated!

                                    $container.css("padding-top", 0);

                                    $assesspage1.show();
                                    $assesspage1.addClass("animated slideInRight");
                                });*/

                                $(".ball1").toggleClass("active");
                                $(".ball2").toggleClass("active");
                                break;
                            case 3:
                                $assesspage1.hide();
                                $assesspage2.show();
                                $(".ball2").toggleClass("active");
                                $(".ball3").toggleClass("active");
                                break;
                            case 4:
                                $assesspage2.hide();
                                $assesspage3.show();
                                $(".ball3").toggleClass("active");
                                $(".ball4").toggleClass("active");
                                break;
                        };                        

                        /* Routeviewer slide out */
                        /*$routeviewer.removeClass("animated slideInLeft");
                        $routeviewer.addClass("animated slideOutLeft", function () {
                            //$routeviewer.hide();
                            $routeviewer.css("display", "none");                            
                        });*/

                        /* Assessor slide in */
                        //$assessor.show();
                        /*$assessor.css("display", "initial");
                        $assessor.removeClass("animated slideOutRight");
                        $assessor.addClass("animated slideInRight");*/
                    };
                } else if (event.gesture.direction === 4) { // right <- left 
                    console.log("gesture right <- left detected");

                    if (currentpage > 1) {
                        currentpage -= 1;
                        console.log("page: " + currentpage);

                        switch (currentpage) {
                            //case 4:
                                //break;
                            case 3:
                                $assesspage3.hide();
                                $assesspage2.show();
                                $(".ball4").toggleClass("active");
                                $(".ball3").toggleClass("active");
                                break;
                            case 2:
                                $assesspage2.hide();
                                $assesspage1.show();
                                $(".ball3").toggleClass("active");
                                $(".ball2").toggleClass("active");
                                break;
                            case 1:
                                $assesspage1.hide();
                                $container.css("padding-top", "");
                                $routeviewer.show();
                                $(".ball2").toggleClass("active");
                                $(".ball1").toggleClass("active");
                                break;
                        };                        

                        /* Routeviewer slide in */
                        //$routeviewer.show();
                        //$routeviewer.css("display", "initial");
                        //$routeviewer.removeClass("animated slideOutLeft");
                        //$routeviewer.addClass("animated slideInLeft");

                        /* Assessor slide out */
                        /*$assessor.removeClass("animated slideInRight");
                        $assessor.addClass("animated slideOutRight", function () {
                            //$assessor.hide();
                            $assessor.css("display", "none");

                            //$(".ball1").toggleClass("active");
                            //$(".ball2").toggleClass("active");
                        });*/
                    };
                };
            });        

            /* Dropdown points */
            // do stuff

            /* Dropdown */
            var $street = $(".street"); 
            var $triangle = $(".dropdown-triangle");
            var $streetdropdown =   $(".street-dropdown");

            $street.click(function () {
                console.log("clicked!");

                if ($(this).parent().find(".street-dropdown").is(':visible')) {
                    // If the shown item is clicked again
                    $(this).parent().find(".street-dropdown").hide("slow");
                    $(this).find(".dropdown-triangle").css("transform", "none");
                } else {
                    // Hide all items
                    $streetdropdown.hide("slow");
                    $triangle.css("transform", "none");

                    // Then show the clicked item
                    $(this).parent().find(".street-dropdown").show("slow");
                    $(this).find(".dropdown-triangle").css("transform", "rotate(180deg)");
                }                
            });
        });
        
        /*
        var routeviewer = document.getElementById('routeviewer');

        // create a simple instance
        // by default, it only adds horizontal recognizers
        var mc = new Hammer(routeviewer);

        // listen to events...

        mc.on("panleft panright tap press", function (ev) {
            console.log(ev.type + " gesture detected.");
            //$routeviewer.addClass("animated slideOutLeft");

            $routeviewer.addClass(function (index, currentClass) {
                console.log("adding class!");
                return "animated slideOutLeft";
            });
        });
        */
        /*
        $(document).ready(function () {
            console.log("Document is ready!");

            var $app = $(".app");
            var $container = $(".container");
            var $routeviewer = $("#routeviewer");
            var $headerroute = $(".header-route");
            var $assessor = $("#assessor");

                        
            $(function () {
                $routeviewer.on("swipe", swipeHandler);
                function swipeHandler(event) {
                    console.log("swipe!");
                    $(event.target).addClass("animated slideOutLeft");
                }
            });
        });
        */
    }
})();