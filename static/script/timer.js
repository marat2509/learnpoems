(function () {
    "use strict";
    var Timer = window.Timer = function ($min, $sec, onOverTime) {
        this.notInTime = 0;
        this.$min = $min;
        this.$sec = $sec;
        this.onOverTime = onOverTime;
        this.isWorking = false;
        this.times = [];
        this.startTime = 0;
        this.minTime = 0;
    };

    Timer.prototype.prepareCnt = function() {
        this.countdownMode = true;
        if (this.minTime == 0) {
            var min = this.times[0];
            for (var a in this.times) {
                if (this.times[a] < min) {
                    min = this.times[a];
                }
            }
            this.minTime = min;
        }
        var minutes = Math.floor(this.minTime/1000/60);
        var seconds = Math.ceil((this.minTime - minutes*1000*60)/1000);
        this.render(minutes, seconds);
    }

    Timer.prototype.forceStart = function() {
        this.isWorking = true;
        this.startTime = new Date(Date.now());
        if (this.countdownMode === true) {
            this.update();
        } else {
            this.countdownMode = false;
        }
    };

    Timer.prototype.forceStop = function(count) {
        this.isWorking = false;
        if (this.countdownMode) {
            this.notInTime = 0;
        } else if (count !== null) {
            var howMuchTime = new Date(Date.now()) - this.startTime;
            this.times.push(howMuchTime);
        }
    };

    Timer.prototype.render = function(min, sec) {
        if (min < 10) { min = "0" + min; }
        if (sec < 10) { sec = "0" + sec; }
        this.$min.text(min);
        this.$sec.text(sec);
    };

    Timer.prototype.update = function() {
        if (!this.isWorking) {return;}
        var now = new Date(Date.now());
        var timeLeft = this.minTime - (now - this.startTime);
        var minutes = Math.floor(timeLeft/1000/60);
        var seconds = Math.ceil((timeLeft - minutes*1000*60)/1000);
        this.render(minutes, seconds);
        if (minutes < 0 || seconds < 0) {
            this.notInTime++;
            this.isAlive = false;
            if (this.notInTime > 1) {
                if (0.25*this.minTime < 1000) {
                    this.minTime += 2500;
                } else {
                    this.minTime *= 1.25;
                }
                this.onOverTime(true);
                this.notInTime = 0;
            } else {
                this.onOverTime();
            }
            return;
        }
        var _this = this;
        setTimeout(function() {_this.update();},100);
    };
})();
