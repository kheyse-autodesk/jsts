function BoundaryOp(...args) {
	this.geom = null;
	this.geomFact = null;
	this.bnRule = null;
	this.endpointMap = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geom, bnRule] = args;
				this.geom = geom;
				this.geomFact = geom.getFactory();
				this.bnRule = bnRule;
			})(...args);
		case 1:
			return ((...args) => {
				let [geom] = args;
				BoundaryOp.call(this, geom, BoundaryNodeRule.MOD2_BOUNDARY_RULE);
			})(...args);
	}
}
module.exports = BoundaryOp
var LineString = require('com/vividsolutions/jts/geom/LineString');
var BoundaryNodeRule = require('com/vividsolutions/jts/algorithm/BoundaryNodeRule');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var ArrayList = require('java/util/ArrayList');
var TreeMap = require('java/util/TreeMap');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
BoundaryOp.prototype.boundaryMultiLineString = function (mLine) {
	if (this.geom.isEmpty()) {
		return this.getEmptyMultiPoint();
	}
	var bdyPts = this.computeBoundaryCoordinates(mLine);
	if (bdyPts.length === 1) {
		return this.geomFact.createPoint(bdyPts[0]);
	}
	return this.geomFact.createMultiPoint(bdyPts);
};
BoundaryOp.prototype.getBoundary = function () {
	if (this.geom instanceof LineString) return this.boundaryLineString(this.geom);
	if (this.geom instanceof MultiLineString) return this.boundaryMultiLineString(this.geom);
	return this.geom.getBoundary();
};
BoundaryOp.prototype.boundaryLineString = function (line) {
	if (this.geom.isEmpty()) {
		return this.getEmptyMultiPoint();
	}
	if (line.isClosed()) {
		var closedEndpointOnBoundary = this.bnRule.isInBoundary(2);
		if (closedEndpointOnBoundary) {
			return line.getStartPoint();
		} else {
			return this.geomFact.createMultiPoint(null);
		}
	}
	return this.geomFact.createMultiPoint([line.getStartPoint(), line.getEndPoint()]);
};
BoundaryOp.prototype.getEmptyMultiPoint = function () {
	return this.geomFact.createMultiPoint(null);
};
BoundaryOp.prototype.computeBoundaryCoordinates = function (mLine) {
	var bdyPts = new ArrayList();
	this.endpointMap = new TreeMap();
	for (var i = 0; i < mLine.getNumGeometries(); i++) {
		var line = mLine.getGeometryN(i);
		if (line.getNumPoints() === 0) continue;
		this.addEndpoint(line.getCoordinateN(0));
		this.addEndpoint(line.getCoordinateN(line.getNumPoints() - 1));
	}
	for (var it = this.endpointMap.entrySet().iterator(); it.hasNext(); ) {
		var entry = it.next();
		var counter = entry.getValue();
		var valence = counter.count;
		if (this.bnRule.isInBoundary(valence)) {
			bdyPts.add(entry.getKey());
		}
	}
	return CoordinateArrays.toCoordinateArray(bdyPts);
};
BoundaryOp.prototype.addEndpoint = function (pt) {
	var counter = this.endpointMap.get(pt);
	if (counter === null) {
		counter = new Counter();
		this.endpointMap.put(pt, counter);
	}
	counter.count++;
};
function Counter() {}
module.exports = Counter

