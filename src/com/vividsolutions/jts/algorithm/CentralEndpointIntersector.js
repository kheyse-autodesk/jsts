import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import Double from 'java/lang/Double';
export default class CentralEndpointIntersector {
	constructor(...args) {
		(() => {
			this.pts = null;
			this.intPt = null;
			this.minDist = Double.MAX_VALUE;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 4:
					return ((...args) => {
						let [p00, p01, p10, p11] = args;
						this.pts = [p00, p01, p10, p11];
						this.compute();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static average(pts) {
		var avg = new Coordinate();
		var n = pts.length;
		for (var i = 0; i < pts.length; i++) {
			avg.x += this.x;
			avg.y += this.y;
		}
		if (n > 0) {
			avg.x /= n;
			avg.y /= n;
		}
		return avg;
	}
	static getIntersection(p00, p01, p10, p11) {
		var intor = new CentralEndpointIntersector(p00, p01, p10, p11);
		return intor.getIntersection();
	}
	Ocompute() {
		var centroid = CentralEndpointIntersector.average(this.pts);
		this.intPt = new Coordinate(this.findNearestPoint(centroid, this.pts));
	}
	findNearestPoint(p, pts) {
		var minDist = Double.MAX_VALUE;
		var result = null;
		for (var i = 0; i < pts.length; i++) {
			var dist = p.distance(pts[i]);
			if (i === 0 || dist < minDist) {
				minDist = dist;
				result = pts[i];
			}
		}
		return result;
	}
	tryDist(p, p0, p1) {
		var dist = CGAlgorithms.distancePointLine(p, p0, p1);
		if (dist < this.minDist) {
			this.minDist = dist;
			this.intPt = p;
		}
	}
	compute() {
		this.tryDist(this.pts[0], this.pts[2], this.pts[3]);
		this.tryDist(this.pts[1], this.pts[2], this.pts[3]);
		this.tryDist(this.pts[2], this.pts[0], this.pts[1]);
		this.tryDist(this.pts[3], this.pts[0], this.pts[1]);
	}
	getIntersection() {
		return this.intPt;
	}
}

