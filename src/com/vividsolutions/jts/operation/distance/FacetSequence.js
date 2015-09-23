function FacetSequence(...args) {
	this.pts = null;
	this.start = null;
	this.end = null;
	this.pt = new Coordinate();
	this.seqPt = new Coordinate();
	this.p0 = new Coordinate();
	this.p1 = new Coordinate();
	this.q0 = new Coordinate();
	this.q1 = new Coordinate();
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [pts, start] = args;
				this.pts = pts;
				this.start = start;
				this.end = start + 1;
			})(...args);
		case 3:
			return ((...args) => {
				let [pts, start, end] = args;
				this.pts = pts;
				this.start = start;
				this.end = end;
			})(...args);
	}
}
module.exports = FacetSequence
var CGAlgorithms = require('com/vividsolutions/jts/algorithm/CGAlgorithms');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Double = require('java/lang/Double');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
FacetSequence.prototype.size = function () {
	return this.end - this.start;
};
FacetSequence.prototype.computeLineLineDistance = function (facetSeq) {
	var minDistance = Double.MAX_VALUE;
	for (var i = this.start; i < this.end - 1; i++) {
		for (var j = facetSeq.start; j < facetSeq.end - 1; j++) {
			this.pts.getCoordinate(i, this.p0);
			this.pts.getCoordinate(i + 1, this.p1);
			facetSeq.pts.getCoordinate(j, this.q0);
			facetSeq.pts.getCoordinate(j + 1, this.q1);
			var dist = CGAlgorithms.distanceLineLine(this.p0, this.p1, this.q0, this.q1);
			if (dist === 0.0) return 0.0;
			if (dist < minDistance) {
				minDistance = dist;
			}
		}
	}
	return minDistance;
};
FacetSequence.prototype.getCoordinate = function (index) {
	return this.pts.getCoordinate(this.start + index);
};
FacetSequence.prototype.getEnvelope = function () {
	var env = new Envelope();
	for (var i = this.start; i < this.end; i++) {
		env.expandToInclude(this.pts.getX(i), this.pts.getY(i));
	}
	return env;
};
FacetSequence.prototype.computePointLineDistance = function (pt, facetSeq) {
	var minDistance = Double.MAX_VALUE;
	for (var i = facetSeq.start; i < facetSeq.end - 1; i++) {
		facetSeq.pts.getCoordinate(i, this.q0);
		facetSeq.pts.getCoordinate(i + 1, this.q1);
		var dist = CGAlgorithms.distancePointLine(pt, this.q0, this.q1);
		if (dist === 0.0) return 0.0;
		if (dist < minDistance) {
			minDistance = dist;
		}
	}
	return minDistance;
};
FacetSequence.prototype.toString = function () {
	var buf = new StringBuffer();
	buf.append("LINESTRING ( ");
	var p = new Coordinate();
	for (var i = this.start; i < this.end; i++) {
		if (i > this.start) buf.append(", ");
		this.pts.getCoordinate(i, p);
		buf.append(p.x + " " + p.y);
	}
	buf.append(" )");
	return buf.toString();
};
FacetSequence.prototype.isPoint = function () {
	return this.end - this.start === 1;
};
FacetSequence.prototype.distance = function (facetSeq) {
	var isPoint = this.isPoint();
	var isPointOther = facetSeq.isPoint();
	if (isPoint && isPointOther) {
		this.pts.getCoordinate(this.start, this.pt);
		facetSeq.pts.getCoordinate(facetSeq.start, this.seqPt);
		return this.pt.distance(this.seqPt);
	} else if (isPoint) {
		this.pts.getCoordinate(this.start, this.pt);
		return this.computePointLineDistance(this.pt, facetSeq);
	} else if (isPointOther) {
		facetSeq.pts.getCoordinate(facetSeq.start, this.seqPt);
		return this.computePointLineDistance(this.seqPt, this);
	}
	return this.computeLineLineDistance(facetSeq);
};

