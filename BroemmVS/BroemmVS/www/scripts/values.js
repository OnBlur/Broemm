(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
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
        var startRecordId = document.getElementById("startRecord");
        var stopRecordId = document.getElementById("stopRecord");
        var clearRecordId = document.getElementById("clearRecord");
        var pointsId = document.getElementById("points");
        var geolocationId = document.getElementById('geolocation');
        var accelerationId = document.getElementById('acceleration');
        var speedId = document.getElementById('speed');

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
            fillGeo();
            fillSpeed();
            fillPoints();
            fillAcc();
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
            record = true;
            ride = 'ride' + rideCounter;
            rides.push(ride);

            alert("Started " + ride);
            rideCounter++;

            startRecord();
        };
        stopRecordId.onclick = function () { stopRecord(); };
        clearRecordId.onclick = function () { clearRecord(); };

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
        }

        function fillJson(jsonStringify) {
            while (json.firstChild) json.removeChild(json.firstChild);      // Removes previous innerHTML, so not to repeat
            jsonId.innerHTML += 'Json: ' + jsonStringify;
        }

        function assessor() {
            var leftOrRight;
            
            for (var i = 0; i < correctTurnRight.length; i++){
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

        // Stop recording and save all current values and the number of times driven
        function stopRecord() {
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

            var d = getDate(d);
            var valueStorage = rides.length;
            localStorage.setItem("amountRides", valueStorage);
        }
        
        function clearRecord() {
            while (json.firstChild) json.removeChild(json.firstChild);
            alert("Cleared!");
        }

        // Get current year, month, day, hour, minute, second and milisecond
        function getDate(d) {
            d = new Date();
            return d;
        }

        function fillPoints() {
            pointsId.innerHTML =
                'Punten: ' + points;
        }

        function fillGeo() {
            geolocationId.innerHTML = 'latitude: ' + latitude + '<br />' +
                'longitude: ' + longitude + '<br />' +
                '<hr />';
        }

        function fillSpeed() {
            speedId.innerHTML =
                'Cordova Speed: ' + speed + 'km/h' + '<br />' +
                '<hr />';
        }

        function fillAcc() {
            accelerationId.innerHTML =
                'Acceleration X: ' + accelerationX + '<br />' +
                'Acceleration Y: ' + accelerationY + '<br />' +
                'Acceleration Z: ' + accelerationZ + '<br />' +
                '<hr />';
        }

        // onError Callback receives a Error object
        function onError(error) {
            console.log('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }
        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, getMotion, onError);
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }
} )();