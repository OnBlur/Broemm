function accelerationTracker() {
    // Error handling
    this.onError = function(error) {
        // Error notification
        console.log(
            'code: ' + error.code + '\n' +
            'message: ' + error.message + '\n'
        );
    }

    this.trackAccelleration = function () {
        var accelerationPerUnit = {};
        var options = {
            frequency: 1000 // Update every second
        };

        var watchID = navigator.accelerometer.watchAcceleration(
            function (acceleration) {
                accelerationPerUnit += [
                    acceleration.x,
                    acceleration.y,
                    acceleration.z,
                    acceleration.timestamp,
                ];
                return accelerationPerUnit;
            },
            this.onError(error),
            options
        );
    }
}