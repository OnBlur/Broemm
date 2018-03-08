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
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        var onSuccessGeo = function (position) {
            var element = document.getElementById('geolocation');
            element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
                'Longitude: ' + position.coords.longitude + '<br />' + '<hr />';
        };

        function onSuccessAcce(acceleration) {
            document.getElementById("accelerationX").textContent = "Acceleration X: " + acceleration.x;
            document.getElementById("accelerationY").textContent = "Acceleration Y: " + acceleration.y;
            document.getElementById("accelerationZ").textContent = "Acceleration Z: " + acceleration.z;
            document.getElementById("timestamp").textContent = "Timestamp: " + acceleration.timestamp;
        }

        // onError Callback receives a PositionError object
        function onErrorGeo(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        function onErrorAcce() {
            alert('onError!');
        }

        var options = { frequency: 3000 };  // Update every 3 seconds
        
        var watchID = navigator.geolocation.watchPosition(onSuccessGeo, onErrorGeo, { timeout: 30000 });
        var watchID = navigator.accelerometer.watchAcceleration(onSuccessAcce, onErrorAcce, options);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();