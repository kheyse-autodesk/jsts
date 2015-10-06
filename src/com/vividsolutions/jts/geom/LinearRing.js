import LineString from 'com/vividsolutions/jts/geom/LineString';
import CoordinateSequences from 'com/vividsolutions/jts/geom/CoordinateSequences';
import Dimension from 'com/vividsolutions/jts/geom/Dimension';
export default class LinearRing extends LineString {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [factory] = args;
						super(factory);
						this.validateConstruction();
					})(...args);
				case 2:
					return ((...args) => {
						let [points, factory] = args;
						super(points, factory);
						this.validateConstruction();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get MINIMUM_VALID_SIZE() {
		return 4;
	}
	static get serialVersionUID() {
		return -4261142084085851829;
	}
	getBoundaryDimension() {
		return Dimension.FALSE;
	}
	isClosed() {
		if (this.isEmpty()) {
			return true;
		}
		return super.isClosed();
	}
	reverse() {
		var seq = this.points.clone();
		CoordinateSequences.reverse(seq);
		var rev = this.getFactory().createLinearRing(seq);
		return rev;
	}
	validateConstruction() {
		if (!this.isEmpty() && !super.isClosed()) {
			throw new IllegalArgumentException("Points of LinearRing do not form a closed linestring");
		}
		if (this.getCoordinateSequence().size() >= 1 && this.getCoordinateSequence().size() < LinearRing.MINIMUM_VALID_SIZE) {
			throw new IllegalArgumentException("Invalid number of points in LinearRing (found " + this.getCoordinateSequence().size() + " - must be 0 or >= 4)");
		}
	}
	getGeometryType() {
		return "LinearRing";
	}
	getClass() {
		return LinearRing;
	}
}

