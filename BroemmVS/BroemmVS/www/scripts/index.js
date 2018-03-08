﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        var onSuccess = function (position) {
            document.getElementById("latitude").textContent = "latitude: " + position.coords.latitude;
            document.getElementById("longitude").textContent = "longitude: " + position.coords.longitude;
            document.getElementById("altitude").textContent = "altitude: " + position.coords.altitude;
            document.getElementById("accuracy").textContent = "accuracy: " + position.coords.altitude;
            document.getElementById("altitudeAccuracy").textContent = "Altitude Accuracy: " + position.coords.altitudeAccuracy;
            document.getElementById("heading").textContent = "heading: " + position.coords.heading;
            document.getElementById("speed").textContent = "speed: " + position.coords.speed;
            document.getElementById("timestamp").textContent = "timestamp: " + position.coords.timestamp;
        };

        // onError Callback receives a PositionError object
        function onError(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();