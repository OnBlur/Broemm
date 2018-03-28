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

        var firstPosition = [];
        var secondPosition = [];

        var options = { timeout: 1000 }; // Update every second
        
        var accelerationId = document.getElementById('acceleration');
        var speedId = document.getElementById('speed');
        
        var map = L.map('map');
        //var marker = undefined;
        
        function getCoords() {
            var lc = L.control.locate({
                locateOptions: {
                    enableHighAccuracy: true,
                    maxZoom: 17
                }
            }).addTo(map);
            
            getTiles();
            lc.start();

            navigator.geolocation.getCurrentPosition(initializePosition, onError);
            var watchID = navigator.geolocation.watchPosition(setCoords, onError, options);
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

            var element = document.getElementById('geolocation');
            element.innerHTML = 'latitude: ' + latitude + '<br />' +
                'longitude: ' + longitude + '<br />' +
                '<hr />';

            fillVelo();
            var watchChange = navigator.geolocation.watchPosition(setCoordsNew, onError, options);
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
            precisionRound(d * 1000, 3);
        }

        function precisionRound(number, precision) {
            var factor = Math.pow(10, precision);
            velocity = Math.round(number * factor) / factor;
        }

        function fillVelo() {
            speedId.innerHTML = 'Speed: ' + velocity + 'm/s' + '<br />' +
                '<hr />';
        };
        
        var onSuccessAcce = function (acceleration) {
            accelerationId.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
                'Acceleration Y: ' + acceleration.y + '<br />' +
                'Acceleration Z: ' + acceleration.z + '<br />' +
                'Timestamp: ' + acceleration.timestamp + '<br />' +
                '<hr />';
        };

        // onError Callback receives a Error object
        function onError(error) {
            console.log('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, getCoords, onError);
        var watchAcce = navigator.accelerometer.watchAcceleration(onSuccessAcce, onError, options);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();