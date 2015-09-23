function BufferParameters(...args) {
	this.quadrantSegments = BufferParameters.DEFAULT_QUADRANT_SEGMENTS;
	this.endCapStyle = BufferParameters.CAP_ROUND;
	this.joinStyle = BufferParameters.JOIN_ROUND;
	this.mitreLimit = BufferParameters.DEFAULT_MITRE_LIMIT;
	this.isSingleSided = false;
	this.simplifyFactor = BufferParameters.DEFAULT_SIMPLIFY_FACTOR;
	switch (args.length) {
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
		case 1:
			return ((...args) => {
				let [quadrantSegments] = args;
				this.setQuadrantSegments(quadrantSegments);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = BufferParameters
BufferParameters.prototype.getEndCapStyle = function () {
	return this.endCapStyle;
};
BufferParameters.prototype.isSingleSided = function () {
	return this.isSingleSided;
};
BufferParameters.prototype.setQuadrantSegments = function (quadSegs) {
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
};
BufferParameters.prototype.getJoinStyle = function () {
	return this.joinStyle;
};
BufferParameters.prototype.setJoinStyle = function (joinStyle) {
	this.joinStyle = joinStyle;
};
BufferParameters.prototype.setSimplifyFactor = function (simplifyFactor) {
	this.simplifyFactor = simplifyFactor < 0 ? 0 : simplifyFactor;
};
BufferParameters.prototype.getSimplifyFactor = function () {
	return this.simplifyFactor;
};
BufferParameters.prototype.getQuadrantSegments = function () {
	return this.quadrantSegments;
};
BufferParameters.prototype.setEndCapStyle = function (endCapStyle) {
	this.endCapStyle = endCapStyle;
};
BufferParameters.prototype.getMitreLimit = function () {
	return this.mitreLimit;
};
BufferParameters.prototype.setMitreLimit = function (mitreLimit) {
	this.mitreLimit = mitreLimit;
};
BufferParameters.prototype.setSingleSided = function (isSingleSided) {
	this.isSingleSided = isSingleSided;
};
BufferParameters.bufferDistanceError = function (quadSegs) {
	var alpha = Math.PI / 2.0 / quadSegs;
	return 1 - Math.cos(alpha / 2.0);
};
BufferParameters.CAP_ROUND = 1;
BufferParameters.CAP_FLAT = 2;
BufferParameters.CAP_SQUARE = 3;
BufferParameters.JOIN_ROUND = 1;
BufferParameters.JOIN_MITRE = 2;
BufferParameters.JOIN_BEVEL = 3;
BufferParameters.DEFAULT_QUADRANT_SEGMENTS = 8;
BufferParameters.DEFAULT_MITRE_LIMIT = 5.0;
BufferParameters.DEFAULT_SIMPLIFY_FACTOR = 0.01;

