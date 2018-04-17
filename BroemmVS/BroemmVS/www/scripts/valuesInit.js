(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        // Do other things
        console.log("'valuesInit.js' is loaded");

        try {
            import * as drivingAssessor from "/www/scripts/drivingAssessor.js";
            //var startAssessing = new drivingAssessor.assessPullup();
            //console.log("startAssessing: " + startAssessing);
            console.log("'drivingAssessor' is loaded");
        } catch (ex) {
            console.log(ex);
            console.log("'drivingAssessor' is not loaded");
        }
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();
