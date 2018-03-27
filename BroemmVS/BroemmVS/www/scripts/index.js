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

        var Latitude = undefined;
        var Longitude = undefined;

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

            var watchID = navigator.geolocation.watchPosition(setCoords, onError, { timeout: 10000 });
        }

        function getTiles() {
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }
        
        function setCoords(position) {
            Latitude = position.coords.latitude;
            Longitude = position.coords.longitude;

            var element = document.getElementById('geolocation');
            element.innerHTML = 'Latitude: ' + Latitude + '<br />' +
                'Longitude: ' + Longitude + '<br />' +
                '<hr />';
            
            //map = L.map('map').setView([Latitude, Longitude], 15);
            //marker = L.marker([Latitude, Longitude]).addTo(map);
        }
        
        var onSuccessAcce = function (acceleration) {
            accelerationId.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
                'Acceleration Y: ' + acceleration.y + '<br />' +
                'Acceleration Z: ' + acceleration.z + '<br />' +
                'Timestamp: ' + acceleration.timestamp + '<br />' +
                '<hr />';
        };

        // Ask for geo permission
        function successPerm(status) {
            if (!status.hasPermission) error();
            // Run geotracker if permissions are valid
            getCoords();
        }

        // onError Callback receives a Error object
        function onError(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        var options = { frequency: 1000 };  // Update every second

        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, successPerm, onError);
        var watchAcce = navigator.accelerometer.watchAcceleration(onSuccessAcce, onError, options);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();