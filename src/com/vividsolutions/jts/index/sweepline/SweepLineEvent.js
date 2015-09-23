function SweepLineEvent(x, insertEvent, sweepInt) {
	this.xValue = null;
	this.eventType = null;
	this.insertEvent = null;
	this.deleteEventIndex = null;
	this.sweepInt = null;
	if (arguments.length === 0) return;
	this.xValue = x;
	this.insertEvent = insertEvent;
	this.eventType = SweepLineEvent.INSERT;
	if (insertEvent !== null) this.eventType = SweepLineEvent.DELETE;
	this.sweepInt = sweepInt;
}
module.exports = SweepLineEvent
SweepLineEvent.prototype.getInterval = function () {
	return this.sweepInt;
};
SweepLineEvent.prototype.isDelete = function () {
	return this.insertEvent !== null;
};
SweepLineEvent.prototype.setDeleteEventIndex = function (deleteEventIndex) {
	this.deleteEventIndex = deleteEventIndex;
};
SweepLineEvent.prototype.compareTo = function (o) {
	var pe = o;
	if (this.xValue < pe.xValue) return -1;
	if (this.xValue > pe.xValue) return 1;
	if (this.eventType < pe.eventType) return -1;
	if (this.eventType > pe.eventType) return 1;
	return 0;
};
SweepLineEvent.prototype.getInsertEvent = function () {
	return this.insertEvent;
};
SweepLineEvent.prototype.isInsert = function () {
	return this.insertEvent === null;
};
SweepLineEvent.prototype.getDeleteEventIndex = function () {
	return this.deleteEventIndex;
};
SweepLineEvent.INSERT = 1;
SweepLineEvent.DELETE = 2;

