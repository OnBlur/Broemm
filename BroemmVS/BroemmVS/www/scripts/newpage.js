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

        // Initialize variables
        // Buttons
        var getRidesId = document.getElementById("getRides");
        var fillValuesId = document.getElementById("fillValues");
        var clearLocalStorageId = document.getElementById("clearLocalStorage");

        // Paragraphs
        var ridesId = document.getElementById("rides");
        var valuesId = document.getElementById("values");
        
        var rides = [];
        var rideCounter = 1;
        var valueStorage = [];
        var amountRides = [];
        var restoredSession = [];
        var stringMotionJson = [];

        // Functions
        // Onclick buttons with functions
        getRidesId.onclick = function () {
            getRides();
        };
        fillValuesId.onclick = function () { fillValues(); };

        // Get all values from localStorage
        function getAll() {
            if (localStorage.length == 0) {                                         // If localStorage is empty then show alert
                alert("localStorage is empty");
            }
            else {
                valueStorage = JSON.parse(localStorage.getItem("valueStorage"));    // Fill valueStorage with values from valueStorage localStorage
                amountRides = valueStorage[1];                                       // Get amount of rides from valueStorage at position 1
                alert("rides: " + amountRides.length);
            }
        }
        
        function getRides() {
            getAll();
            var i = 0;

            while (i < amountRides.length) {
                var ride = 'ride' + rideCounter;
                rides.push(ride);

                restoredSession[i] = JSON.parse(localStorage.getItem(rides[i]));
                stringMotionJson[i] = JSON.stringify(restoredSession[i]);

                ridesId.innerHTML += 'Rit: ' + rideCounter + '<br />' + stringMotionJson[i] + '<hr />';
                rideCounter++;
                i++;
            }
        }

        // Check if 
        function fillValues() {
            getAll();
            valuesId.innerHTML += 'Waarden: ' + '<br />' + valueStorage + '<hr />';
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