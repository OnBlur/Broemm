(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        console.log("works as intended");
        // Initialize variables
        // Initialize variables
        var permissions = cordova.plugins.permissions;

        // Acceleration x for turns
        var wrongTurn = [-0.5, 0.5];
        var correctTurnRight = [-0.4, -0.2];
        var correctTurnLeft = [0.4, 0.2];
        var points = 100;

        var latitude;
        var longitude;
        var cityNameJson;
        var streetNameJson;
        var speed;
        var accelerationX;
        var accelerationY;
        var accelerationZ;

        var record = false;
        var jsonStringify;
        var recordLoop;
        var motionJson = {
            'motion': [],
            'state': true
        };

        var ride;
        var rides = [];
        var rideCounter = 1;
        var indexLoop = 0;
        var judgement = true;

        var options = { timeout: 100 }; // Update every second

        var jsonId = document.getElementById("json");
        var startRecordId = document.getElementById("startstop");
        //var stopRecordId = document.getElementById("stopRecord");
        //var geolocationId = document.getElementById('geolocation');
        //var accelerationId = document.getElementById('acceleration');
        //var speedId = document.getElementById('speed');

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

        function setCoords(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            var url = reverseGeocodeQuery(latitude, longitude);
            var data = makeRequest(url, yourCallBackFunction);
            
            speed = position.coords.speed;
            speed *= 3.6;

            roundOff();
        }

        function processEvent(event) {
            accelerationX = event.accelerationIncludingGravity.x;
            accelerationY = event.accelerationIncludingGravity.y;
            accelerationZ = event.accelerationIncludingGravity.z;

            roundOff();
            //fillGeo();
            //fillSpeed();
            //fillAcc();
        }

        // Push values to precisionRound
        function roundOff() {
            latitude = precisionRound(latitude, 7);
            longitude = precisionRound(longitude, 7);
            speed = precisionRound(speed, 1);
            accelerationX = precisionRound(accelerationX, 3);
            accelerationY = precisionRound(accelerationY, 3);
            accelerationZ = precisionRound(accelerationZ, 3);
        }

        // Round off function
        function precisionRound(varName, precision) {
            var factor = Math.pow(10, precision);
            return Math.round(varName * factor) / factor;
        }

        // Onclick buttons with functions
        startRecordId.onclick = function () {
            ride = 'ride' + rideCounter;

            if (isNaN(latitude) || isNaN(longitude)) {
                alert("Laden...");
            }
            else {
                if (record) {
                    record = false;
                    rideCounter++;
                    startRecord();
                }
                else {
                    record = true;
                    rides.push(ride);
                    alert("Started " + ride);
                    startRecord();
                }
            }
        };
        //stopRecordId.onclick = function () { stopRecord(); };

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
                cityNameJson = cityName.address.suburb;
                streetNameJson = cityName.address.road;
                //data  is the json response that you recieved from the server
            }
        }

        function startRecord() {
            var d = getDate(d);
            judgement = true;

            if (record) {
                assessor();
                motionJson.motion.push({
                    'id': indexLoop,
                    'name': rides.slice(-1)[0],
                    'timestamp': d,
                    'latitude': latitude,
                    'longitude': longitude,
                    'cityName': cityNameJson,
                    'streetName': streetNameJson,
                    'speed': speed,
                    'accelerationX': accelerationX,
                    'accelerationY': accelerationY,
                    'accelerationZ': accelerationZ,
                    'points': points,
                    'assessor': judgement
                });
                indexLoop++;

                jsonStringify = JSON.stringify(motionJson);
                fillJson(jsonStringify);
                setTimeout(startRecord, 1000);                              // Repeat this function after 1 sec
            }
            else {
                alert("Finished " + ride + " met " + points + " punten");
                record = false;
                indexLoop = 0;
                points = 100;

                // Converting the JSON string with JSON.stringify()
                // then saving with localStorage in the name of session
                localStorage.setItem(rides.slice(-1)[0], JSON.stringify(motionJson));

                // Clear array
                motionJson = {
                    'motion': [],
                    'state': true
                };
                
                var valueStorage = rides.length;
                localStorage.setItem("amountRides", valueStorage);
            }
        }

        function fillJson(jsonStringify) {
            while (json.firstChild) json.removeChild(json.firstChild);      // Removes previous innerHTML, so not to repeat
            jsonId.innerHTML += 'Json: ' + jsonStringify;
        }

        function assessor() {
            var leftOrRight;

            for (var i = 0; i < correctTurnRight.length; i++) {
                if (accelerationX > correctTurnRight[i] && accelerationX < correctTurnRight[i + 1]) {
                    alert("Juist bocht naar rechts!");
                }
                else if (accelerationX < correctTurnLeft[i] && accelerationX > correctTurnLeft[i + 1]) {
                    alert("Juist bocht naar links!");
                }
            }

            if (accelerationX < wrongTurn[0]) {
                leftOrRight = "links";
                assessorAlert(leftOrRight);
                judgement = false;
            }
            else if (accelerationX > wrongTurn[1]) {
                leftOrRight = "rechts";
                assessorAlert(leftOrRight);
                judgement = false;
            }
        }

        function assessorAlert(leftOrRight) {
            var d = getDate(d);
            points -= 1;
            alert("fout bij id: " + indexLoop + " om " + d + " Je stuurt tever naar " + leftOrRight + " met " + accelerationX);
        }

        //// Stop recording and save all current values and the number of times driven
        //function stopRecord() {
        //    alert("Finished " + ride + " met " + points + " punten");
        //    record = false;
        //    indexLoop = 0;
        //    points = 100;

        //    // Converting the JSON string with JSON.stringify()
        //    // then saving with localStorage in the name of session
        //    localStorage.setItem(rides.slice(-1)[0], JSON.stringify(motionJson));

        //    // Clear array
        //    motionJson = {
        //        'motion': [],
        //        'state': true
        //    };

        //    var d = getDate(d);
        //    var valueStorage = rides.length;
        //    localStorage.setItem("amountRides", valueStorage);
        //}

        // Get current year, month, day, hour, minute, second and milisecond
        function getDate(d) {
            d = new Date();
            return d;
        }

        //function fillGeo() {
        //    geolocationId.innerHTML = 'latitude: ' + latitude + '<br />' +
        //        'longitude: ' + longitude + '<br />' +
        //        '<hr />';
        //}

        //function fillSpeed() {
        //    speedId.innerHTML =
        //        'Cordova Speed: ' + speed + 'km/h' + '<br />' +
        //        '<hr />';
        //}

        //function fillAcc() {
        //    accelerationId.innerHTML =
        //        'Acceleration X: ' + accelerationX + '<br />' +
        //        'Acceleration Y: ' + accelerationY + '<br />' +
        //        'Acceleration Z: ' + accelerationZ + '<br />' +
        //        '<hr />';
        //}

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
                    alert("Laden...");
                    $startstop.css("background", "#b2b2b2");
                    $startstop.css("border", "5px solid #7f7f7f");
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