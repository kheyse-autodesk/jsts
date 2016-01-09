import Coordinate from '../geom/Coordinate';
import SegmentPointComparator from './SegmentPointComparator';
import Comparable from 'java/lang/Comparable';
export default class SegmentNode {
	constructor(...args) {
		(() => {
			this.segString = null;
			this.coord = null;
			this.segmentIndex = null;
			this.segmentOctant = null;
			this.isInterior = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 4:
					return ((...args) => {
						let [segString, coord, segmentIndex, segmentOctant] = args;
						this.segString = segString;
						this.coord = new Coordinate(coord);
						this.segmentIndex = segmentIndex;
						this.segmentOctant = segmentOctant;
						this.isInterior = !coord.equals2D(segString.getCoordinate(segmentIndex));
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Comparable];
	}
	getCoordinate() {
		return this.coord;
	}
	print(out) {
		out.print(this.coord);
		out.print(" seg # = " + this.segmentIndex);
	}
	compareTo(obj) {
		var other = obj;
		if (this.segmentIndex < other.segmentIndex) return -1;
		if (this.segmentIndex > other.segmentIndex) return 1;
		if (this.coord.equals2D(other.coord)) return 0;
		return SegmentPointComparator.compare(this.segmentOctant, this.coord, other.coord);
	}
	isEndPoint(maxSegmentIndex) {
		if (this.segmentIndex === 0 && !this.isInterior) return true;
		if (this.segmentIndex === maxSegmentIndex) return true;
		return false;
	}
	isInterior() {
		return this.isInterior;
	}
	getClass() {
		return SegmentNode;
	}
}

