function LengthLocationMap(linearGeom) {
	this.linearGeom = null;
	if (arguments.length === 0) return;
	this.linearGeom = linearGeom;
}
module.exports = LengthLocationMap
var LinearIterator = require('com/vividsolutions/jts/linearref/LinearIterator');
var LinearLocation = require('com/vividsolutions/jts/linearref/LinearLocation');
LengthLocationMap.prototype.getLength = function (loc) {
	var totalLength = 0.0;
	var it = new LinearIterator(this.linearGeom);
	while (it.hasNext()) {
		if (!it.isEndOfLine()) {
			var p0 = it.getSegmentStart();
			var p1 = it.getSegmentEnd();
			var segLen = p1.distance(p0);
			if (loc.getComponentIndex() === it.getComponentIndex() && loc.getSegmentIndex() === it.getVertexIndex()) {
				return totalLength + segLen * loc.getSegmentFraction();
			}
			totalLength += segLen;
		}
		it.next();
	}
	return totalLength;
};
LengthLocationMap.prototype.resolveHigher = function (loc) {
	if (!loc.isEndpoint(this.linearGeom)) return loc;
	var compIndex = loc.getComponentIndex();
	if (compIndex >= this.linearGeom.getNumGeometries() - 1) return loc;
	do {
		compIndex++;
	} while (compIndex < this.linearGeom.getNumGeometries() - 1 && this.linearGeom.getGeometryN(compIndex).getLength() === 0);
	return new LinearLocation(compIndex, 0, 0.0);
};
LengthLocationMap.prototype.getLocation = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [length, resolveLower] = args;
				var forwardLength = length;
				if (length < 0.0) {
					var lineLen = this.linearGeom.getLength();
					forwardLength = lineLen + length;
				}
				var loc = this.getLocationForward(forwardLength);
				if (resolveLower) {
					return loc;
				}
				return this.resolveHigher(loc);
			})(...args);
		case 1:
			return ((...args) => {
				let [length] = args;
				return this.getLocation(length, true);
			})(...args);
	}
};
LengthLocationMap.prototype.getLocationForward = function (length) {
	if (length <= 0.0) return new LinearLocation();
	var totalLength = 0.0;
	var it = new LinearIterator(this.linearGeom);
	while (it.hasNext()) {
		if (it.isEndOfLine()) {
			if (totalLength === length) {
				var compIndex = it.getComponentIndex();
				var segIndex = it.getVertexIndex();
				return new LinearLocation(compIndex, segIndex, 0.0);
			}
		} else {
			var p0 = it.getSegmentStart();
			var p1 = it.getSegmentEnd();
			var segLen = p1.distance(p0);
			if (totalLength + segLen > length) {
				var frac = (length - totalLength) / segLen;
				var compIndex = it.getComponentIndex();
				var segIndex = it.getVertexIndex();
				return new LinearLocation(compIndex, segIndex, frac);
			}
			totalLength += segLen;
		}
		it.next();
	}
	return LinearLocation.getEndLocation(this.linearGeom);
};
LengthLocationMap.getLength = function (linearGeom, loc) {
	var locater = new LengthLocationMap(linearGeom);
	return locater.getLength(loc);
};
LengthLocationMap.getLocation = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [linearGeom, length] = args;
				var locater = new LengthLocationMap(linearGeom);
				return locater.getLocation(length);
			})(...args);
		case 3:
			return ((...args) => {
				let [linearGeom, length, resolveLower] = args;
				var locater = new LengthLocationMap(linearGeom);
				return locater.getLocation(length, resolveLower);
			})(...args);
	}
};

