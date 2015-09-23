function BufferOp(...args) {
	this.argGeom = null;
	this.distance = null;
	this.bufParams = new BufferParameters();
	this.resultGeometry = null;
	this.saveException = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g, bufParams] = args;
				this.argGeom = g;
				this.bufParams = bufParams;
			})(...args);
		case 1:
			return ((...args) => {
				let [g] = args;
				this.argGeom = g;
			})(...args);
	}
}
module.exports = BufferOp
var BufferParameters = require('com/vividsolutions/jts/operation/buffer/BufferParameters');
var Geometry = require('com/vividsolutions/jts/geom/Geometry');
var BufferBuilder = require('com/vividsolutions/jts/operation/buffer/BufferBuilder');
var ScaledNoder = require('com/vividsolutions/jts/noding/ScaledNoder');
var TopologyException = require('com/vividsolutions/jts/geom/TopologyException');
var MathUtil = require('com/vividsolutions/jts/math/MathUtil');
var PrecisionModel = require('com/vividsolutions/jts/geom/PrecisionModel');
var RuntimeException = require('java/lang/RuntimeException');
var MCIndexSnapRounder = require('com/vividsolutions/jts/noding/snapround/MCIndexSnapRounder');
BufferOp.prototype.bufferFixedPrecision = function (fixedPM) {
	var noder = new ScaledNoder(new MCIndexSnapRounder(new PrecisionModel(1.0)), fixedPM.getScale());
	var bufBuilder = new BufferBuilder(this.bufParams);
	bufBuilder.setWorkingPrecisionModel(fixedPM);
	bufBuilder.setNoder(noder);
	this.resultGeometry = bufBuilder.buffer(this.argGeom, this.distance);
};
BufferOp.prototype.bufferReducedPrecision = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [precisionDigits] = args;
				var sizeBasedScaleFactor = BufferOp.precisionScaleFactor(this.argGeom, this.distance, precisionDigits);
				var fixedPM = new PrecisionModel(sizeBasedScaleFactor);
				this.bufferFixedPrecision(fixedPM);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				for (var precDigits = BufferOp.MAX_PRECISION_DIGITS; precDigits >= 0; precDigits--) {
					try {
						this.bufferReducedPrecision(precDigits);
					} catch (e) {
						if (e instanceof TopologyException) {
							this.saveException = ex;
						}
					} finally {}
					if (this.resultGeometry !== null) return null;
				}
				throw this.saveException;
			})(...args);
	}
};
BufferOp.prototype.computeGeometry = function () {
	this.bufferOriginalPrecision();
	if (this.resultGeometry !== null) return null;
	var argPM = this.argGeom.getFactory().getPrecisionModel();
	if (argPM.getType() === PrecisionModel.FIXED) this.bufferFixedPrecision(argPM); else this.bufferReducedPrecision();
};
BufferOp.prototype.setQuadrantSegments = function (quadrantSegments) {
	this.bufParams.setQuadrantSegments(quadrantSegments);
};
BufferOp.prototype.bufferOriginalPrecision = function () {
	try {
		var bufBuilder = new BufferBuilder(this.bufParams);
		this.resultGeometry = bufBuilder.buffer(this.argGeom, this.distance);
	} catch (e) {
		if (e instanceof RuntimeException) {
			this.saveException = ex;
		}
	} finally {}
};
BufferOp.prototype.getResultGeometry = function (distance) {
	this.distance = distance;
	this.computeGeometry();
	return this.resultGeometry;
};
BufferOp.prototype.setEndCapStyle = function (endCapStyle) {
	this.bufParams.setEndCapStyle(endCapStyle);
};
BufferOp.bufferOp = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [g, distance] = args;
				var gBuf = new BufferOp(g);
				var geomBuf = gBuf.getResultGeometry(distance);
				return geomBuf;
			})(...args);
		case 4:
			return ((...args) => {
				let [g, distance, quadrantSegments, endCapStyle] = args;
				var bufOp = new BufferOp(g);
				bufOp.setQuadrantSegments(quadrantSegments);
				bufOp.setEndCapStyle(endCapStyle);
				var geomBuf = bufOp.getResultGeometry(distance);
				return geomBuf;
			})(...args);
		case 3:
			if (args[2] instanceof BufferParameters && args[0] instanceof Geometry && !Number.isInteger(args[1])) {
				return ((...args) => {
					let [g, distance, params] = args;
					var bufOp = new BufferOp(g, params);
					var geomBuf = bufOp.getResultGeometry(distance);
					return geomBuf;
				})(...args);
			} else if (Number.isInteger(args[2]) && args[0] instanceof Geometry && !Number.isInteger(args[1])) {
				return ((...args) => {
					let [g, distance, quadrantSegments] = args;
					var bufOp = new BufferOp(g);
					bufOp.setQuadrantSegments(quadrantSegments);
					var geomBuf = bufOp.getResultGeometry(distance);
					return geomBuf;
				})(...args);
			}
	}
};
BufferOp.precisionScaleFactor = function (g, distance, maxPrecisionDigits) {
	var env = g.getEnvelopeInternal();
	var envMax = MathUtil.max(Math.abs(env.getMaxX()), Math.abs(env.getMaxY()), Math.abs(env.getMinX()), Math.abs(env.getMinY()));
	var expandByDistance = distance > 0.0 ? distance : 0.0;
	var bufEnvMax = envMax + 2 * expandByDistance;
	var bufEnvPrecisionDigits = Math.log(bufEnvMax) / Math.log(10) + 1.0;
	var minUnitLog10 = maxPrecisionDigits - bufEnvPrecisionDigits;
	var scaleFactor = Math.pow(10.0, minUnitLog10);
	return scaleFactor;
};
BufferOp.CAP_ROUND = BufferParameters.CAP_ROUND;
BufferOp.CAP_BUTT = BufferParameters.CAP_FLAT;
BufferOp.CAP_FLAT = BufferParameters.CAP_FLAT;
BufferOp.CAP_SQUARE = BufferParameters.CAP_SQUARE;
BufferOp.MAX_PRECISION_DIGITS = 12;

