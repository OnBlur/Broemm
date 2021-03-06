﻿(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        console.log("works as intended");
        var journey = [];

        var routeCityId = document.getElementById("routeCity");
        var trackmomentId = document.getElementById("trackmoment");

        // Get last localstorage amount of rides
        var restoredAllRides = JSON.parse(localStorage.getItem("amountRides"));
        var ride = 'rit' + restoredAllRides;

        var restoredSession = JSON.parse(localStorage.getItem(ride));

        for (var y = 0; y < restoredSession.motion.length; y++) {
            var streetName = restoredSession.motion[y].streetName;

            var feed = {
                streetName: streetName,
                    assessor: {
                        acceleration: {
                            translation: "vertragen",
                            score: 6,
                            max: 10
                        },
                        turns: {
                            translation: "bochten",
                            score: 0,
                            max: 10
                        },
                        speed: {
                            translation: "snelheid regelen",
                            score: 1,
                            max: 10
                        }
                    }
            }
            journey.push(feed);
        }
        var streetNamesLenght = restoredSession.motion.length;
        routeCityId.innerHTML = restoredSession.motion[0].streetName + " &rarr; " + restoredSession.motion[streetNamesLenght - 1].streetName;
        trackmomentId.innerHTML = restoredSession.motion[0].name + ", " + restoredSession.motion[0].timestamp;

        $(document).ready(function () {
            console.log("Document is ready!");

            var $body = $("body");
            var $app = $(".app");
            var $container = $(".container");

            /* Add height dependent padding */
            var $routeviewer = $("#routeviewer");
            var $headerroute = $("#routeviewer .header-route");
            var height = $headerroute.outerHeight() + 20;
            $routeviewer.css("padding-top", height);

            /* Display track overview */
            var $burgermenu = $(".header-route img");
            var $streettracks = $("#streettracks");
            var $overview = $("#overview");
            var $swipebar = $("#swipebar");
            var $swipeindicator = $("#swipeindicator");
            //var toggled = false;
            var displayOverview = false;
                        
            function toggleOverview() {
                $streettracks.toggle();
                $overview.toggle();
                $swipebar.toggle();

                if (displayOverview == false) {
                    var height = $headerroute.outerHeight();
                    //toggled = true;
                    displayOverview = true;
                } else {
                    var height = $headerroute.outerHeight() + 20;
                    //toggled = false;
                    displayOverview = false;
                }
                $routeviewer.css("padding-top", height);
            };

            $burgermenu.click(function () {
                toggleOverview();
            });

            var swipebarhammer = $swipebar.hammer();
            $swipebar.data('hammer').get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            swipebarhammer.on("swipe", function (event) {
                //console.log("swiped bar!");
                if (event.gesture.direction === 8) {
                    //console.log("top <- bottom");
                    toggleOverview();
                }                
            });

            var swipeindicatorhammer = $swipeindicator.hammer();
            $swipeindicator.data('hammer').get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            swipeindicatorhammer.on("swipe", function (event) {
                //console.log("swiped indicator!");
                if (event.gesture.direction === 8) {
                    //console.log("top <- bottom");
                    toggleOverview();
                }                
            });

            /*$burgermenu.click(function () {
                //console.log("clicked!");
                $streettracks.toggle();
                $overview.toggle();
                $swipebar.toggle();

                if (toggled == false) {
                    var height = $headerroute.outerHeight();
                    toggled = true;
                } else {
                    var height = $headerroute.outerHeight() + 20;
                    toggled = false;
                }
                $routeviewer.css("padding-top", height);
                //console.log("clicked: " + toggled);
            });*/


            /* Generate streetpoints elements */
            var $streettracks = $("#streettracks");
            /*var journey = [
                {
                    streetName: "Noordersingel",
                    assessor: {
                        acceleration: {
                            translation: "vertragen",
                            score: 6,
                            max: 10
                        },
                        turns: {
                            translation: "bochten",
                            score: 0,
                            max: 10
                        },
                        speed: {
                            translation: "snelheid regelen",
                            score: 1,
                            max: 10
                        }
                    }
                },
                {
                    streetName: "Rijksstraatweg/N335",
                    assessor: {
                        acceleration: {
                            translation: "vertragen",
                            score: 2,
                            max: 10
                        },
                        turns: {
                            translation: "bochten",
                            score: 3,
                            max: 10
                        },
                        speed: {
                            translation: "snelheid regelen",
                            score: 4,
                            max: 10
                        }
                    }
                },
                {
                    streetName: "Groningerstraatweg",
                    assessor: {
                        acceleration: {
                            translation: "vertragen",
                            score: 5,
                            max: 10
                        },
                        turns: {
                            translation: "bochten",
                            score: 6,
                            max: 10
                        },
                        speed: {
                            translation: "snelheid regelen",
                            score: 7,
                            max: 10
                        }
                    }
                },
                {
                    streetName: "Tweebaksmarkt",
                    assessor: {
                        acceleration: {
                            translation: "vertragen",
                            score: 8,
                            max: 10
                        },
                        turns: {
                            translation: "bochten",
                            score: 9,
                            max: 10
                        },
                        speed: {
                            translation: "snelheid regelen",
                            score: 10,
                            max: 10
                        }
                    }
                },
            ];*/
            
            /*var assessorScores = {
                // assignment: [score, score, score, score, score, etc]
            };*/
                        
            for (var street in journey) {
                /* street */
                var indicator = "";
                var streetName = journey[street].streetName;

                /* street-dropdown */
                var pointbarElements = "";
                var percentages = [];

                for (var assignment in journey[street].assessor) {
                    var score = journey[street].assessor[assignment].score;
                    var max = journey[street].assessor[assignment].max;
                    var percentage = (100 * score) / max;
                    percentages.push(percentage);
                    var barIndicator = "";

                    if (percentage <= 50) {
                        barIndicator = "negative";
                    } else {
                        barIndicator = "positive";
                    };

                    pointbarElements +=
                        `<div class="points-bar ` + /*barIndicator + ` ` +*/ assignment + `" style="width: ` + percentage + `%">` +
                        journey[street].assessor[assignment].translation + `: ` + 
                        score + `/` + max + `</div>`;

                    //assessorScores[assignment] = [];
                };
                //console.log(assessorScores);

                var sum = 0;
                //console.log("percentages: " + percentages);
                for (var p in percentages) {
                    //console.log(percentages[p]);
                    sum += percentages[p];
                };
                var average = restoredSession.motion[street].assessor;
                //var average = sum / percentages.length;
                //console.log(average + " = " + sum + " / " + percentages.length);

                if (average != true){
                    indicator = "negative";
                }
                else {
                    indicator = "positive";
                }

                //if (average <= 50) {
                //    indicator = "negative";
                //} else {
                //    indicator = "positive";
                //};               

                var streetpointsElements =
                    `<div class="streetpoints">
                        <div class="street">
                            <div class="indicator ` + indicator + `"></div>
                            <!-- <div class="street-text">` + streetName + ` (` + Math.round(average) + `%)</div> -->
                            <div class="street-text">` + streetName + ` (` + restoredSession.motion[street].points + `%)</div>
                            <img class="dropdown-triangle" src="images/triangle.svg" />
                        </div>
                        <div class="street-dropdown">` +
                            pointbarElements +
                        `</div>
                    </div>`;
                $streettracks.append(streetpointsElements);
            };

            /* Generate overview elements */
            // code here

            /* Generate assessor elements */
            var assessorElements = "";
            var assignments = Object.keys(journey[0].assessor);
            //console.log(assignments);

            for (var item in assignments) {
                //console.log(assignments);
                var gifs = [
                    "images/car gifs/acceleration/1.gif",
                    "images/car gifs/turns/1.gif",
                    "images/car gifs/speed/1.gif"
                ];

                var tipsSnelheid = [
                    "Probeer &eacute;&eacute;n snelheid aan te houden.",
                    "Kijk ver vooruit!",
                    "Door eerder je snelheid te regelen, zul je minder stilstaan."
                ];
                var tipsBochten = [
                    "Regel voor de bocht al je snelheid.",
                    "Doorzie de bocht. Hoe verder je kijkt, des te mooier de bocht.",
                    "Bij het uitrijden van de bocht mag je gas bijgeven."
                ];
                var tipsVertragen = [
                    "Door eerder te vertragen cre&euml;er je overzicht.",
                    "Probeer abrupt remmen te voorkomen.",
                    "Probeer de auto meer uit te laten rollen."
                ];

                var allTips = [tipsSnelheid, tipsBochten, tipsVertragen];

                var assignment = assignments[item];
                var translation = journey[0].assessor[assignments[item]].translation;
                var headerIndicator = "";

                //console.log(item + " == ( " + assignments.length + " - 1 )");
                var continueElement = "";
                if (item == (assignments.length - 1)) {
                    continueElement =
                        `<div id="next">
                            <a class="button" href="mainmenu.html">Verder</a>
                        </div>`;
                }

                var tipsElements = "";
                for (var tip in allTips[item]) {
                    tipsElements += `<img class="indicator" src="../www/images/pluspositive.png" /><div class="tip">` + allTips[item][tip] + `</div>`;
                };

                assessorElements += `
                    <div id="` + assignment + `" class="container assessor" style="display: none">
                        <div class="header header-element` + headerIndicator + `">` + translation + `</div>
                        <div class="image"><img src="` + gifs[item] + `" /></div>
                        <div class="header header-tips">Tips</div>
                        <div class="tips">` + tipsElements + `</div>` +
                        continueElement +
                    `</div>`;
                /*assessorElements += `
                    <div id="` + assignment + `" class="container assessor" style="display: none">
                        <div class="header header-element` + headerIndicator + `">` + translation + `</div>
                        <div class="image"><img src="` + gifs[item] + `" /></div>
                        <div class="header header-tips">Tips</div>
                        <div class="tips">
                            <ul style="list-style-image: url('../www/images/pluspositive.png')">` + tipsElements + `</ul>
                        </div>` +
                        continueElement +
                    `</div>`;*/
            }
            //console.log(assessorElements);
            $app.append(assessorElements);
            //$app.append(`<div style="background:blue">blub i'm a div</div>`);

            /* Swipe */
            var $assessor = $(".assessor");

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
                                
                if (event.gesture.direction === 2 && displayOverview == false) { // right -> left
                    //console.log("gesture right -> left detected");

                    if (currentpage < totalpages) {
                        currentpage += 1;
                        //console.log("page: " + currentpage);

                        switch (currentpage) {
                            case 2:
                                $routeviewer.hide();
                                //$container.css("padding-top", 0);
                                $assesspage1.show();
                                /*$routeviewer.addClass("animated slideOutLeft", function () {
                                    $routeviewer.hide();
                                    // has an duration, so it can be animated!

                                    //$container.css("padding-top", 0);

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
                    //console.log("gesture right <- left detected");

                    if (currentpage > 1) {
                        currentpage -= 1;
                        //console.log("page: " + currentpage);

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
                                //$container.css("padding-top", "");
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

            /* Dropdown */
            var $street = $(".street"); 
            var $triangle = $(".dropdown-triangle");
            var $streetdropdown = $(".street-dropdown");

            $street.click(function () {
                //console.log("clicked!");

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
    }
})();