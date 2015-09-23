function OverlayResultValidator(a, b, result) {
	this.geom = null;
	this.locFinder = null;
	this.location = [];
	this.invalidLocation = null;
	this.boundaryDistanceTolerance = OverlayResultValidator.TOLERANCE;
	this.testCoords = new ArrayList();
	if (arguments.length === 0) return;
	this.boundaryDistanceTolerance = OverlayResultValidator.computeBoundaryDistanceTolerance(a, b);
	this.geom = [a, b, result];
	this.locFinder = [new FuzzyPointLocator(this.geom[0], this.boundaryDistanceTolerance), new FuzzyPointLocator(this.geom[1], this.boundaryDistanceTolerance), new FuzzyPointLocator(this.geom[2], this.boundaryDistanceTolerance)];
}
module.exports = OverlayResultValidator
var GeometrySnapper = require('com/vividsolutions/jts/operation/overlay/snap/GeometrySnapper');
var Location = require('com/vividsolutions/jts/geom/Location');
var FuzzyPointLocator = require('com/vividsolutions/jts/operation/overlay/validate/FuzzyPointLocator');
var OffsetPointGenerator = require('com/vividsolutions/jts/operation/overlay/validate/OffsetPointGenerator');
var ArrayList = require('java/util/ArrayList');
var OverlayOp = require('com/vividsolutions/jts/operation/overlay/OverlayOp');
OverlayResultValidator.prototype.reportResult = function (overlayOp, location, expectedInterior) {
	System.out.println("Overlay result invalid - A:" + Location.toLocationSymbol(location[0]) + " B:" + Location.toLocationSymbol(location[1]) + " expected:" + (expectedInterior ? 'i' : 'e') + " actual:" + Location.toLocationSymbol(location[2]));
};
OverlayResultValidator.prototype.isValid = function (overlayOp) {
	this.addTestPts(this.geom[0]);
	this.addTestPts(this.geom[1]);
	var isValid = this.checkValid(overlayOp);
	return isValid;
};
OverlayResultValidator.prototype.checkValid = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [overlayOp, pt] = args;
				this.location[0] = this.locFinder[0].getLocation(pt);
				this.location[1] = this.locFinder[1].getLocation(pt);
				this.location[2] = this.locFinder[2].getLocation(pt);
				if (OverlayResultValidator.hasLocation(this.location, Location.BOUNDARY)) return true;
				return this.isValidResult(overlayOp, this.location);
			})(...args);
		case 1:
			return ((...args) => {
				let [overlayOp] = args;
				for (var i = 0; i < this.testCoords.size(); i++) {
					var pt = this.testCoords.get(i);
					if (!this.checkValid(overlayOp, pt)) {
						this.invalidLocation = pt;
						return false;
					}
				}
				return true;
			})(...args);
	}
};
OverlayResultValidator.prototype.addTestPts = function (g) {
	var ptGen = new OffsetPointGenerator(g);
	this.testCoords.addAll(ptGen.getPoints(5 * this.boundaryDistanceTolerance));
};
OverlayResultValidator.prototype.isValidResult = function (overlayOp, location) {
	var expectedInterior = OverlayOp.isResultOfOp(location[0], location[1], overlayOp);
	var resultInInterior = location[2] === Location.INTERIOR;
	var isValid = !(expectedInterior ^ resultInInterior);
	if (!isValid) this.reportResult(overlayOp, location, expectedInterior);
	return isValid;
};
OverlayResultValidator.prototype.getInvalidLocation = function () {
	return this.invalidLocation;
};
OverlayResultValidator.hasLocation = function (location, loc) {
	for (var i = 0; i < 3; i++) {
		if (location[i] === loc) return true;
	}
	return false;
};
OverlayResultValidator.computeBoundaryDistanceTolerance = function (g0, g1) {
	return Math.min(GeometrySnapper.computeSizeBasedSnapTolerance(g0), GeometrySnapper.computeSizeBasedSnapTolerance(g1));
};
OverlayResultValidator.isValid = function (a, b, overlayOp, result) {
	var validator = new OverlayResultValidator(a, b, result);
	return validator.isValid(overlayOp);
};
OverlayResultValidator.TOLERANCE = 0.000001;

