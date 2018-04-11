// JavaScript source code
function positionToVelocity(frequency) {
    this.frequency = { timeout: frequency };

    // Error handling
    this.onError(error) {
        // error notification
        console.log(
            'code: ' + error.code + '\n' + 
            'message: ' + error.message + '\n'
        );
    }

    // Calculator
    this.getCoordinates = function (onSuccess) {
        navigator.geolocation.watchPosition(onSuccess, onError, frequency);
    }

    this.getPositions = function () {
        var pos1 = [];
        var pos2 = [];

        // calculations
        this.getCoordinates(function () {
            pos1 = [position.coords.latitude, position.coords.longitude];
        });
        this.getCoordinates(function () {
            pos2 = [position.coords.latitude, position.coords.longitude];
        });

        var positions = [pos1, pos2];
        return positions;
    }

    this.calcDistance = function () {
        var pos = this.getPos();
        var distance;

        // calculations

        return distance;
    }

    this.calcVelocity() {
        var d = this.calcDistance();
        var velocity;

        // calculations

        return velocity;
    }

    this.gpsCheck = function () {
        var permissions = cordova.plugins.permissions;
        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION,
            function (status) {
                // successCallback
                console.log('Got permission for using GPS.');
                this.calcVelocity();
            }, this.onerror);
    }
    
    //this.displayData();

    // Initially execute
    this.gpsCheck();
}

while (true) {
    positionToVelocity(1000);
}