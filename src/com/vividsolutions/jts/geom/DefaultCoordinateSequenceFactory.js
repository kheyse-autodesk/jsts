import CoordinateSequenceFactory from './CoordinateSequenceFactory';
import DefaultCoordinateSequence from './DefaultCoordinateSequence';
import CoordinateSequence from './CoordinateSequence';
import Serializable from 'java/io/Serializable';
export default class DefaultCoordinateSequenceFactory {
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
		return new DefaultCoordinateSequenceFactory();
	}
	static instance() {
		return DefaultCoordinateSequenceFactory.instanceObject;
	}
	readResolve() {
		return DefaultCoordinateSequenceFactory.instance();
	}
	create(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Array) {
						return ((...args) => {
							let [coordinates] = args;
							return new DefaultCoordinateSequence(coordinates);
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequence) > -1) {
						return ((...args) => {
							let [coordSeq] = args;
							return new DefaultCoordinateSequence(coordSeq);
						})(...args);
					}
				case 2:
					return ((...args) => {
						let [size, dimension] = args;
						return new DefaultCoordinateSequence(size);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return DefaultCoordinateSequenceFactory;
	}
}

