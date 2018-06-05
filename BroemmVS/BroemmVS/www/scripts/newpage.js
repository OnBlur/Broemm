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

        // Buttons
        var getRidesId = document.getElementById("getRides");
        var fillValuesId = document.getElementById("fillValues");
        var clearLocalStorageId = document.getElementById("clearLocalStorage");

        // Paragraphs
        var ridesId = document.getElementById("rides");
        var valuesId = document.getElementById("values");
        
        var valueStorage;
        var rides = [];
        var stringMotionJson = [];
        var restoredSession = [];

        var lastLat;
        var lastLon;
        
        // Functions
        // Onclick buttons with functions
        getRidesId.onclick = function () {
            getAll();
            getCityName();
        };

        // Get all values from localStorage
        function getAll() {
            if (localStorage.length == 0) {                                         // If localStorage is empty then show alert
                alert("localStorage is empty");
            }
            else {
                valueStorage = JSON.parse(localStorage.getItem("amountRides"));    // Fill valueStorage with values from valueStorage localStorage

                for (var i = 1; i <= valueStorage; i++) {
                    var ride = 'ride' + i;
                    rides.push(ride);
                }
                alert("rides: " + valueStorage);
            }
        }

        // Reverse Geocoding with Google Maps
        function getReverseGeocodingData(lat, lng, rideCounter, stringMotionJson, i) {
            var latlng = new google.maps.LatLng(lat, lng);

            // This is making the Geocode request
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status !== google.maps.GeocoderStatus.OK) {
                    alert(status);
                }
                // This is checking to see if the Geoeode Status is OK before proceeding
                if (status == google.maps.GeocoderStatus.OK) {
                    var streetNameStart = (results[0].address_components[3].long_name);
                    ridesId.innerHTML += 'Rit: ' + rideCounter + " | " + streetNameStart + " > " + "wolo" + '<br />' + stringMotionJson[i] + '<hr />';
                }
            });
        }
        
        function getCityName() {
            var streetNameStop;
            var rideCounter = 1;
            var latitude = [];
            var longitude = [];
            
            var i = 0;
            
            while (i < valueStorage) {
                restoredSession[i] = JSON.parse(localStorage.getItem(rides[i]));
                stringMotionJson[i] = JSON.stringify(restoredSession[i]);
                
                for (var y = 0; y < restoredSession[i].motion.length; y++) {
                    var motions = restoredSession[i].motion[y];
                    latitude.push(motions.latitude);
                    longitude.push(motions.longitude);
                }

                getReverseGeocodingData(latitude[rideCounter], longitude[rideCounter], rideCounter, stringMotionJson, i);

                rideCounter++;
                i++;
            }
            //lastLat = latitude.slice(-1)[0];
            //lastLon = longitude.slice(-1)[0];
            //alert(lastLat + LastLon);
        }

        // Clear localStorage and check if its really cleared
        clearLocalStorageId.onclick = function () {
            localStorage.clear();
            if (localStorage.length == 0) {
                alert("Cleared");
            }
        };
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }
} )();