(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        console.log("works as intended");

        $(document).ready(function () {
            console.log("Document is ready!");

            var $body = $("body");
            var $app = $(".app");
            var $container = $(".container");

            /* Generate streetpoints elements */
            var $streettracks = $("#streettracks");
            var journey = [
                {
                    streetName: "Noordersingel",
                    assessor: {
                        acceleration: {
                            translation: "acceleratie",
                            score: -1,
                            max: 10
                        },
                        turns: {
                            translation: "bochten",
                            score: 0,
                            max: 10
                        },
                        speed: {
                            translation: "snelheid",
                            score: 1,
                            max: 10
                        }
                    }
                },
                {
                    streetName: "Rijksstraatweg/N335",
                    assessor: {
                        acceleration: {
                            translation: "acceleratie",
                            score: 2,
                            max: 10
                        },
                        turns: {
                            translation: "bochten",
                            score: 3,
                            max: 10
                        },
                        speed: {
                            translation: "snelheid",
                            score: 4,
                            max: 10
                        }
                    }
                },
                {
                    streetName: "Groningerstraatweg",
                    assessor: {
                        acceleration: {
                            translation: "acceleratie",
                            score: 5,
                            max: 10
                        },
                        turns: {
                            translation: "bochten",
                            score: 6,
                            max: 10
                        },
                        speed: {
                            translation: "snelheid",
                            score: 7,
                            max: 10
                        }
                    }
                },
                {
                    streetName: "Tweebaksmarkt",
                    assessor: {
                        acceleration: {
                            translation: "acceleratie",
                            score: 8,
                            max: 10
                        },
                        turns: {
                            translation: "bochten",
                            score: 9,
                            max: 10
                        },
                        speed: {
                            translation: "snelheid",
                            score: 10,
                            max: 10
                        }
                    }
                },
            ];

            for (var street in journey) {
                var streetpointsElements =
                    `<div class="streetpoints">
                        <div class="street">
                            <div class="indicator negative"></div>
                            <div class="street-text">` + journey[street].streetName + `</div>
                            <img class="dropdown-triangle" src="images/triangle.svg" />
                        </div>
                        <div class="street-dropdown">`;
                for (var assignment in journey[street].assessor) {
                    var score = journey[street].assessor[assignment].score;
                    var max = journey[street].assessor[assignment].max;
                    var percentage = (100 * score) / max;
                    streetpointsElements +=
                        `<div class="points-bar ` + assignment +
                        //Object.keys(journey[street].assessor[assignment]) + 
                        `" style="width: ` + percentage + `%">` +
                        journey[street].assessor[assignment].translation + `: ` +
                        score + `/` + max + `</div >`;
                }
                streetpointsElements +=
                    `   </div>
                    </div>`;
                $streettracks.append(streetpointsElements);
            };

            /* Generate assessor elements */
            var assessorElements = "";
            var assignments = Object.keys(journey[0].assessor);
            //console.log(assignments);

            for (var item in assignments) {
                var assignment = assignments[item];
                var translation = journey[0].assessor[assignments[item]].translation;
                assessorElements += `
                    <div id="` + assignment + `" class="container assessor" style="display: none">
                        <div class="header header-element">` + translation + `</div>
                        <div class="image"><img src="images/car gifs/acceleration/giphy-downsized-large.gif" /></div>
                        <div class="header header-tips">Tips</div>
                        <div class="tips">
                            <ul>
                                <li><div class="indicator positive"></div>Rustig optrekken</li>
                                <li><div class="indicator positive"></div>Snel doorschakelen</li>
                                <li><div class="indicator positive"></div>Constante snelheid aanhouden</li>
                            </ul>
                        </div>
                    </div>`;
            }
            //console.log(assessorElements);
            $app.append(assessorElements);
            //$app.append(`<div style="background:blue">blub i'm a div</div>`);

            /* Swipe */
            var $assessor = $(".assessor");
            var $routeviewer = $("#routeviewer");

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
                    //console.log("gesture right -> left detected");

                    if (currentpage < totalpages) {
                        currentpage += 1;
                        //console.log("page: " + currentpage);

                        switch (currentpage) {
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

            /* Dropdown */
            var $street = $(".street"); 
            var $triangle = $(".dropdown-triangle");
            var $streetdropdown =   $(".street-dropdown");

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