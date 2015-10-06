import ShortCircuitedGeometryVisitor from 'com/vividsolutions/jts/geom/util/ShortCircuitedGeometryVisitor';
export default class EnvelopeIntersectsVisitor extends ShortCircuitedGeometryVisitor {
	constructor(...args) {
		super();
		(() => {
			this.rectEnv = null;
			this.intersects = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [rectEnv] = args;
						this.rectEnv = rectEnv;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	isDone() {
		return this.intersects === true;
	}
	visit(element) {
		var elementEnv = element.getEnvelopeInternal();
		if (!this.rectEnv.intersects(elementEnv)) {
			return null;
		}
		if (this.rectEnv.contains(elementEnv)) {
			this.intersects = true;
			return null;
		}
		if (elementEnv.getMinX() >= this.rectEnv.getMinX() && elementEnv.getMaxX() <= this.rectEnv.getMaxX()) {
			this.intersects = true;
			return null;
		}
		if (elementEnv.getMinY() >= this.rectEnv.getMinY() && elementEnv.getMaxY() <= this.rectEnv.getMaxY()) {
			this.intersects = true;
			return null;
		}
	}
	intersects() {
		return this.intersects;
	}
	getClass() {
		return EnvelopeIntersectsVisitor;
	}
}

