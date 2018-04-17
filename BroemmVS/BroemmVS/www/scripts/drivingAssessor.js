import "accellerationTracker";
import "positionTracker";

function drivingAssessor() {
    // Error handling
    this.onError(error) {
        // Error notification
        console.log(
            'code: ' + error.code + '\n' +
            'message: ' + error.message + '\n'
        );
    }

    this.assessPullup(positions, accelerations) {
        /* code here */
    }
}