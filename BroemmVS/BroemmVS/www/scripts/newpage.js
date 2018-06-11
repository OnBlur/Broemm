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

        var streetNameStart;
        var streetNameStop;
        
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

        function reverseGeocodeQuery(lat, lon) {
            var format = "json";
            var zoom = 13;

            var url = "https://nominatim.openstreetmap.org/reverse?format=" + format + "&lat=" + lat + "&lon=" + lon + "&zoom=" + zoom + "&addressdetails=1";
            return url;
        }

        function makeRequest(url, done, rideCounter, stringMotionJson, i, bool) {
            var xhr = new XMLHttpRequest();

            xhr.open('Get', url);

            xhr.onload = function () {
                done(null, xhr.response, rideCounter, stringMotionJson, i, bool);
            };

            xhr.onerror = function () {
                done(xhr.response);
            };

            xhr.send();
        }

        function yourCallBackFunction(err, data, rideCounter, stringMotionJson, i, bool) {
            if (err) {
                //Do something with the error 
            } else {
                var cityName = JSON.parse(data);

                if (bool) {
                    streetNameStop = cityName.address.suburb;
                }
                else {
                    streetNameStart = cityName.address.suburb;
                    ridesId.innerHTML += 'Rit: ' + rideCounter + " | " + streetNameStart + " > " + streetNameStop + '<br />' + stringMotionJson[i] + '<hr />';
                }
                //data  is the json response that you recieved from the server
            }
        }
        
        function getCityName() {
            var rideCounter = 1;
            var latitude = [];
            var longitude = [];
            var i = 0;
            
            while (i < valueStorage) {
                var bool = true;
                var url;
                var data;

                restoredSession[i] = JSON.parse(localStorage.getItem(rides[i]));
                stringMotionJson[i] = JSON.stringify(restoredSession[i]);
                
                for (var y = 0; y < restoredSession[i].motion.length; y++) {
                    var motions = restoredSession[i].motion[y];
                    latitude.push(motions.latitude);
                    longitude.push(motions.longitude);
                }
                
                url = reverseGeocodeQuery(latitude[longitude.length - 1], longitude[longitude.length - 1]);
                data = makeRequest(url, yourCallBackFunction, rideCounter, stringMotionJson, i, bool);


                bool = false;
                url = reverseGeocodeQuery(latitude[i], longitude[i]);
                data = makeRequest(url, yourCallBackFunction, rideCounter, stringMotionJson, i, bool);

                rideCounter++;
                i++;
            }
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