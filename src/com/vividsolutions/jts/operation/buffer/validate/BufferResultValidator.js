function BufferResultValidator(input, distance, result) {
	this.input = null;
	this.distance = null;
	this.result = null;
	this.isValid = true;
	this.errorMsg = null;
	this.errorLocation = null;
	this.errorIndicator = null;
	if (arguments.length === 0) return;
	this.input = input;
	this.distance = distance;
	this.result = result;
}
module.exports = BufferResultValidator
var BufferDistanceValidator = require('com/vividsolutions/jts/operation/buffer/validate/BufferDistanceValidator');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
BufferResultValidator.prototype.isValid = function () {
	this.checkPolygonal();
	if (!this.isValid) return this.isValid;
	this.checkExpectedEmpty();
	if (!this.isValid) return this.isValid;
	this.checkEnvelope();
	if (!this.isValid) return this.isValid;
	this.checkArea();
	if (!this.isValid) return this.isValid;
	this.checkDistance();
	return this.isValid;
};
BufferResultValidator.prototype.checkEnvelope = function () {
	if (this.distance < 0.0) return null;
	var padding = this.distance * BufferResultValidator.MAX_ENV_DIFF_FRAC;
	if (padding === 0.0) padding = 0.001;
	var expectedEnv = new Envelope(this.input.getEnvelopeInternal());
	expectedEnv.expandBy(this.distance);
	var bufEnv = new Envelope(this.result.getEnvelopeInternal());
	bufEnv.expandBy(padding);
	if (!bufEnv.contains(expectedEnv)) {
		this.isValid = false;
		this.errorMsg = "Buffer envelope is incorrect";
		this.errorIndicator = this.input.getFactory().toGeometry(bufEnv);
	}
	this.report("Envelope");
};
BufferResultValidator.prototype.checkDistance = function () {
	var distValid = new BufferDistanceValidator(this.input, this.distance, this.result);
	if (!distValid.isValid()) {
		this.isValid = false;
		this.errorMsg = distValid.getErrorMessage();
		this.errorLocation = distValid.getErrorLocation();
		this.errorIndicator = distValid.getErrorIndicator();
	}
	this.report("Distance");
};
BufferResultValidator.prototype.checkArea = function () {
	var inputArea = this.input.getArea();
	var resultArea = this.result.getArea();
	if (this.distance > 0.0 && inputArea > resultArea) {
		this.isValid = false;
		this.errorMsg = "Area of positive buffer is smaller than input";
		this.errorIndicator = this.result;
	}
	if (this.distance < 0.0 && inputArea < resultArea) {
		this.isValid = false;
		this.errorMsg = "Area of negative buffer is larger than input";
		this.errorIndicator = this.result;
	}
	this.report("Area");
};
BufferResultValidator.prototype.checkPolygonal = function () {
	if (!(this.result instanceof Polygon || this.result instanceof MultiPolygon)) this.isValid = false;
	this.errorMsg = "Result is not polygonal";
	this.errorIndicator = this.result;
	this.report("Polygonal");
};
BufferResultValidator.prototype.getErrorIndicator = function () {
	return this.errorIndicator;
};
BufferResultValidator.prototype.getErrorLocation = function () {
	return this.errorLocation;
};
BufferResultValidator.prototype.checkExpectedEmpty = function () {
	if (this.input.getDimension() >= 2) return null;
	if (this.distance > 0.0) return null;
	if (!this.result.isEmpty()) {
		this.isValid = false;
		this.errorMsg = "Result is non-empty";
		this.errorIndicator = this.result;
	}
	this.report("ExpectedEmpty");
};
BufferResultValidator.prototype.report = function (checkName) {
	if (!BufferResultValidator.VERBOSE) return null;
	System.out.println("Check " + checkName + ": " + (this.isValid ? "passed" : "FAILED"));
};
BufferResultValidator.prototype.getErrorMessage = function () {
	return this.errorMsg;
};
BufferResultValidator.isValidMsg = function (g, distance, result) {
	var validator = new BufferResultValidator(g, distance, result);
	if (!validator.isValid()) return validator.getErrorMessage();
	return null;
};
BufferResultValidator.isValid = function (g, distance, result) {
	var validator = new BufferResultValidator(g, distance, result);
	if (validator.isValid()) return true;
	return false;
};
BufferResultValidator.VERBOSE = false;
BufferResultValidator.MAX_ENV_DIFF_FRAC = .012;

