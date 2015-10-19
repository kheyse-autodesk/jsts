import ShortCircuitedGeometryVisitor from '../../geom/util/ShortCircuitedGeometryVisitor';
export default class EnvelopeIntersectsVisitor extends ShortCircuitedGeometryVisitor {
	constructor(...args) {
		super();
		(() => {
			this.rectEnv = null;
			this._intersects = false;
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
		return this._intersects === true;
	}
	visit(element) {
		var elementEnv = element.getEnvelopeInternal();
		if (!this.rectEnv.intersects(elementEnv)) {
			return null;
		}
		if (this.rectEnv.contains(elementEnv)) {
			this._intersects = true;
			return null;
		}
		if (elementEnv.getMinX() >= this.rectEnv.getMinX() && elementEnv.getMaxX() <= this.rectEnv.getMaxX()) {
			this._intersects = true;
			return null;
		}
		if (elementEnv.getMinY() >= this.rectEnv.getMinY() && elementEnv.getMaxY() <= this.rectEnv.getMaxY()) {
			this._intersects = true;
			return null;
		}
	}
	intersects() {
		return this._intersects;
	}
	getClass() {
		return EnvelopeIntersectsVisitor;
	}
}

