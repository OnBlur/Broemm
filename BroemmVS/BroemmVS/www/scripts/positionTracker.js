function positionTracker() {
    // Error handling
    this.onError(error) {
        // Error notification
        console.log(
            'code: ' + error.code + '\n' +
            'message: ' + error.message + '\n'
        );
    }

    this.trackPosition(unit) {
        /* code here */
    }
}