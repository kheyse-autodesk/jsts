function ShortCircuitedGeometryVisitor() {
	this.isDone = false;
	if (arguments.length === 0) return;
}
module.exports = ShortCircuitedGeometryVisitor
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
ShortCircuitedGeometryVisitor.prototype.applyTo = function (geom) {
	for (var i = 0; i < geom.getNumGeometries() && !this.isDone; i++) {
		var element = geom.getGeometryN(i);
		if (!(element instanceof GeometryCollection)) {
			this.visit(element);
			if (this.isDone()) {
				this.isDone = true;
				return null;
			}
		} else this.applyTo(element);
	}
};

