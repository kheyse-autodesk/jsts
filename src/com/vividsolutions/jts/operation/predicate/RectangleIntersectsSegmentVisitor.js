import Coordinate from '../../geom/Coordinate';
import RectangleLineIntersector from '../../algorithm/RectangleLineIntersector';
import ShortCircuitedGeometryVisitor from '../../geom/util/ShortCircuitedGeometryVisitor';
import LinearComponentExtracter from '../../geom/util/LinearComponentExtracter';
export default class RectangleIntersectsSegmentVisitor extends ShortCircuitedGeometryVisitor {
	constructor(...args) {
		super();
		(() => {
			this.rectEnv = null;
			this.rectIntersector = null;
			this.hasIntersection = false;
			this.p0 = new Coordinate();
			this.p1 = new Coordinate();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [rectangle] = args;
						this.rectEnv = rectangle.getEnvelopeInternal();
						this.rectIntersector = new RectangleLineIntersector(this.rectEnv);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	intersects() {
		return this.hasIntersection;
	}
	isDone() {
		return this.hasIntersection === true;
	}
	visit(geom) {
		var elementEnv = geom.getEnvelopeInternal();
		if (!this.rectEnv.intersects(elementEnv)) return null;
		var lines = LinearComponentExtracter.getLines(geom);
		this.checkIntersectionWithLineStrings(lines);
	}
	checkIntersectionWithLineStrings(lines) {
		for (var i = lines.iterator(); i.hasNext(); ) {
			var testLine = i.next();
			this.checkIntersectionWithSegments(testLine);
			if (this.hasIntersection) return null;
		}
	}
	checkIntersectionWithSegments(testLine) {
		var seq1 = testLine.getCoordinateSequence();
		for (var j = 1; j < seq1.size(); j++) {
			seq1.getCoordinate(j - 1, this.p0);
			seq1.getCoordinate(j, this.p1);
			if (this.rectIntersector.intersects(this.p0, this.p1)) {
				this.hasIntersection = true;
				return null;
			}
		}
	}
	getClass() {
		return RectangleIntersectsSegmentVisitor;
	}
}

