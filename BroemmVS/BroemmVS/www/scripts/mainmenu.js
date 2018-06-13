(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        console.log("works as intended");

        $(document).ready(function () {
            console.log("Document is ready!");

            var totalpages = 3;
            var currentpage = 2;  // middle
            var displayScore = false;

            var $startstopscreen = $("#startstopscreen");
            var $startstop = $("#startstop");
            var $beertap = $("#beertap");
            var $beerglass = $("#beerglass");
            var $beerflasks = $("#beerflasks");
            var $beercrate = $("#beercrate");

            /*$("#beerglass .beer").hammer().on("swipedown", function (event) {
                console.log("swipe down gesture detected");
            }*/
            var $beer = $("#beerglass #beer");
            var beerhammer = $beer.hammer();
            $beer.data('hammer').get('swipe').set({ direction: Hammer.DIRECTION_ALL });

            beerhammer.on("swipe", function (event) {
                console.log(event.gesture.direction + " gesture detected");

                if (event.gesture.direction === 2 && displayScore == false) { // right -> left
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

                                $beertap.css("display", "block");
                                //$beertap.removeClass("slideOutLeft");
                                //$beertap.addClass("slideInRight");
                                break;
                        };
                    };
                } else if (event.gesture.direction === 4 && displayScore == false) { // right <- left 
                    console.log("gesture right <- left detected");

                    if (currentpage > 1) {
                        currentpage -= 1;
                        //console.log("page: " + currentpage);

                        switch (currentpage) {
                            case 2:
                                //$startstop.removeClass("slideOutUp");
                                //$startstop.addClass("slideinDown");
                                $startstop.css("display", "block");

                                //$beertap.removeClass("slideInRight");
                                //$beertap.addClass("slideOutLeft");
                                $beertap.css("display", "none");
                                break;
                            case 1:
                                window.location.href = "feedbackmenu.html"; // Redirect
                                break;
                        };
                    };
                } else if (event.gesture.direction === 8) {
                    console.log("gesture top -> bottom detected");
                    displayScore = true;

                    //$startstop.removeClass("slideinDown");
                    //$startstop.addClass("slideOutUp");

                    //$startstop.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
                        $startstopscreen.css("grid-template-rows", "40vh 30vh 30vh");
                        $startstop.css("display", "none");
                        $beer.css("height", "30vh");
                        $beerflasks.css("display", "block");
                        $beercrate.css("display", "block");
                    //});
                    
                } else if (event.gesture.direction === 16 && displayScore == true) {
                    console.log("gesture top <- bottom detected");
                    displayScore = false;

                    //$startstop.removeClass("slideOutUp");
                    //$startstop.addClass("slideinDown");

                    //$startstop.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
                        $startstopscreen.css("grid-template-rows", "40vh 60vh");
                        $startstop.css("display", "block");
                        $beer.css("height", "40vh");
                        $beerflasks.css("display", "none");
                        $beercrate.css("display", "none");
                    //});
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
                    $("#beerglass .beer").animate({ height: "50vh" });
                    $("#startstop p").html("Stop rit");

                    clicked = true;
                } else {
                    //console.log("clicked! turn green again!");
                    window.location.href = "feedbackmenu.html"; // Redirect
                    $startstop.css("background", "#6ABA36");
                    $startstop.css("border", "5px solid #428616");
                    $("#beerglass .beer").animate({height: "40vh"});
                    $("#startstop p").html("Start");

                    clicked = false;
                };
            });

            /* Beer glass swipe */
            // stuff
        });
    }
})();