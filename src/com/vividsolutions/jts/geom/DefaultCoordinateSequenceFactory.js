function DefaultCoordinateSequenceFactory() {
	if (arguments.length === 0) return;
}
module.exports = DefaultCoordinateSequenceFactory
var DefaultCoordinateSequence = require('com/vividsolutions/jts/geom/DefaultCoordinateSequence');
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
DefaultCoordinateSequenceFactory.prototype.readResolve = function () {
	return DefaultCoordinateSequenceFactory.instance();
};
DefaultCoordinateSequenceFactory.prototype.create = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [size, dimension] = args;
				return new DefaultCoordinateSequence(size);
			})(...args);
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [coordinates] = args;
					return new DefaultCoordinateSequence(coordinates);
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordSeq] = args;
					return new DefaultCoordinateSequence(coordSeq);
				})(...args);
			}
	}
};
DefaultCoordinateSequenceFactory.instance = function () {
	return DefaultCoordinateSequenceFactory.instanceObject;
};
DefaultCoordinateSequenceFactory.serialVersionUID = -4099577099607551657;
DefaultCoordinateSequenceFactory.instanceObject = new DefaultCoordinateSequenceFactory();

