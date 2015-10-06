import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import Double from 'java/lang/Double';
import LineSegment from 'com/vividsolutions/jts/geom/LineSegment';
export default class SimpleMinimumClearance {
	constructor(...args) {
		(() => {
			this.inputGeom = null;
			this.minClearance = null;
			this.minClearancePts = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geom] = args;
						this.inputGeom = geom;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static getLine(g) {
		var rp = new SimpleMinimumClearance(g);
		return rp.getLine();
	}
	static getDistance(g) {
		var rp = new SimpleMinimumClearance(g);
		return rp.getDistance();
	}
	getLine() {
		this.compute();
		return this.inputGeom.getFactory().createLineString(this.minClearancePts);
	}
	updateClearance(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 3:
					return ((...args) => {
						let [candidateValue, p0, p1] = args;
						if (candidateValue < this.minClearance) {
							this.minClearance = candidateValue;
							this.minClearancePts[0] = new Coordinate(p0);
							this.minClearancePts[1] = new Coordinate(p1);
						}
					})(...args);
				case 4:
					return ((...args) => {
						let [candidateValue, p, seg0, seg1] = args;
						if (candidateValue < this.minClearance) {
							this.minClearance = candidateValue;
							this.minClearancePts[0] = new Coordinate(p);
							var seg = new LineSegment(seg0, seg1);
							this.minClearancePts[1] = new Coordinate(seg.closestPoint(p));
						}
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	compute() {
		if (this.minClearancePts !== null) return null;
		this.minClearancePts = new Array(2);
		this.minClearance = Double.MAX_VALUE;
		this.inputGeom.apply(new VertexCoordinateFilter());
	}
	getDistance() {
		this.compute();
		return this.minClearance;
	}
	getClass() {
		return SimpleMinimumClearance;
	}
}

