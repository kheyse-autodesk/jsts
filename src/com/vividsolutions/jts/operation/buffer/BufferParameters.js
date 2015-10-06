export default class BufferParameters {
	constructor(...args) {
		(() => {
			this.quadrantSegments = BufferParameters.DEFAULT_QUADRANT_SEGMENTS;
			this.endCapStyle = BufferParameters.CAP_ROUND;
			this.joinStyle = BufferParameters.JOIN_ROUND;
			this.mitreLimit = BufferParameters.DEFAULT_MITRE_LIMIT;
			this.isSingleSided = false;
			this.simplifyFactor = BufferParameters.DEFAULT_SIMPLIFY_FACTOR;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 1:
					return ((...args) => {
						let [quadrantSegments] = args;
						this.setQuadrantSegments(quadrantSegments);
					})(...args);
				case 2:
					return ((...args) => {
						let [quadrantSegments, endCapStyle] = args;
						this.setQuadrantSegments(quadrantSegments);
						this.setEndCapStyle(endCapStyle);
					})(...args);
				case 4:
					return ((...args) => {
						let [quadrantSegments, endCapStyle, joinStyle, mitreLimit] = args;
						this.setQuadrantSegments(quadrantSegments);
						this.setEndCapStyle(endCapStyle);
						this.setJoinStyle(joinStyle);
						this.setMitreLimit(mitreLimit);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get CAP_ROUND() {
		return 1;
	}
	static get CAP_FLAT() {
		return 2;
	}
	static get CAP_SQUARE() {
		return 3;
	}
	static get JOIN_ROUND() {
		return 1;
	}
	static get JOIN_MITRE() {
		return 2;
	}
	static get JOIN_BEVEL() {
		return 3;
	}
	static get DEFAULT_QUADRANT_SEGMENTS() {
		return 8;
	}
	static get DEFAULT_MITRE_LIMIT() {
		return 5.0;
	}
	static get DEFAULT_SIMPLIFY_FACTOR() {
		return 0.01;
	}
	static bufferDistanceError(quadSegs) {
		var alpha = Math.PI / 2.0 / quadSegs;
		return 1 - Math.cos(alpha / 2.0);
	}
	getEndCapStyle() {
		return this.endCapStyle;
	}
	isSingleSided() {
		return this.isSingleSided;
	}
	setQuadrantSegments(quadSegs) {
		this.quadrantSegments = quadSegs;
		if (this.quadrantSegments === 0) this.joinStyle = BufferParameters.JOIN_BEVEL;
		if (this.quadrantSegments < 0) {
			this.joinStyle = BufferParameters.JOIN_MITRE;
			this.mitreLimit = Math.abs(this.quadrantSegments);
		}
		if (quadSegs <= 0) {
			this.quadrantSegments = 1;
		}
		if (this.joinStyle !== BufferParameters.JOIN_ROUND) {
			this.quadrantSegments = BufferParameters.DEFAULT_QUADRANT_SEGMENTS;
		}
	}
	getJoinStyle() {
		return this.joinStyle;
	}
	setJoinStyle(joinStyle) {
		this.joinStyle = joinStyle;
	}
	setSimplifyFactor(simplifyFactor) {
		this.simplifyFactor = simplifyFactor < 0 ? 0 : simplifyFactor;
	}
	getSimplifyFactor() {
		return this.simplifyFactor;
	}
	getQuadrantSegments() {
		return this.quadrantSegments;
	}
	setEndCapStyle(endCapStyle) {
		this.endCapStyle = endCapStyle;
	}
	getMitreLimit() {
		return this.mitreLimit;
	}
	setMitreLimit(mitreLimit) {
		this.mitreLimit = mitreLimit;
	}
	setSingleSided(isSingleSided) {
		this.isSingleSided = isSingleSided;
	}
}

