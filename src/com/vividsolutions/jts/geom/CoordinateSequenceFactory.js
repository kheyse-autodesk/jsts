function CoordinateSequenceFactory() {}
module.exports = CoordinateSequenceFactory
var CoordinateSequence = require('com/vividsolutions/jts/geom/CoordinateSequence');
CoordinateSequenceFactory.prototype.create = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [size, dimension] = args;
			})(...args);
		case 1:
			if (args[0] instanceof Array) {
				return ((...args) => {
					let [coordinates] = args;
				})(...args);
			} else if (args[0] instanceof CoordinateSequence) {
				return ((...args) => {
					let [coordSeq] = args;
				})(...args);
			}
	}
};

