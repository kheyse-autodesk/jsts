import WKTWriter from 'com/vividsolutions/jts/io/WKTWriter';
import LineSegment from 'com/vividsolutions/jts/geom/LineSegment';
export default class QuadEdge {
	constructor(...args) {
		(() => {
			this.rot = null;
			this.vertex = null;
			this.next = null;
			this.data = null;
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
		return [];
	}
	static makeEdge(o, d) {
		var q0 = new QuadEdge();
		var q1 = new QuadEdge();
		var q2 = new QuadEdge();
		var q3 = new QuadEdge();
		q0.rot = q1;
		q1.rot = q2;
		q2.rot = q3;
		q3.rot = q0;
		q0.setNext(q0);
		q1.setNext(q3);
		q2.setNext(q2);
		q3.setNext(q1);
		var base = q0;
		base.setOrig(o);
		base.setDest(d);
		return base;
	}
	static swap(e) {
		var a = e.oPrev();
		var b = e.sym().oPrev();
		QuadEdge.splice(e, a);
		QuadEdge.splice(e.sym(), b);
		QuadEdge.splice(e, a.lNext());
		QuadEdge.splice(e.sym(), b.lNext());
		e.setOrig(a.dest());
		e.setDest(b.dest());
	}
	static splice(a, b) {
		var alpha = a.oNext().rot();
		var beta = b.oNext().rot();
		var t1 = b.oNext();
		var t2 = a.oNext();
		var t3 = beta.oNext();
		var t4 = alpha.oNext();
		a.setNext(t1);
		b.setNext(t2);
		alpha.setNext(t3);
		beta.setNext(t4);
	}
	static connect(a, b) {
		var e = QuadEdge.makeEdge(a.dest(), b.orig());
		QuadEdge.splice(e, a.lNext());
		QuadEdge.splice(e.sym(), b);
		return e;
	}
	equalsNonOriented(qe) {
		if (this.equalsOriented(qe)) return true;
		if (this.equalsOriented(qe.sym())) return true;
		return false;
	}
	toLineSegment() {
		return new LineSegment(this.vertex.getCoordinate(), this.dest().getCoordinate());
	}
	dest() {
		return this.sym().orig();
	}
	oNext() {
		return this.next;
	}
	equalsOriented(qe) {
		if (this.orig().getCoordinate().equals2D(qe.orig().getCoordinate()) && this.dest().getCoordinate().equals2D(qe.dest().getCoordinate())) return true;
		return false;
	}
	dNext() {
		return this.sym().oNext().sym();
	}
	lPrev() {
		return this.next.sym();
	}
	rPrev() {
		return this.sym().oNext();
	}
	rot() {
		return this.rot;
	}
	oPrev() {
		return this.rot.next.rot;
	}
	sym() {
		return this.rot.rot;
	}
	setOrig(o) {
		this.vertex = o;
	}
	lNext() {
		return this.invRot().oNext().rot();
	}
	getLength() {
		return this.orig().getCoordinate().distance(this.dest().getCoordinate());
	}
	invRot() {
		return this.rot.sym();
	}
	setDest(d) {
		this.sym().setOrig(d);
	}
	setData(data) {
		this.data = data;
	}
	getData() {
		return this.data;
	}
	delete() {
		this.rot = null;
	}
	orig() {
		return this.vertex;
	}
	rNext() {
		return this.rot.next.invRot();
	}
	toString() {
		var p0 = this.vertex.getCoordinate();
		var p1 = this.dest().getCoordinate();
		return WKTWriter.toLineString(p0, p1);
	}
	isLive() {
		return this.rot !== null;
	}
	getPrimary() {
		if (this.orig().getCoordinate().compareTo(this.dest().getCoordinate()) <= 0) return this; else return this.sym();
	}
	dPrev() {
		return this.invRot().oNext().invRot();
	}
	setNext(next) {
		this.next = next;
	}
}

