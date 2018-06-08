(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        console.log("works as intended");

        $(document).ready(function () {
            console.log("Document is ready!");


            $("#bierglas .beer").hammer().on("swipe", function (event) {
                console.log(event.gesture.direction + " gesture detected");

                if (event.gesture.direction === 2) {
                    //swipe to left
                    window.location.href = "feedbackmenu.html"; // Redirect       
                                   
                }

                else if (event.gesture.direction === 4) {
                   //swipe to right
                    $(".tap").css("display", "block");
                    $("#startstop").css("display", "none");
                };
            });



            /* Start/stop button */
            var $startstop = $("#startstop");
            var clicked = false;

            $startstop.click(function () {
                if (clicked == false) {
                    console.log("clicked! turn red!");
                    $startstop.css("background", "#C81A1A");
                    $startstop.css("border", "5px solid #AE1717");
                    $("#startstop p").html("Stop rit");

                    clicked = true;
                } else {
                    console.log("clicked! turn green again!");
                    window.location.href = "feedbackmenu.html"; // Redirect
                    $startstop.css("background", "#6ABA36");
                    $startstop.css("border", "5px solid #428616");
                    $("#startstop p").html("Start");

                    clicked = false;
                };
            });

            /* Beer glass swipe */
            // stuff
        });
    }
})();