(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        console.log("works as intended");

        $(document).ready(function () {
            console.log("Document is ready!");

            var $app = $(".app");
            var $routeviewer = $("#routeviewer");
            var $assessor = $("#assessor");

            $app.hammer().on("swipe", function (event) {
                console.log(event.gesture.direction + " gesture detected");

                if (event.gesture.direction === 4) { //right 
                    console.log("gesture right detected");

                    /* Routeviewer slide in */
                    $routeviewer.show();
                    //$routeviewer.css("background", "blue");
                    $routeviewer.removeClass("animated slideOutLeft");
                    $routeviewer.addClass("animated slideInLeft");

                    /* Assessor slide out */
                    //$assessor.css("background", "yellow");
                    $assessor.removeClass("animated slideInRight");
                    $assessor.addClass("animated slideOutRight", function () {
                        $assessor.hide();
                        /*$(".ball1").toggleClass("active");
                        $(".ball2").toggleClass("active");*/
                    });
                } else if (event.gesture.direction === 2) { //left
                    console.log("gesture left detected");

                    /* Routeviewer slide out */
                    //$routeviewer.css("background", "red");
                    $routeviewer.removeClass("animated slideInLeft");
                    $routeviewer.addClass("animated slideOutLeft", function () {
                        $routeviewer.hide();
                        /*$(".ball1").toggleClass("active");
                        $(".ball2").toggleClass("active");*/
                    });

                    /* Assessor slide in */
                    $assessor.show();
                    //$assessor.css("background", "orange");
                    $assessor.removeClass("animated slideOutRight");
                    $assessor.addClass("animated slideInRight");
                };
             });

            /*//$routeviewer.hammer().bind("swipe", function () {
            $routeviewer.hammer().bind("panleft", function () {
                console.log("gesture left detected");
                $routeviewer.css("background", "red");
                $routeviewer.addClass("animated slideOutLeft");
                //$routeviewer.addClass("routeview");
            });
            $routeviewer.hammer().bind("panright", function () {
                console.log("gesture right detected");
                $routeviewer.css("background", "blue");
                $routeviewer.removeClass("animated slideInLeft");
                //$routeviewer.addClass("routeview");
            });*/
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