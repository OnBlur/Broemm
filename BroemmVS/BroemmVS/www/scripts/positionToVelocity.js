// JavaScript source code
function positionToVelocity(frequency) {
    this.frequency = frequency;
    this.velocity = velocity;

    // Error handling
    this.onError(error) {
        // error notification
        console.log(
            'code: ' + error.code + '\n' + 
            'message: ' + error.message + '\n'
        );
    }

    // Calculator
    this.getPos = function () {
        var pos1 = [];
        var pos2 = [];
        var positions = [];

        return positions;
    }

    this.calcDistance = function () {
        var distance;

        this.getPos();

        return distance;
    }

    this.calcVelocity() {
        this.calcDistance();

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
    positionToVelocity();
}