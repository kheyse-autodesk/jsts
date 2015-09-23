function LinearComponentExtracter(...args) {
	this.lines = null;
	this.isForcedToLineString = false;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [lines, isForcedToLineString] = args;
				this.lines = lines;
				this.isForcedToLineString = isForcedToLineString;
			})(...args);
		case 1:
			return ((...args) => {
				let [lines] = args;
				this.lines = lines;
			})(...args);
	}
}
module.exports = LinearComponentExtracter
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var Collection = require('java/util/Collection');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var ArrayList = require('java/util/ArrayList');
LinearComponentExtracter.prototype.filter = function (geom) {
	if (this.isForcedToLineString && geom instanceof LinearRing) {
		var line = geom.getFactory().createLineString(geom.getCoordinateSequence());
		this.lines.add(line);
		return null;
	}
	if (geom instanceof LineString) this.lines.add(geom);
};
LinearComponentExtracter.prototype.setForceToLineString = function (isForcedToLineString) {
	this.isForcedToLineString = isForcedToLineString;
};
LinearComponentExtracter.getGeometry = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geom, forceToLineString] = args;
				return geom.getFactory().buildGeometry(LinearComponentExtracter.getLines(geom, forceToLineString));
			})(...args);
		case 1:
			return ((...args) => {
				let [geom] = args;
				return geom.getFactory().buildGeometry(LinearComponentExtracter.getLines(geom));
			})(...args);
	}
};
LinearComponentExtracter.getLines = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof Collection && args[1] instanceof Collection) {
				return ((...args) => {
					let [geoms, lines] = args;
					for (var i = geoms.iterator(); i.hasNext(); ) {
						var g = i.next();
						LinearComponentExtracter.getLines(g, lines);
					}
					return lines;
				})(...args);
			} else if (args[0] instanceof Geometry && args[1] instanceof Collection) {
				return ((...args) => {
					let [geom, lines] = args;
					if (geom instanceof LineString) {
						lines.add(geom);
					} else {
						geom.apply(new LinearComponentExtracter(lines));
					}
					return lines;
				})(...args);
			} else if (args[0] instanceof Geometry && args[1] instanceof boolean) {
				return ((...args) => {
					let [geom, forceToLineString] = args;
					var lines = new ArrayList();
					geom.apply(new LinearComponentExtracter(lines, forceToLineString));
					return lines;
				})(...args);
			}
		case 1:
			return ((...args) => {
				let [geom] = args;
				return LinearComponentExtracter.getLines(geom, false);
			})(...args);
		case 3:
			if (args[2] instanceof boolean && args[0] instanceof Collection && args[1] instanceof Collection) {
				return ((...args) => {
					let [geoms, lines, forceToLineString] = args;
					for (var i = geoms.iterator(); i.hasNext(); ) {
						var g = i.next();
						LinearComponentExtracter.getLines(g, lines, forceToLineString);
					}
					return lines;
				})(...args);
			} else if (args[2] instanceof boolean && args[0] instanceof Geometry && args[1] instanceof Collection) {
				return ((...args) => {
					let [geom, lines, forceToLineString] = args;
					geom.apply(new LinearComponentExtracter(lines, forceToLineString));
					return lines;
				})(...args);
			}
	}
};

