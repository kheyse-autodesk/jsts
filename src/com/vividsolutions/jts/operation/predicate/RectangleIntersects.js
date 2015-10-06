import GeometryContainsPointVisitor from 'com/vividsolutions/jts/operation/predicate/GeometryContainsPointVisitor';
import RectangleIntersectsSegmentVisitor from 'com/vividsolutions/jts/operation/predicate/RectangleIntersectsSegmentVisitor';
import EnvelopeIntersectsVisitor from 'com/vividsolutions/jts/operation/predicate/EnvelopeIntersectsVisitor';
export default class RectangleIntersects {
	constructor(...args) {
		(() => {
			this.rectangle = null;
			this.rectEnv = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [rectangle] = args;
						this.rectangle = rectangle;
						this.rectEnv = rectangle.getEnvelopeInternal();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static intersects(rectangle, b) {
		var rp = new RectangleIntersects(rectangle);
		return rp.intersects(b);
	}
	intersects(geom) {
		if (!this.rectEnv.intersects(geom.getEnvelopeInternal())) return false;
		var visitor = new EnvelopeIntersectsVisitor(this.rectEnv);
		visitor.applyTo(geom);
		if (visitor.intersects()) return true;
		var ecpVisitor = new GeometryContainsPointVisitor(this.rectangle);
		ecpVisitor.applyTo(geom);
		if (ecpVisitor.containsPoint()) return true;
		var riVisitor = new RectangleIntersectsSegmentVisitor(this.rectangle);
		riVisitor.applyTo(geom);
		if (riVisitor.intersects()) return true;
		return false;
	}
	getClass() {
		return RectangleIntersects;
	}
}

