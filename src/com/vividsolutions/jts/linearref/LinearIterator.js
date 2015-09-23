function LinearIterator(...args) {
	this.linearGeom = null;
	this.numLines = null;
	this.currentLine = null;
	this.componentIndex = 0;
	this.vertexIndex = 0;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [linear, start] = args;
				LinearIterator.call(this, linear, start.getComponentIndex(), LinearIterator.segmentEndVertexIndex(start));
			})(...args);
		case 1:
			return ((...args) => {
				let [linear] = args;
				LinearIterator.call(this, linear, 0, 0);
			})(...args);
		case 3:
			return ((...args) => {
				let [linearGeom, componentIndex, vertexIndex] = args;
				if (!(linearGeom instanceof Lineal)) throw new IllegalArgumentException("Lineal geometry is required");
				this.linearGeom = linearGeom;
				this.numLines = linearGeom.getNumGeometries();
				this.componentIndex = componentIndex;
				this.vertexIndex = vertexIndex;
				this.loadCurrentLine();
			})(...args);
	}
}
module.exports = LinearIterator
var Lineal = require('com/vividsolutions/jts/geom/Lineal');
LinearIterator.prototype.getComponentIndex = function () {
	return this.componentIndex;
};
LinearIterator.prototype.getLine = function () {
	return this.currentLine;
};
LinearIterator.prototype.getVertexIndex = function () {
	return this.vertexIndex;
};
LinearIterator.prototype.getSegmentEnd = function () {
	if (this.vertexIndex < this.getLine().getNumPoints() - 1) return this.currentLine.getCoordinateN(this.vertexIndex + 1);
	return null;
};
LinearIterator.prototype.next = function () {
	if (!this.hasNext()) return null;
	this.vertexIndex++;
	if (this.vertexIndex >= this.currentLine.getNumPoints()) {
		this.componentIndex++;
		this.loadCurrentLine();
		this.vertexIndex = 0;
	}
};
LinearIterator.prototype.loadCurrentLine = function () {
	if (this.componentIndex >= this.numLines) {
		this.currentLine = null;
		return null;
	}
	this.currentLine = this.linearGeom.getGeometryN(this.componentIndex);
};
LinearIterator.prototype.getSegmentStart = function () {
	return this.currentLine.getCoordinateN(this.vertexIndex);
};
LinearIterator.prototype.isEndOfLine = function () {
	if (this.componentIndex >= this.numLines) return false;
	if (this.vertexIndex < this.currentLine.getNumPoints() - 1) return false;
	return true;
};
LinearIterator.prototype.hasNext = function () {
	if (this.componentIndex >= this.numLines) return false;
	if (this.componentIndex === this.numLines - 1 && this.vertexIndex >= this.currentLine.getNumPoints()) return false;
	return true;
};
LinearIterator.segmentEndVertexIndex = function (loc) {
	if (loc.getSegmentFraction() > 0.0) return loc.getSegmentIndex() + 1;
	return loc.getSegmentIndex();
};

