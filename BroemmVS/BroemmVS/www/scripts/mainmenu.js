(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        console.log("works as intended");

        $(document).ready(function () {
            console.log("Document is ready!");

            var totalpages = 3;
            var currentpage = 2;  // middle

            var $startstop = $("#startstop");
            var $tap = $(".tap");

            /*$("#bierglas .beer").hammer().on("swipedown", function (event) {
                console.log("swipe down gesture detected");
            }*/
            var $beer = $("#bierglas .beer");
            var beerhammer = $beer.hammer();
            $beer.data('hammer').get('swipe').set({ direction: Hammer.DIRECTION_ALL });

            beerhammer.on("swipe", function (event) {
                console.log(event.gesture.direction + " gesture detected");

                if (event.gesture.direction === 2) { // right -> left
                    console.log("gesture right -> left detected");

                    if (currentpage < totalpages) {
                        currentpage += 1;
                        //console.log("page: " + currentpage);

                        switch (currentpage) {
                            case 2:
                                // there's no case
                                break;
                            case 3:
                                //$startstop.addClass("slideOutUp");
                                //$startstop.removeClass("slideinDown");
                                $startstop.css("display", "none");

                                $tap.css("display", "block");
                                //$tap.removeClass("slideOutLeft");
                                //$tap.addClass("slideInRight");
                                break;
                        };
                    };
                } else if (event.gesture.direction === 4) { // right <- left 
                    console.log("gesture right <- left detected");

                    if (currentpage > 1) {
                        currentpage -= 1;
                        //console.log("page: " + currentpage);

                        switch (currentpage) {
                            case 2:
                                //$startstop.removeClass("slideOutUp");
                                //$startstop.addClass("slideinDown");
                                $startstop.css("display", "block");

                                //$tap.removeClass("slideInRight");
                                //$tap.addClass("slideOutLeft");
                                $tap.css("display", "none");
                                break;
                            case 1:
                                window.location.href = "feedbackmenu.html"; // Redirect
                                break;
                        };
                    };
                } else if (event.gesture.direction === 8) {
                    console.log("gesture top -> bottom detected");
                };
            });
            
            /* Start/stop button */
            var $startstop = $("#startstop");
            var clicked = false;

            $startstop.click(function () {
                if (clicked == false) {
                    //console.log("clicked! turn red!");
                    $startstop.css("background", "#C81A1A");
                    $startstop.css("border", "5px solid #AE1717");
                    $("#bierglas .beer").animate({ height: "50vh" });
                    $("#startstop p").html("Stop rit");

                    clicked = true;
                } else {
                    //console.log("clicked! turn green again!");
                    window.location.href = "feedbackmenu.html"; // Redirect
                    $startstop.css("background", "#6ABA36");
                    $startstop.css("border", "5px solid #428616");
                    $("#bierglas .beer").animate({height: "40vh"});
                    $("#startstop p").html("Start");

                    clicked = false;
                };
            });

            /* Beer glass swipe */
            // stuff
        });
    }
})();