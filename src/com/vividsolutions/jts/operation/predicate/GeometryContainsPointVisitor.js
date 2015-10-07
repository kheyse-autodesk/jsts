import Coordinate from '../../geom/Coordinate';
import Polygon from '../../geom/Polygon';
import ShortCircuitedGeometryVisitor from '../../geom/util/ShortCircuitedGeometryVisitor';
import SimplePointInAreaLocator from '../../algorithm/locate/SimplePointInAreaLocator';
export default class GeometryContainsPointVisitor extends ShortCircuitedGeometryVisitor {
	constructor(...args) {
		super();
		(() => {
			this.rectSeq = null;
			this.rectEnv = null;
			this.containsPoint = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [rectangle] = args;
						this.rectSeq = rectangle.getExteriorRing().getCoordinateSequence();
						this.rectEnv = rectangle.getEnvelopeInternal();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	isDone() {
		return this.containsPoint === true;
	}
	visit(geom) {
		if (!(geom instanceof Polygon)) return null;
		var elementEnv = geom.getEnvelopeInternal();
		if (!this.rectEnv.intersects(elementEnv)) return null;
		var rectPt = new Coordinate();
		for (var i = 0; i < 4; i++) {
			this.rectSeq.getCoordinate(i, rectPt);
			if (!elementEnv.contains(rectPt)) continue;
			if (SimplePointInAreaLocator.containsPointInPolygon(rectPt, geom)) {
				this.containsPoint = true;
				return null;
			}
		}
	}
	containsPoint() {
		return this.containsPoint;
	}
	getClass() {
		return GeometryContainsPointVisitor;
	}
}

