(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Initialize variables
        var permissions = cordova.plugins.permissions;

        // Acceleration x for turns
        var wrongTurn = [-0.5, 0.5];
        var correctTurnRight = [-0.4, -0.2];
        var correctTurnLeft = [0.4, 0.2];

        var latitude;
        var longitude;
        var currentCityName;
        var currentStreetName;
        var speed;
        var accelerationX;
        var accelerationY;
        var accelerationZ;
        var points = 100;
        var judgement = true;

        var roundOffData = [latitude, longitude, speed, accelerationX, accelerationY, accelerationZ];
        var roundOffNumber = [7, 7, 1, 3, 3, 3];

        var record = false;
        var recordLoop;
        var motionArray = {
            'motion': [],
            'state': true
        };

        var ride;
        var rides = [];
        var rideCounter = 0;
        var indexLoop = 0;

        var options = { timeout: 100 }; // Update every second

        var debugId = document.getElementById("debug");
        var startRecordId = document.getElementById("startstop");

        // Functions
        function getMotion() {
            // Calibrate the compass of the device by instructing the user to calibrate the compass
            window.addEventListener("compassneedscalibration", function (event) {
                // ask user to wave device in a figure-eight motion .   
                event.preventDefault();
            }, true);

            window.addEventListener("devicemotion", processEvent, true);

            var watchPos = navigator.geolocation.watchPosition(setCoords, onError, options);
        }

        function processEvent(event) {

            //var phonePosition = trackPhonePosition(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y);
            //alert(phonePosition);

            accelerationX = event.accelerationIncludingGravity.x;
            accelerationY = event.accelerationIncludingGravity.y;
            accelerationZ = event.accelerationIncludingGravity.z;
        }

        function setCoords(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            var url = reverseGeocodeQuery(latitude, longitude);
            var data = makeRequest(url, yourCallBackFunction);
            
            speed = position.coords.speed;
            speed *= 3.6;
        }

        // Get URL for reverse geocoding
        function reverseGeocodeQuery(lat, lon) {
            var format = "jsonv2";

            var url = "https://nominatim.openstreetmap.org/reverse?format=" + format + "&lat=" + lat + "&lon=" + lon;
            return url;
        }

        // Get Json with the url
        function makeRequest(url, done) {
            var xhr = new XMLHttpRequest();

            xhr.open('Get', url);
            xhr.onload = function () {
                done(null, xhr.response);
            };
            xhr.onerror = function () {
                done(xhr.response);
            };

            xhr.send();
        }

        // Get cityname and streetname from the Json
        function yourCallBackFunction(err, data) {
            if (err) {
                //Do something with the error 
            } else {
                var cityName = JSON.parse(data);
                currentCityName = cityName.address.suburb;
                currentStreetName = cityName.address.road;
                //data  is the json response that you recieved from the server
            }
        }
        
        //function trackPhonePosition() {
        //    var negentigGradenRotatie = "";
        //    var positie = "";
        //    var currentAcceleration = [x, y];

        //    for (var i = 0; i < currentAcceleration.length; i++) {
        //        if (currentAcceleration[i] > 9.6 && currentAcceleration[i] < 10) {
        //            if (i == 0) {
        //                positie = "gamma links";
        //                return negentigGradenRotatie = "90 graden naar: " + positie;
        //            }
        //            else if (i == 1) {
        //                positie = "beta boven";
        //                return negentigGradenRotatie = "90 graden naar: " + positie;
        //            }
        //        }
        //    }
        //}

        // Onclick buttons with functions
        startRecordId.onclick = function () {
            if (isNaN(latitude) || isNaN(longitude)) {
                alert("GPS locatie inladen");
            }
            else {
                if (record) {
                    record = false;
                    startRecord();
                }
                else {
                    rideCounter = localStorage.getItem("amountRides");
                    rideCounter++;
                    ride = 'rit' + rideCounter;
                    localStorage.setItem("amountRides", rideCounter);

                    record = true;
                    rides.push(ride);
                    startRecord();
                }
            }
        };

        function startRecord() {
            var d = getDate();
            judgement = true;

            if (record) {
                assessor();

                roundOffData = [latitude, longitude, speed, accelerationX, accelerationY, accelerationZ];
                for (var i = 0; i < roundOffData.length; i++) {
                    precisionRound(roundOffData[i], roundOffNumber[i]);
                }

                motionArray.motion.push({
                    'id': indexLoop,
                    'name': rides[rides.length - 1],
                    'timestamp': d,
                    'latitude': latitude,
                    'longitude': longitude,
                    'cityName': currentCityName,
                    'streetName': currentStreetName,
                    'speed': speed,
                    'acceleration': [{
                        "accelerationX": accelerationX,
                        "accelerationY": accelerationY,
                        "accelerationZ": accelerationZ
                    }],
                    'points': points,
                    'assessor': judgement
                });
                
                debugScreen(motionArray.motion[indexLoop]);
                indexLoop++;

                setTimeout(startRecord, 1000);                              // Repeat this function after 1 sec
            }
            else {
                record = false;
                indexLoop = 0;
                points = 100;

                // Converting the JSON string with JSON.stringify()
                // then saving with localStorage in the name of session
                localStorage.setItem(rides.slice(-1)[0], JSON.stringify(motionArray));

                // Clear array
                motionArray = {
                    'motion': [],
                    'state': true
                };
            }
        }
        
        function debugScreen(motionIndex) {
            var motionIndexString = JSON.stringify(motionIndex);
            debugId.innerHTML = motionIndexString;
        }

        function assessor() {
            if (accelerationX < wrongTurn[0] || accelerationX > wrongTurn[1]) {
                judgement = false;
                points -= 1;
            }
        }

        // Round off function
        function precisionRound(varName, precision) {
            var factor = Math.pow(10, precision);
            varName = Math.round(varName * factor) / factor;
        }
        
        // Retreive day, month and year from Date()
        function getDate() {
            var d = new Date();
            var day = d.getUTCDate();
            var month = d.getUTCMonth() + 1; //months from 1-12
            var year = d.getUTCFullYear();

            var newdate = day + "-" + month + "-" + year;
            return newdate;
        }

        // onError Callback receives a Error object
        function onError(error) {
            console.log('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, getMotion, onError);

        $(document).ready(function () {
            console.log("Document is ready!");

            var totalpages = 3;
            var currentpage = 2;  // middle
            var displayScore = false;
            var displayTap = false;

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
                //console.log(event.gesture.direction + " gesture detected");

                if (event.gesture.direction === 4 && displayScore == false) { // right -> left
                    //console.log("gesture right -> left detected");

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
                                displayTap = true;
                                //$beertap.removeClass("slideOutLeft");
                                //$beertap.addClass("slideInRight");
                                break;
                        };
                    };
                } else if (event.gesture.direction === 2 && displayScore == false) { // right <- left 
                    //console.log("gesture right <- left detected");

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
                                displayTap = false;
                                break;
                            case 1:
                                window.location.href = "feedbackmenu.html"; // Redirect
                                break;
                        };
                    };
                } else if (event.gesture.direction === 8 && displayTap == false) {
                    //console.log("gesture top -> bottom detected");
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
                    //console.log("gesture top <- bottom detected");
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
                if (isNaN(latitude) || isNaN(longitude)){
                    $startstop.css("background", "#b2b2b2");
                    $startstop.css("border", "5px solid #7f7f7f");
                    $("#startstop p").html("Laden...");
                }
                else {
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
                        $("#beerglass .beer").animate({ height: "40vh" });
                        $("#startstop p").html("Start");

                        clicked = false;
                    };
                }
            });

            /* Beer glass swipe */
            // stuff
        });
    }
})();