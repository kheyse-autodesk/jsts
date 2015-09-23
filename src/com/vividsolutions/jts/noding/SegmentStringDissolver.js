function SegmentStringDissolver(...args) {
	this.merger = null;
	this.ocaMap = new TreeMap();
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [merger] = args;
				this.merger = merger;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				SegmentStringDissolver.call(this, null);
			})(...args);
	}
}
module.exports = SegmentStringDissolver
var Collection = require('java/util/Collection');
var OrientedCoordinateArray = require('com/vividsolutions/jts/noding/OrientedCoordinateArray');
var SegmentString = require('com/vividsolutions/jts/noding/SegmentString');
var CoordinateArrays = require('com/vividsolutions/jts/geom/CoordinateArrays');
var TreeMap = require('java/util/TreeMap');
SegmentStringDissolver.prototype.findMatching = function (oca, segString) {
	var matchSS = this.ocaMap.get(oca);
	return matchSS;
};
SegmentStringDissolver.prototype.getDissolved = function () {
	return this.ocaMap.values();
};
SegmentStringDissolver.prototype.dissolve = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Collection) {
				return ((...args) => {
					let [segStrings] = args;
					for (var i = segStrings.iterator(); i.hasNext(); ) {
						this.dissolve(i.next());
					}
				})(...args);
			} else if (args[0] instanceof SegmentString) {
				return ((...args) => {
					let [segString] = args;
					var oca = new OrientedCoordinateArray(segString.getCoordinates());
					var existing = this.findMatching(oca, segString);
					if (existing === null) {
						this.add(oca, segString);
					} else {
						if (this.merger !== null) {
							var isSameOrientation = CoordinateArrays.equals(existing.getCoordinates(), segString.getCoordinates());
							this.merger.merge(existing, segString, isSameOrientation);
						}
					}
				})(...args);
			}
	}
};
SegmentStringDissolver.prototype.add = function (oca, segString) {
	this.ocaMap.put(oca, segString);
};

