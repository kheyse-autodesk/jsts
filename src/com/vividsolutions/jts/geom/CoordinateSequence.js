import Cloneable from 'java/lang/Cloneable';
export default class CoordinateSequence {
	get interfaces_() {
		return [Cloneable];
	}
	static get X() {
		return 0;
	}
	static get Y() {
		return 1;
	}
	static get Z() {
		return 2;
	}
	static get M() {
		return 3;
	}
	setOrdinate(index, ordinateIndex, value) {}
	size() {}
	getOrdinate(index, ordinateIndex) {}
	getCoordinate(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [i] = args;
					})(...args);
				case 2:
					return ((...args) => {
						let [index, coord] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getCoordinateCopy(i) {}
	getDimension() {}
	getX(index) {}
	clone() {}
	expandEnvelope(env) {}
	copy() {}
	getY(index) {}
	toCoordinateArray() {}
	getClass() {
		return CoordinateSequence;
	}
}

