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

