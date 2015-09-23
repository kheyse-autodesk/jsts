function UnionInteracting(g0, g1) {
	this.geomFactory = null;
	this.g0 = null;
	this.g1 = null;
	this.interacts0 = null;
	this.interacts1 = null;
	if (arguments.length === 0) return;
	this.g0 = g0;
	this.g1 = g1;
	this.geomFactory = g0.getFactory();
	this.interacts0 = [];
	this.interacts1 = [];
}
module.exports = UnionInteracting
var GeometryCombiner = require('com/vividsolutions/jts/geom/util/GeometryCombiner');
var ArrayList = require('java/util/ArrayList');
UnionInteracting.prototype.extractElements = function (geom, interacts, isInteracting) {
	var extractedGeoms = new ArrayList();
	for (var i = 0; i < geom.getNumGeometries(); i++) {
		var elem = geom.getGeometryN(i);
		if (interacts[i] === isInteracting) extractedGeoms.add(elem);
	}
	return this.geomFactory.buildGeometry(extractedGeoms);
};
UnionInteracting.prototype.computeInteracting = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [elem0] = args;
				var interactsWithAny = false;
				for (var i = 0; i < this.g1.getNumGeometries(); i++) {
					var elem1 = this.g1.getGeometryN(i);
					var interacts = elem1.getEnvelopeInternal().intersects(elem0.getEnvelopeInternal());
					if (interacts) this.interacts1[i] = true;
					if (interacts) interactsWithAny = true;
				}
				return interactsWithAny;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				for (var i = 0; i < this.g0.getNumGeometries(); i++) {
					var elem = this.g0.getGeometryN(i);
					this.interacts0[i] = this.computeInteracting(elem);
				}
			})(...args);
	}
};
UnionInteracting.prototype.union = function () {
	this.computeInteracting();
	var int0 = this.extractElements(this.g0, this.interacts0, true);
	var int1 = this.extractElements(this.g1, this.interacts1, true);
	if (int0.isEmpty() || int1.isEmpty()) {
		System.out.println("found empty!");
	}
	var union = int0.union(int1);
	var disjoint0 = this.extractElements(this.g0, this.interacts0, false);
	var disjoint1 = this.extractElements(this.g1, this.interacts1, false);
	var overallUnion = GeometryCombiner.combine(union, disjoint0, disjoint1);
	return overallUnion;
};
UnionInteracting.prototype.bufferUnion = function (g0, g1) {
	var factory = g0.getFactory();
	var gColl = factory.createGeometryCollection([g0, g1]);
	var unionAll = gColl.buffer(0.0);
	return unionAll;
};
UnionInteracting.union = function (g0, g1) {
	var uue = new UnionInteracting(g0, g1);
	return uue.union();
};

