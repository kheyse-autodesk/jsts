function GeometryLocation(...args) {
	this.component = null;
	this.segIndex = null;
	this.pt = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [component, pt] = args;
				GeometryLocation.call(this, component, GeometryLocation.INSIDE_AREA, pt);
			})(...args);
		case 3:
			return ((...args) => {
				let [component, segIndex, pt] = args;
				this.component = component;
				this.segIndex = segIndex;
				this.pt = pt;
			})(...args);
	}
}
module.exports = GeometryLocation
GeometryLocation.prototype.isInsideArea = function () {
	return this.segIndex === GeometryLocation.INSIDE_AREA;
};
GeometryLocation.prototype.getCoordinate = function () {
	return this.pt;
};
GeometryLocation.prototype.getGeometryComponent = function () {
	return this.component;
};
GeometryLocation.prototype.getSegmentIndex = function () {
	return this.segIndex;
};
GeometryLocation.INSIDE_AREA = -1;

