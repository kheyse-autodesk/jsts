import Cloneable from 'java/lang/Cloneable';
export default class CoordinateSequence {
	constructor(...args) {
		(() => {
			this.X = 0;
			this.Y = 1;
			this.Z = 2;
			this.M = 3;
		})();
	}
	get interfaces_() {
		return [Cloneable];
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
	getY(index) {}
	toCoordinateArray() {}
}

