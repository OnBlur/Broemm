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

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        var map = L.map('map').setView([53.2, 5.8], 10);

        function setCoords(position) {
            latitude = position.coords.latitude;
            alert("setCoords: ");
            Longitude = position.coords.longitude;
        }

        function onErrorGeo(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        //function getMapLocation() {
        //    navigator.geolocation.getCurrentPosition
        //        (onMapSuccess, onError, { enableHighAccuracy: true });
        //}

        function getMapLocation() {
            var watchGeo = navigator.geolocation.watchPosition(setCoords, onErrorGeo, options);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            var marker = L.marker([53.2, 5.8]).addTo(map);
            alert("getMapLocation: ");
        }
        
        //// Success callback for get geo coordinates
        //var onMapSuccess = function (position) {
        //    Latitude = position.coords.latitude;
        //    Longitude = position.coords.longitude;
            
        //    getMap(Latitude, Longitude);
        //}

        //// Get map by using coordinates
        //function getMap(latitude, longitude) {

        //    var mapOptions = {
        //        center: new google.maps.LatLng(0, 0),
        //        zoom: 1,
        //        mapTypeId: google.maps.MapTypeId.ROADMAP
        //    };

        //    map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //    var latLong = new google.maps.LatLng(latitude, longitude);

        //    var marker = new google.maps.Marker({
        //        position: latLong
        //    });

        //    marker.setMap(map);
        //    map.setZoom(15);
        //    map.setCenter(marker.getPosition());
        //}

        //// Success callback for watching your changing position
        //var onMapWatchSuccess = function (position) {
        //    var updatedLatitude = position.coords.latitude;
        //    var updatedLongitude = position.coords.longitude;
            
        //    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        //        Latitude = updatedLatitude;
        //        Longitude = updatedLongitude;

        //        getMap(updatedLatitude, updatedLongitude);
        //    }    
        //}

        //// Watch your changing position
        //function watchMapPosition() {
        //    return navigator.geolocation.watchPosition
        //        (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
        //}

        //var onSuccessGeo = function (position) {
        //    var element = document.getElementById('geolocation');
        //    element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
        //        'Longitude: ' + position.coords.longitude + '<br />' + '<hr />';
        //};

        var onSuccessAcce = function (acceleration) {
            var element = document.getElementById('acceleration');
            element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
                'Acceleration Y: ' + acceleration.y + '<br />' +
                'Acceleration Z: ' + acceleration.z + '<br />' +
                'Timestamp: ' + acceleration.timestamp + '<br />' +
                '<hr />';
        };

        // Ask for geo permission
        function success(status) {
            if (!status.hasPermission) error();
            // Run geotracker if permissions are valid
            getMapLocation();
        }

        // onError Callback receives a Error object
        function onError(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        var options = { frequency: 1000 };  // Update every second

        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, success, onError);
        var watchAcce = navigator.accelerometer.watchAcceleration(onSuccessAcce, onError, options);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();