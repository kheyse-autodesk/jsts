import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import Quadrant from 'com/vividsolutions/jts/geomgraph/Quadrant';
import Assert from 'com/vividsolutions/jts/util/Assert';
export default class HalfEdge {
	constructor(...args) {
		(() => {
			this.orig = null;
			this.sym = null;
			this.next = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [orig] = args;
						this.orig = orig;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static init(e0, e1) {
		if (e0.sym !== null || e1.sym !== null || e0.next !== null || e1.next !== null) throw new IllegalStateException("Edges are already initialized");
		e0.init(e1);
		return e0;
	}
	static create(p0, p1) {
		var e0 = new HalfEdge(p0);
		var e1 = new HalfEdge(p1);
		e0.init(e1);
		return e0;
	}
	find(dest) {
		var oNext = this;
		do {
			if (oNext === null) return null;
			if (oNext.dest().equals2D(dest)) return oNext;
			oNext = oNext.oNext();
		} while (oNext !== this);
		return null;
	}
	dest() {
		return this.sym.orig;
	}
	oNext() {
		return this.sym.next;
	}
	insert(e) {
		if (this.oNext() === this) {
			this.insertAfter(e);
			return null;
		}
		var ecmp = this.compareTo(e);
		var ePrev = this;
		do {
			var oNext = ePrev.oNext();
			var cmp = oNext.compareTo(e);
			if (cmp !== ecmp || oNext === this) {
				ePrev.insertAfter(e);
				return null;
			}
			ePrev = oNext;
		} while (ePrev !== this);
		Assert.shouldNeverReachHere();
	}
	insertAfter(e) {
		Assert.equals(this.orig, e.orig());
		var save = this.oNext();
		this.sym.setNext(e);
		e.sym().setNext(save);
	}
	degree() {
		var degree = 0;
		var e = this;
		do {
			degree++;
			e = e.oNext();
		} while (e !== this);
		return degree;
	}
	equals(p0, p1) {
		return this.orig.equals2D(p0) && this.sym.orig.equals(p1);
	}
	deltaY() {
		return this.sym.orig.y - this.orig.y;
	}
	sym() {
		return this.sym;
	}
	prev() {
		return this.sym;
	}
	compareAngularDirection(e) {
		var dx = this.deltaX();
		var dy = this.deltaY();
		var dx2 = e.deltaX();
		var dy2 = e.deltaY();
		if (dx === dx2 && dy === dy2) return 0;
		var quadrant = Quadrant.quadrant(dx, dy);
		var quadrant2 = Quadrant.quadrant(dx2, dy2);
		if (quadrant > quadrant2) return 1;
		if (quadrant < quadrant2) return -1;
		return CGAlgorithms.computeOrientation(e.orig, e.dest(), this.dest());
	}
	prevNode() {
		var e = this;
		while (e.degree() === 2) {
			e = e.prev();
			if (e === this) return null;
		}
		return e;
	}
	compareTo(obj) {
		var e = obj;
		var comp = this.compareAngularDirection(e);
		return comp;
	}
	next() {
		return this.next;
	}
	setSym(e) {
		this.sym = e;
	}
	orig() {
		return this.orig;
	}
	toString() {
		return "HE(" + this.orig.x + " " + this.orig.y + ", " + this.sym.orig.x + " " + this.sym.orig.y + ")";
	}
	setNext(e) {
		this.next = e;
	}
	init(e) {
		this.setSym(e);
		e.setSym(this);
		this.setNext(e);
		e.setNext(this);
	}
	deltaX() {
		return this.sym.orig.x - this.orig.x;
	}
}

