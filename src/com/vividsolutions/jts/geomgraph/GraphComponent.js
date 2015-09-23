function GraphComponent(...args) {
	this.label = null;
	this.isInResult = false;
	this.isCovered = false;
	this.isCoveredSet = false;
	this.isVisited = false;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [label] = args;
				this.label = label;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = GraphComponent
var Assert = require('com/vividsolutions/jts/util/Assert');
GraphComponent.prototype.setVisited = function (isVisited) {
	this.isVisited = isVisited;
};
GraphComponent.prototype.setInResult = function (isInResult) {
	this.isInResult = isInResult;
};
GraphComponent.prototype.isCovered = function () {
	return this.isCovered;
};
GraphComponent.prototype.isCoveredSet = function () {
	return this.isCoveredSet;
};
GraphComponent.prototype.setLabel = function (label) {
	this.label = label;
};
GraphComponent.prototype.getLabel = function () {
	return this.label;
};
GraphComponent.prototype.setCovered = function (isCovered) {
	this.isCovered = isCovered;
	this.isCoveredSet = true;
};
GraphComponent.prototype.updateIM = function (im) {
	Assert.isTrue(this.label.getGeometryCount() >= 2, "found partial label");
	this.computeIM(im);
};
GraphComponent.prototype.isInResult = function () {
	return this.isInResult;
};
GraphComponent.prototype.isVisited = function () {
	return this.isVisited;
};

