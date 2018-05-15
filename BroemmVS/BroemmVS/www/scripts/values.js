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

        var latitude;
        var longitude;
        var speed;
        var velocity = 0;

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

        var firstPosition = [];
        var secondPosition = [];

        var options = { timeout: 100 }; // Update every second

        var jsonId = document.getElementById("json");
        var startRecordId = document.getElementById("startRecord");
        var stopRecordId = document.getElementById("stopRecord");
        var clearRecordId = document.getElementById("clearRecord");
        var geolocationId = document.getElementById('geolocation');
        var accelerationId = document.getElementById('acceleration');
        var speedId = document.getElementById('speed');
        
        var map = L.map('map');

        // Functions
        function getMotion() {
            var lc = L.control.locate({
                locateOptions: {
                    enableHighAccuracy: true,
                    maxZoom: 17
                }
            }).addTo(map);
            
            getTiles();
            lc.start();

            navigator.geolocation.getCurrentPosition(initializePosition, onError);

            // Calibrate the compass of the device by instructing the user to calibrate the compass
            window.addEventListener("compassneedscalibration", function (event) {
                // ask user to wave device in a figure-eight motion .   
                event.preventDefault();
            }, true);
            
            window.addEventListener("devicemotion", processEvent, true);
            
            var watchPos = navigator.geolocation.watchPosition(setCoords, onError, options);
        }
        
        function getTiles() {
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }

        var initializePosition = function (position) {
            firstPosition = [position.coords.latitude, position.coords.longitude];
        };
        
        function setCoords(position) {
            secondPosition = [position.coords.latitude, position.coords.longitude];
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            speed = position.coords.speed;          // Does not work, returns null

            roundOff();
            fillGeo();
            fillVelo();

            var watchChange = navigator.geolocation.watchPosition(setCoordsNew, onError, options);
        }

        function fillGeo() {
            geolocationId.innerHTML = 'latitude: ' + latitude + '<br />' +
                'longitude: ' + longitude + '<br />' +
                '<hr />';
        }

        function fillVelo() {
            speedId.innerHTML =
                'Speed: ' + velocity + 'm/s' + '<br />' +
                'Cordova Speed: ' + speed + '<br />' +
                '<hr />';
        }
        
        // Store new coords in secondPosition and check if the array is the same as firstPosition, 
        // if not then push the positions to measure algorithm
        function setCoordsNew(position) {
            var i = 0;

            while (i < 2) {
                if (firstPosition != secondPosition) {
                    measure(firstPosition[0], firstPosition[1], secondPosition[0], secondPosition[1]);
                    firstPosition = secondPosition;
                } else {
                    break;
                }
                i++;
            }
        }

        // Algorithm to calculate speed
        function measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
            var R = 6378.137; // Radius of earth in KM
            var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
            var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            velocity = d * 1000;    // 1000 = m/s
            roundOff();
        }

        function processEvent(event) {
            accelerationX = event.accelerationIncludingGravity.x;
            accelerationY = event.accelerationIncludingGravity.y;
            accelerationZ = event.accelerationIncludingGravity.z;

            roundOff();

            // process the event object
            accelerationId.innerHTML =
                'Acceleration X: ' + accelerationX + '<br />' +
                'Acceleration Y: ' + accelerationY + '<br />' +
                'Acceleration Z: ' + accelerationZ + '<br />' +
                '<hr />';
        }

        // Push values to precisionRound
        function roundOff() {
            latitude = precisionRound(latitude, 6);
            longitude = precisionRound(longitude, 6);
            velocity = precisionRound(velocity, 3);
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
        
        function startRecord() {
            var d = getDate(d);
            
            if (record) {
                motionJson.motion.push({
                    'id': indexLoop,
                    'name': rides.slice(-1)[0],
                    'timestamp': d,
                    'latitude': latitude,
                    'longitude': longitude,
                    'speed': velocity,
                    'accelerationX': accelerationX,
                    'accelerationY': accelerationY,
                    'accelerationZ': accelerationZ
                });
                indexLoop++;

                jsonStringify = JSON.stringify(motionJson);
                fillJson(jsonStringify);
                setTimeout(startRecord, 1000);                  // Repeat this function after 1 sec
            }
        };

        function fillJson(jsonStringify) {
            while (json.firstChild) json.removeChild(json.firstChild);
            jsonId.innerHTML += 'Json: ' + jsonStringify + '<hr />';
        }

        // Stop recording and save all current values and the number of times driven
        function stopRecord() {
            record = false;
            indexLoop = 0;

            alert("Finished " + ride);
            alert(jsonStringify);

            // Converting the JSON string with JSON.stringify()
            // then saving with localStorage in the name of session
            localStorage.setItem(rides.slice(-1)[0], JSON.stringify(motionJson));

            // Clear array
            motionJson = {
                'motion': [],
                'state': true
            };

            var d = getDate(d);
            var valueStorage = [d, rides, latitude, longitude, velocity, accelerationX, accelerationY, accelerationZ];
            localStorage.setItem("valueStorage", JSON.stringify(valueStorage));
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