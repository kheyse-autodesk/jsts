import CoordinateSequenceFactory from 'com/vividsolutions/jts/geom/CoordinateSequenceFactory';
import CoordinateArraySequence from 'com/vividsolutions/jts/geom/impl/CoordinateArraySequence';
import CoordinateSequence from 'com/vividsolutions/jts/geom/CoordinateSequence';
import Serializable from 'java/io/Serializable';
export default class CoordinateArraySequenceFactory {
	constructor(...args) {
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [CoordinateSequenceFactory, Serializable];
	}
	static get serialVersionUID() {
		return -4099577099607551657;
	}
	static get instanceObject() {
		return new CoordinateArraySequenceFactory();
	}
	static instance() {
		return CoordinateArraySequenceFactory.instanceObject;
	}
	readResolve() {
		return CoordinateArraySequenceFactory.instance();
	}
	create(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						return new CoordinateArraySequence();
					})(...args);
				case 1:
					if (args[0] instanceof Array) {
						return ((...args) => {
							let [coordinates] = args;
							return new CoordinateArraySequence(coordinates);
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequence) > -1) {
						return ((...args) => {
							let [coordSeq] = args;
							return new CoordinateArraySequence(coordSeq);
						})(...args);
					}
				case 2:
					return ((...args) => {
						let [size, dimension] = args;
						if (dimension > 3) dimension = 3;
						if (dimension < 2) return new CoordinateArraySequence(size);
						return new CoordinateArraySequence(size, dimension);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return CoordinateArraySequenceFactory;
	}
}

