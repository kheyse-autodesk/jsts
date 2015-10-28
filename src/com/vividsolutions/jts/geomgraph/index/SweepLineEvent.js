import Comparable from 'java/lang/Comparable';
export default class SweepLineEvent {
	constructor(...args) {
		(() => {
			this.label = null;
			this.xValue = null;
			this.eventType = null;
			this.insertEvent = null;
			this.deleteEventIndex = null;
			this.obj = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Comparable];
	}
	static get INSERT() {
		return 1;
	}
	static get DELETE() {
		return 2;
	}
	static createDelete(x, insertEvent) {
		var e = new SweepLineEvent();
		e.eventType = SweepLineEvent.DELETE;
		e.xValue = x;
		e.insertEvent = insertEvent;
		return e;
	}
	static createInsertWithLabelAndObject(x, label, obj) {
		var e = SweepLineEvent.createInsertWithLabel(x, label);
		e.obj = obj;
		return e;
	}
	static createInsert(x) {
		var e = new SweepLineEvent();
		e.eventType = SweepLineEvent.INSERT;
		e.xValue = x;
		return e;
	}
	static createInsertWithLabel(x, label) {
		var e = SweepLineEvent.createInsert(x);
		e.label = label;
		return e;
	}
	isDelete() {
		return this.eventType === SweepLineEvent.DELETE;
	}
	setDeleteEventIndex(deleteEventIndex) {
		this.deleteEventIndex = deleteEventIndex;
	}
	getObject() {
		return this.obj;
	}
	compareTo(o) {
		var pe = o;
		if (this.xValue < pe.xValue) return -1;
		if (this.xValue > pe.xValue) return 1;
		if (this.eventType < pe.eventType) return -1;
		if (this.eventType > pe.eventType) return 1;
		return 0;
	}
	getInsertEvent() {
		return this.insertEvent;
	}
	isInsert() {
		return this.eventType === SweepLineEvent.INSERT;
	}
	isSameLabel(ev) {
		if (this.label === null) return false;
		return this.label === ev.label;
	}
	getDeleteEventIndex() {
		return this.deleteEventIndex;
	}
	getClass() {
		return SweepLineEvent;
	}
}

