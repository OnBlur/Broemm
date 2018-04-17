// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        var permissions = cordova.plugins.permissions;

        var latitude = undefined;
        var longitude = undefined;
        var velocity = 0;

        var accelerationX;
        var accelerationY;
        var accelerationZ;
        var record = false;
        var obj = new Object();
        var recordLoop;
        var indexLoop = 0;
        var motionJson = {
            'motion': [],
            'state': true
        };

        var firstPosition = [];
        var secondPosition = [];

        var options = { timeout: 1000 }; // Update every second

        var jsonId = document.getElementById("json");
        var startRecordId = document.getElementById("startRecord");
        var stopRecordId = document.getElementById("stopRecord");
        var clearRecordId = document.getElementById("clearRecord");
        var geolocationId = document.getElementById('geolocation');
        var accelerationId = document.getElementById('acceleration');
        var speedId = document.getElementById('speed');
        
        var map = L.map('map');
        
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
            var watchAcce = navigator.accelerometer.watchAcceleration(onSuccessAcce, onError, options);
            var watchPos = navigator.geolocation.watchPosition(setCoords, onError, options);
        }

        function getTiles() {
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }

        var initializePosition = function (position) {
            firstPosition = [position.coords.latitude, position.coords.longitude];
        }
        
        function setCoords(position) {
            secondPosition = [position.coords.latitude, position.coords.longitude];
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

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
            speedId.innerHTML = 'Speed: ' + velocity + 'm/s' + '<br />' +
                '<hr />';
        };
        
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

        var onSuccessAcce = function (acceleration) {
            accelerationX = acceleration.x
            accelerationY = acceleration.y
            accelerationZ = acceleration.z

            roundOff();

            accelerationId.innerHTML =
                'Acceleration X: ' + accelerationX + '<br />' +
                'Acceleration Y: ' + accelerationY + '<br />' +
                'Acceleration Z: ' + accelerationZ + '<br />' +
                '<hr />';
        };

        function roundOff() {
            latitude = precisionRound(latitude, 4);
            longitude = precisionRound(longitude, 4);
            velocity = precisionRound(velocity, 3);
            accelerationX = precisionRound(accelerationX, 3);
            accelerationY = precisionRound(accelerationY, 3);
            accelerationZ = precisionRound(accelerationZ, 3);
        }

        function precisionRound(varName, precision) {
            var factor = Math.pow(10, precision);
            return Math.round(varName * factor) / factor;
        }
        
        startRecordId.onclick = function () {
            alert("started Recording! \n checking for changes in position");
            recordLoop = navigator.accelerometer.watchAcceleration(startRecord, onError, options);
        };
        stopRecordId.onclick = function () { stopRecord(); };
        clearRecordId.onclick = function () { clearRecord(); };

        var startRecord = function (acceleration) {
            record = true;

            while (record && obj.latitude != latitude || obj.longitude != longitude) {
                var jsonStringify;
                
                obj.accelerationX = accelerationX;
                obj.accelerationY = accelerationY;
                obj.accelerationZ = accelerationZ;
                obj.latitude = latitude;
                obj.longitude = longitude;
                
                motionJson.motion.push({
                    'id': indexLoop,
                    'latitude': latitude,
                    'longitude': longitude,
                    'speed': velocity,
                    'accelerationX': accelerationX,
                    'accelerationY': accelerationY,
                    'accelerationZ': accelerationZ
                });
                indexLoop++;
                //motionJson.motion.push({ jsonString });

                // Converting the JSON string with JSON.stringify()
                // then saving with localStorage in the name of session
                localStorage.setItem('motionJson', JSON.stringify(motionJson));

                // Example of how to transform the String generated through 
                // JSON.stringify() and saved in localStorage in JSON object again
                var restoredSession = JSON.parse(localStorage.getItem('motionJson'))

                jsonStringify = JSON.stringify(motionJson)
                fillJson(jsonStringify);
            }
        }

        function fillJson(jsonStringify) {
            while (json.firstChild) json.removeChild(json.firstChild);
            jsonId.innerHTML += 'Json: ' + jsonStringify + '<hr />';
        };

        function stopRecord() {
            alert("finished Recording!");
            indexLoop = 0;
            record = false;
            navigator.accelerometer.clearWatch(recordLoop);
        }

        function clearRecord() {
            while (json.firstChild) json.removeChild(json.firstChild);
            alert("cleared records!");
        }

        // onError Callback receives a Error object
        function onError(error) {
            console.log('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }
        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, getMotion, onError);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();