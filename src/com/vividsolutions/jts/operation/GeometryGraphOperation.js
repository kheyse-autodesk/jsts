function GeometryGraphOperation(...args) {
	this.li = new RobustLineIntersector();
	this.resultPrecisionModel = null;
	this.arg = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g0, g1] = args;
				GeometryGraphOperation.call(this, g0, g1, BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE);
			})(...args);
		case 1:
			return ((...args) => {
				let [g0] = args;
				this.setComputationPrecision(g0.getPrecisionModel());
				this.arg = [];
				this.arg[0] = new GeometryGraph(0, g0);
				;
			})(...args);
		case 3:
			return ((...args) => {
				let [g0, g1, boundaryNodeRule] = args;
				if (g0.getPrecisionModel().compareTo(g1.getPrecisionModel()) >= 0) this.setComputationPrecision(g0.getPrecisionModel()); else this.setComputationPrecision(g1.getPrecisionModel());
				this.arg = [];
				this.arg[0] = new GeometryGraph(0, g0, boundaryNodeRule);
				this.arg[1] = new GeometryGraph(1, g1, boundaryNodeRule);
			})(...args);
	}
}
module.exports = GeometryGraphOperation
var BoundaryNodeRule = require('com/vividsolutions/jts/algorithm/BoundaryNodeRule');
var GeometryGraph = require('com/vividsolutions/jts/geomgraph/GeometryGraph');
var RobustLineIntersector = require('com/vividsolutions/jts/algorithm/RobustLineIntersector');
GeometryGraphOperation.prototype.getArgGeometry = function (i) {
	return this.arg[i].getGeometry();
};
GeometryGraphOperation.prototype.setComputationPrecision = function (pm) {
	this.resultPrecisionModel = pm;
	this.li.setPrecisionModel(this.resultPrecisionModel);
};

