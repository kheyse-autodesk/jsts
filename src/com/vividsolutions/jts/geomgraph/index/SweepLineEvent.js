function SweepLineEvent(...args) {
	this.label = null;
	this.xValue = null;
	this.eventType = null;
	this.insertEvent = null;
	this.deleteEventIndex = null;
	this.obj = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [x, insertEvent] = args;
				this.eventType = SweepLineEvent.DELETE;
				this.xValue = x;
				this.insertEvent = insertEvent;
			})(...args);
		case 3:
			return ((...args) => {
				let [label, x, obj] = args;
				this.eventType = SweepLineEvent.INSERT;
				this.label = label;
				this.xValue = x;
				this.obj = obj;
			})(...args);
	}
}
module.exports = SweepLineEvent
SweepLineEvent.prototype.isDelete = function () {
	return this.eventType === SweepLineEvent.DELETE;
};
SweepLineEvent.prototype.setDeleteEventIndex = function (deleteEventIndex) {
	this.deleteEventIndex = deleteEventIndex;
};
SweepLineEvent.prototype.getObject = function () {
	return this.obj;
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
	return this.eventType === SweepLineEvent.INSERT;
};
SweepLineEvent.prototype.isSameLabel = function (ev) {
	if (this.label === null) return false;
	return this.label === ev.label;
};
SweepLineEvent.prototype.getDeleteEventIndex = function () {
	return this.deleteEventIndex;
};
SweepLineEvent.INSERT = 1;
SweepLineEvent.DELETE = 2;

