function GeometryPrecisionReducer(pm) {
	this.targetPM = null;
	this.removeCollapsed = true;
	this.changePrecisionModel = false;
	this.isPointwise = false;
	if (arguments.length === 0) return;
	this.targetPM = pm;
}
module.exports = GeometryPrecisionReducer
var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory');
var GeometryEditor = require('com/vividsolutions/jts/geom/util/GeometryEditor');
var Polygonal = require('com/vividsolutions/jts/geom/Polygonal');
var PrecisionReducerCoordinateOperation = require('com/vividsolutions/jts/precision/PrecisionReducerCoordinateOperation');
GeometryPrecisionReducer.prototype.fixPolygonalTopology = function (geom) {
	var geomToBuffer = geom;
	if (!this.changePrecisionModel) {
		geomToBuffer = this.changePM(geom, this.targetPM);
	}
	var bufGeom = geomToBuffer.buffer(0);
	var finalGeom = bufGeom;
	if (!this.changePrecisionModel) {
		finalGeom = geom.getFactory().createGeometry(bufGeom);
	}
	return finalGeom;
};
GeometryPrecisionReducer.prototype.reducePointwise = function (geom) {
	var geomEdit = null;
	if (this.changePrecisionModel) {
		var newFactory = this.createFactory(geom.getFactory(), this.targetPM);
		geomEdit = new GeometryEditor(newFactory);
	} else geomEdit = new GeometryEditor();
	var finalRemoveCollapsed = this.removeCollapsed;
	if (geom.getDimension() >= 2) finalRemoveCollapsed = true;
	var reduceGeom = geomEdit.edit(geom, new PrecisionReducerCoordinateOperation(this.targetPM, finalRemoveCollapsed));
	return reduceGeom;
};
GeometryPrecisionReducer.prototype.changePM = function (geom, newPM) {
	var geomEditor = this.createEditor(geom.getFactory(), newPM);
	return geomEditor.edit(geom, new GeometryEditor.NoOpGeometryOperation());
};
GeometryPrecisionReducer.prototype.setRemoveCollapsedComponents = function (removeCollapsed) {
	this.removeCollapsed = removeCollapsed;
};
GeometryPrecisionReducer.prototype.createFactory = function (inputFactory, pm) {
	var newFactory = new GeometryFactory(pm, inputFactory.getSRID(), inputFactory.getCoordinateSequenceFactory());
	return newFactory;
};
GeometryPrecisionReducer.prototype.setChangePrecisionModel = function (changePrecisionModel) {
	this.changePrecisionModel = changePrecisionModel;
};
GeometryPrecisionReducer.prototype.reduce = function (geom) {
	var reducePW = this.reducePointwise(geom);
	if (this.isPointwise) return reducePW;
	if (!(reducePW instanceof Polygonal)) return reducePW;
	if (reducePW.isValid()) return reducePW;
	return this.fixPolygonalTopology(reducePW);
};
GeometryPrecisionReducer.prototype.setPointwise = function (isPointwise) {
	this.isPointwise = isPointwise;
};
GeometryPrecisionReducer.prototype.createEditor = function (geomFactory, newPM) {
	if (geomFactory.getPrecisionModel() === newPM) return new GeometryEditor();
	var newFactory = this.createFactory(geomFactory, newPM);
	var geomEdit = new GeometryEditor(newFactory);
	return geomEdit;
};
GeometryPrecisionReducer.reduce = function (g, precModel) {
	var reducer = new GeometryPrecisionReducer(precModel);
	return reducer.reduce(g);
};
GeometryPrecisionReducer.reducePointwise = function (g, precModel) {
	var reducer = new GeometryPrecisionReducer(precModel);
	reducer.setPointwise(true);
	return reducer.reduce(g);
};

