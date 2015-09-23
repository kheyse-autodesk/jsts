function Stopwatch() {
	this.startTimestamp = null;
	this.totalTime = 0;
	this.isRunning = false;
	if (arguments.length === 0) return;
	this.start();
}
module.exports = Stopwatch
Stopwatch.prototype.getTime = function () {
	this.updateTotalTime();
	return this.totalTime;
};
Stopwatch.prototype.stop = function () {
	if (this.isRunning) {
		this.updateTotalTime();
		this.isRunning = false;
	}
	return this.totalTime;
};
Stopwatch.prototype.updateTotalTime = function () {
	var endTimestamp = System.currentTimeMillis();
	var elapsedTime = endTimestamp - this.startTimestamp;
	this.startTimestamp = endTimestamp;
	this.totalTime += elapsedTime;
};
Stopwatch.prototype.split = function () {
	if (this.isRunning) this.updateTotalTime();
	return this.totalTime;
};
Stopwatch.prototype.getTimeString = function () {
	var totalTime = this.getTime();
	return Stopwatch.getTimeString(totalTime);
};
Stopwatch.prototype.reset = function () {
	this.totalTime = 0;
	this.startTimestamp = System.currentTimeMillis();
};
Stopwatch.prototype.start = function () {
	if (this.isRunning) return null;
	this.startTimestamp = System.currentTimeMillis();
	this.isRunning = true;
};
Stopwatch.getTimeString = function (timeMillis) {
	var totalTimeStr = timeMillis < 10000 ? timeMillis + " ms" : timeMillis / 1000.0 + " s";
	return totalTimeStr;
};

