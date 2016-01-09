import CoordinateSequenceFactory from '../CoordinateSequenceFactory';
import CoordinateSequence from '../CoordinateSequence';
export default class PackedCoordinateSequenceFactory {
	constructor(...args) {
		(() => {
			this.type = PackedCoordinateSequenceFactory.DOUBLE;
			this.dimension = 3;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						overloads.call(this, PackedCoordinateSequenceFactory.DOUBLE);
					})(...args);
				case 1:
					return ((...args) => {
						let [type] = args;
						overloads.call(this, type, 3);
					})(...args);
				case 2:
					return ((...args) => {
						let [type, dimension] = args;
						this.setType(type);
						this.setDimension(dimension);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [CoordinateSequenceFactory];
	}
	static get DOUBLE() {
		return 0;
	}
	static get FLOAT() {
		return 1;
	}
	static get DOUBLE_FACTORY() {
		return new PackedCoordinateSequenceFactory(PackedCoordinateSequenceFactory.DOUBLE);
	}
	static get FLOAT_FACTORY() {
		return new PackedCoordinateSequenceFactory(PackedCoordinateSequenceFactory.FLOAT);
	}
	create(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Array) {
						return ((...args) => {
							let [coordinates] = args;
							if (this.type === PackedCoordinateSequenceFactory.DOUBLE) {
								return new PackedCoordinateSequence.Double(coordinates, this.dimension);
							} else {
								return new PackedCoordinateSequence.Float(coordinates, this.dimension);
							}
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(CoordinateSequence) > -1) {
						return ((...args) => {
							let [coordSeq] = args;
							if (this.type === PackedCoordinateSequenceFactory.DOUBLE) {
								return new PackedCoordinateSequence.Double(coordSeq.toCoordinateArray(), this.dimension);
							} else {
								return new PackedCoordinateSequence.Float(coordSeq.toCoordinateArray(), this.dimension);
							}
						})(...args);
					}
				case 2:
					if (args[0] instanceof Array && Number.isInteger(args[1])) {
						return ((...args) => {
							let [packedCoordinates, dimension] = args;
							if (this.type === PackedCoordinateSequenceFactory.DOUBLE) {
								return new PackedCoordinateSequence.Double(packedCoordinates, dimension);
							} else {
								return new PackedCoordinateSequence.Float(packedCoordinates, dimension);
							}
						})(...args);
					} else if (args[0] instanceof Array && Number.isInteger(args[1])) {
						return ((...args) => {
							let [packedCoordinates, dimension] = args;
							if (this.type === PackedCoordinateSequenceFactory.DOUBLE) {
								return new PackedCoordinateSequence.Double(packedCoordinates, dimension);
							} else {
								return new PackedCoordinateSequence.Float(packedCoordinates, dimension);
							}
						})(...args);
					} else if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
						return ((...args) => {
							let [size, dimension] = args;
							if (this.type === PackedCoordinateSequenceFactory.DOUBLE) {
								return new PackedCoordinateSequence.Double(size, dimension);
							} else {
								return new PackedCoordinateSequence.Float(size, dimension);
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	setType(type) {
		if (type !== PackedCoordinateSequenceFactory.DOUBLE && type !== PackedCoordinateSequenceFactory.FLOAT) throw new IllegalArgumentException("Unknown type " + type);
		this.type = type;
	}
	getDimension() {
		return this.dimension;
	}
	getType() {
		return this.type;
	}
	setDimension(dimension) {
		this.dimension = dimension;
	}
	getClass() {
		return PackedCoordinateSequenceFactory;
	}
}

