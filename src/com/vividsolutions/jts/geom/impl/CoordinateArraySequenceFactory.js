function CoordinateArraySequenceFactory() {
	if (arguments.length === 0) return;
}
module.exports = CoordinateArraySequenceFactory
var CoordinateArraySequence = require('com/vividsolutions/jts/geom/impl/CoordinateArraySequence');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
CoordinateArraySequenceFactory.prototype.readResolve = function () {
	return CoordinateArraySequenceFactory.instance();
};
CoordinateArraySequenceFactory.prototype.create = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [size, dimension] = args;
				if (dimension > 3) dimension = 3;
				if (dimension < 2) return new CoordinateArraySequence(size);
				return new CoordinateArraySequence(size, dimension);
			})(...args);
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [coordinates] = args;
					return new CoordinateArraySequence(coordinates);
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordSeq] = args;
					return new CoordinateArraySequence(coordSeq);
				})(...args);
			}
	}
};
CoordinateArraySequenceFactory.instance = function () {
	return CoordinateArraySequenceFactory.instanceObject;
};
CoordinateArraySequenceFactory.serialVersionUID = -4099577099607551657;
CoordinateArraySequenceFactory.instanceObject = new CoordinateArraySequenceFactory();

