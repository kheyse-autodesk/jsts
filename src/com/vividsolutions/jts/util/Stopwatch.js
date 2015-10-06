export default class Stopwatch {
	constructor(...args) {
		(() => {
			this.startTimestamp = null;
			this.totalTime = 0;
			this.isRunning = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						this.start();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static getTimeString(timeMillis) {
		var totalTimeStr = timeMillis < 10000 ? timeMillis + " ms" : timeMillis / 1000.0 + " s";
		return totalTimeStr;
	}
	getTime() {
		this.updateTotalTime();
		return this.totalTime;
	}
	stop() {
		if (this.isRunning) {
			this.updateTotalTime();
			this.isRunning = false;
		}
		return this.totalTime;
	}
	updateTotalTime() {
		var endTimestamp = System.currentTimeMillis();
		var elapsedTime = endTimestamp - this.startTimestamp;
		this.startTimestamp = endTimestamp;
		this.totalTime += elapsedTime;
	}
	split() {
		if (this.isRunning) this.updateTotalTime();
		return this.totalTime;
	}
	getTimeString() {
		var totalTime = this.getTime();
		return Stopwatch.getTimeString(totalTime);
	}
	reset() {
		this.totalTime = 0;
		this.startTimestamp = System.currentTimeMillis();
	}
	start() {
		if (this.isRunning) return null;
		this.startTimestamp = System.currentTimeMillis();
		this.isRunning = true;
	}
}

