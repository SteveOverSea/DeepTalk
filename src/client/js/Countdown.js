export default class Countdown {

    constructor(minutes, seconds) {
        this.minutes = minutes;
        this.seconds = seconds;
        this.countdownInterval;
        this.intervalCallback = () => {};
        this.endCallback = () => {};
    }

    start() {
        this.countdownInterval = setInterval(() => {
            this.intervalCallback();

            if (this.minutes == 0 && this.seconds == 0) {
                this.endCallback();
                this.stop();
            } else {
                if (this.seconds == 0) {
                    this.minutes--;
                    this.seconds = 59;
                } else {
                    this.seconds--;
                }
            }
        }, 1000)
    }

    stop() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }
}