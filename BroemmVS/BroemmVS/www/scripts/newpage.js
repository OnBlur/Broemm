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

        // P
        var ridesId = document.getElementById("rides");
        var valuesId = document.getElementById("values");
        
        var restoredSession = [];

        // Functions
        // Get all values from localStorage
        var stringJson = JSON.parse(localStorage.getItem("valueStorage"));
        var amoutRides = stringJson[1];

        // Onclick buttons with functions
        getRidesId.onclick = function () { getRides(); };
        fillValuesId.onclick = function () { fillValues(); };

        // Clear localStorage and check if its really cleared
        clearLocalStorageId.onclick = function () {
            localStorage.clear();
            if (localStorage.length == 0) {
                alert("Cleared");
            }
        }
        
        function getRides() {
            var storageLenght = JSON.parse(localStorage.getItem('motionJson'));
            var i = 0;

            while (i < amoutRides.length) {
                restoredSession[i] = JSON.parse(localStorage.getItem('motionJson' + i))
                stringJson[i] = JSON.stringify(restoredSession[i]);

                ridesId.innerHTML += 'Rit: ' + i + '<br />' + stringJson[i] + '<hr />';
                i++;
            }
        }

        function fillValues() {
            if (stringJson.length >= 0) {
                valuesId.innerHTML += 'Waarden: ' + '<br />' + stringJson + '<hr />';
            } 
            else {
                alert("save de waarden eerst!")
            }
        }
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();