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
        
        // Functions
        // Onclick buttons with functions
        getRidesId.onclick = function () {
            getAll();
            getCityName();
        };

        // Get all values from localStorage
        function getAll() {
            if (localStorage.length === 0) {                                         // If localStorage is empty then show alert
                alert("localStorage is empty");
            }
            else {
                valueStorage = localStorage.getItem("amountRides");    // Fill valueStorage with values from valueStorage localStorage

                for (var i = 1; i <= valueStorage; i++) {
                    var ride = 'ride' + i;
                    rides.push(ride);
                }
                alert("rides: " + valueStorage);
            }
        }
        
        function getCityName() {
            var rideCounter = 1;
            var cities = [];
            var startCity = [];
            var endCity = [];
            var i = 0;
            
            while (i < valueStorage) {

                restoredSession[i] = JSON.parse(localStorage.getItem(rides[i]));
                stringMotionJson[i] = JSON.stringify(restoredSession[i]);
                
                for (var y = 0; y < restoredSession[i].motion.length; y++) {
                    var motions = restoredSession[i].motion[y];

                    cities.push(motions.cityName);
                    alert(cities);
                }

                ridesId.innerHTML += 'Rit: ' + rideCounter + " | " + cities[0] + " > " + cities[cities.length - 1] + '<br />' + stringMotionJson[i] + '<hr />';
                rideCounter++;
                i++;
            }
        }

        // Clear localStorage and check if its really cleared
        clearLocalStorageId.onclick = function () {
            localStorage.clear();
            if (localStorage.length === 0) {
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