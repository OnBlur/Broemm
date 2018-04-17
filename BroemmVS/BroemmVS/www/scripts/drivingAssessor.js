import "accelerationTracker";
import "positionTracker";

function drivingAssessor() {
    // Error handling
    this.onError = function(error) {
        // Error notification
        console.log(
            'code: ' + error.code + '\n' +
            'message: ' + error.message + '\n'
        );
    }

    this.assessPullup = function (positions, accelerations) {
        console.log("drivingAssessor: assessPullup initialized");
        accelerationId.innerHTML = 
            accelerationTracker.trackAccelleration() +
            '<br>' + '<hr>';
    }
    module.exports = drivingAssessor;
}