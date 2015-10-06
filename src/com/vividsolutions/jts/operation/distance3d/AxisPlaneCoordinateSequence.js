import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import CoordinateSequence from 'com/vividsolutions/jts/geom/CoordinateSequence';
export default class AxisPlaneCoordinateSequence {
	constructor(...args) {
		(() => {
			this.seq = null;
			this.indexMap = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [seq, indexMap] = args;
						this.seq = seq;
						this.indexMap = indexMap;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [CoordinateSequence];
	}
	static get XY_INDEX() {
		return [0, 1];
	}
	static get XZ_INDEX() {
		return [0, 2];
	}
	static get YZ_INDEX() {
		return [1, 2];
	}
	static projectToYZ(seq) {
		return new AxisPlaneCoordinateSequence(seq, AxisPlaneCoordinateSequence.YZ_INDEX);
	}
	static projectToXZ(seq) {
		return new AxisPlaneCoordinateSequence(seq, AxisPlaneCoordinateSequence.XZ_INDEX);
	}
	static projectToXY(seq) {
		return new AxisPlaneCoordinateSequence(seq, AxisPlaneCoordinateSequence.XY_INDEX);
	}
	setOrdinate(index, ordinateIndex, value) {
		throw new UnsupportedOperationException();
	}
	getZ(index) {
		return this.getOrdinate(index, CoordinateSequence.Z);
	}
	size() {
		return this.seq.size();
	}
	getOrdinate(index, ordinateIndex) {
		if (ordinateIndex > 1) return 0;
		return this.seq.getOrdinate(index, this.indexMap[ordinateIndex]);
	}
	getCoordinate(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [i] = args;
						return this.getCoordinateCopy(i);
					})(...args);
				case 2:
					return ((...args) => {
						let [index, coord] = args;
						coord.x = this.getOrdinate(index, CoordinateSequence.X);
						coord.y = this.getOrdinate(index, CoordinateSequence.Y);
						coord.z = this.getOrdinate(index, CoordinateSequence.Z);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getCoordinateCopy(i) {
		return new Coordinate(this.getX(i), this.getY(i), this.getZ(i));
	}
	getDimension() {
		return 2;
	}
	getX(index) {
		return this.getOrdinate(index, CoordinateSequence.X);
	}
	clone() {
		throw new UnsupportedOperationException();
	}
	expandEnvelope(env) {
		throw new UnsupportedOperationException();
	}
	getY(index) {
		return this.getOrdinate(index, CoordinateSequence.Y);
	}
	toCoordinateArray() {
		throw new UnsupportedOperationException();
	}
	getClass() {
		return AxisPlaneCoordinateSequence;
	}
}

