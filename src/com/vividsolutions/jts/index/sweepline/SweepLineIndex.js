function SweepLineIndex() {
	this.events = new ArrayList();
	this.indexBuilt = null;
	this.nOverlaps = null;
	if (arguments.length === 0) return;
}
module.exports = SweepLineIndex
var SweepLineEvent = require('com/vividsolutions/jts/index/sweepline/SweepLineEvent');
var Collections = require('java/util/Collections');
var ArrayList = require('java/util/ArrayList');
SweepLineIndex.prototype.computeOverlaps = function (action) {
	this.nOverlaps = 0;
	this.buildIndex();
	for (var i = 0; i < this.events.size(); i++) {
		var ev = this.events.get(i);
		if (ev.isInsert()) {
			this.processOverlaps(i, ev.getDeleteEventIndex(), ev.getInterval(), action);
		}
	}
};
SweepLineIndex.prototype.processOverlaps = function (start, end, s0, action) {
	for (var i = start; i < end; i++) {
		var ev = this.events.get(i);
		if (ev.isInsert()) {
			var s1 = ev.getInterval();
			action.overlap(s0, s1);
			this.nOverlaps++;
		}
	}
};
SweepLineIndex.prototype.buildIndex = function () {
	if (this.indexBuilt) return null;
	Collections.sort(this.events);
	for (var i = 0; i < this.events.size(); i++) {
		var ev = this.events.get(i);
		if (ev.isDelete()) {
			ev.getInsertEvent().setDeleteEventIndex(i);
		}
	}
	this.indexBuilt = true;
};
SweepLineIndex.prototype.add = function (sweepInt) {
	var insertEvent = new SweepLineEvent(sweepInt.getMin(), null, sweepInt);
	this.events.add(insertEvent);
	this.events.add(new SweepLineEvent(sweepInt.getMax(), insertEvent, sweepInt));
};

