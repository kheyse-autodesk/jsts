function SimpleGeometryPrecisionReducer(pm) {
	this.newPrecisionModel = null;
	this.removeCollapsed = true;
	this.changePrecisionModel = false;
	if (arguments.length === 0) return;
	this.newPrecisionModel = pm;
}
module.exports = SimpleGeometryPrecisionReducer
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var GeometryEditor = require('com/vividsolutions/jts/geom/util/GeometryEditor');
var PrecisionReducerCoordinateOperation = require('com/vividsolutions/jts/precision/PrecisionReducerCoordinateOperation');
SimpleGeometryPrecisionReducer.prototype.reduce = function (geom) {
	var geomEdit = null;
	if (this.changePrecisionModel) {
		var newFactory = new GeometryFactory(this.newPrecisionModel, geom.getFactory().getSRID());
		geomEdit = new GeometryEditor(newFactory);
	} else geomEdit = new GeometryEditor();
	return geomEdit.edit(geom, new PrecisionReducerCoordinateOperation());
};
SimpleGeometryPrecisionReducer.prototype.setChangePrecisionModel = function (changePrecisionModel) {
	this.changePrecisionModel = changePrecisionModel;
};
SimpleGeometryPrecisionReducer.prototype.setRemoveCollapsedComponents = function (removeCollapsed) {
	this.removeCollapsed = removeCollapsed;
};
SimpleGeometryPrecisionReducer.reduce = function (g, precModel) {
	var reducer = new SimpleGeometryPrecisionReducer(precModel);
	return reducer.reduce(g);
};

