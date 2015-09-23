function GeometryMapper() {}
module.exports = GeometryMapper
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Collection = require('java/util/Collection');
var ArrayList = require('java/util/ArrayList');
GeometryMapper.map = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof Geometry && args[1] instanceof MapOp) {
				return ((...args) => {
					let [geom, op] = args;
					var mapped = new ArrayList();
					for (var i = 0; i < geom.getNumGeometries(); i++) {
						var g = op.map(geom.getGeometryN(i));
						if (g !== null) mapped.add(g);
					}
					return geom.getFactory().buildGeometry(mapped);
				})(...args);
			} else if (args[0] instanceof Collection && args[1] instanceof MapOp) {
				return ((...args) => {
					let [geoms, op] = args;
					var mapped = new ArrayList();
					for (var i = geoms.iterator(); i.hasNext(); ) {
						var g = i.next();
						var gr = op.map(g);
						if (gr !== null) mapped.add(gr);
					}
					return mapped;
				})(...args);
			}
	}
};

