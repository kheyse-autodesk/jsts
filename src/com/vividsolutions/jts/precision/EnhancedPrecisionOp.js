function EnhancedPrecisionOp() {}
module.exports = EnhancedPrecisionOp
var CommonBitsOp = require('com/vividsolutions/jts/precision/CommonBitsOp');
var RuntimeException = require('java/lang/RuntimeException');
EnhancedPrecisionOp.union = function (geom0, geom1) {
	var originalEx = null;
	try {
		var result = geom0.union(geom1);
		return result;
	} catch (e) {
		if (e instanceof RuntimeException) {
			originalEx = ex;
		}
	} finally {}
	try {
		var cbo = new CommonBitsOp(true);
		var resultEP = cbo.union(geom0, geom1);
		if (!resultEP.isValid()) throw originalEx;
		return resultEP;
	} catch (e) {
		if (e instanceof RuntimeException) {
			throw originalEx;
		}
	} finally {}
};
EnhancedPrecisionOp.intersection = function (geom0, geom1) {
	var originalEx = null;
	try {
		var result = geom0.intersection(geom1);
		return result;
	} catch (e) {
		if (e instanceof RuntimeException) {
			originalEx = ex;
		}
	} finally {}
	try {
		var cbo = new CommonBitsOp(true);
		var resultEP = cbo.intersection(geom0, geom1);
		if (!resultEP.isValid()) throw originalEx;
		return resultEP;
	} catch (e) {
		if (e instanceof RuntimeException) {
			throw originalEx;
		}
	} finally {}
};
EnhancedPrecisionOp.buffer = function (geom, distance) {
	var originalEx = null;
	try {
		var result = geom.buffer(distance);
		return result;
	} catch (e) {
		if (e instanceof RuntimeException) {
			originalEx = ex;
		}
	} finally {}
	try {
		var cbo = new CommonBitsOp(true);
		var resultEP = cbo.buffer(geom, distance);
		if (!resultEP.isValid()) throw originalEx;
		return resultEP;
	} catch (e) {
		if (e instanceof RuntimeException) {
			throw originalEx;
		}
	} finally {}
};
EnhancedPrecisionOp.symDifference = function (geom0, geom1) {
	var originalEx = null;
	try {
		var result = geom0.symDifference(geom1);
		return result;
	} catch (e) {
		if (e instanceof RuntimeException) {
			originalEx = ex;
		}
	} finally {}
	try {
		var cbo = new CommonBitsOp(true);
		var resultEP = cbo.symDifference(geom0, geom1);
		if (!resultEP.isValid()) throw originalEx;
		return resultEP;
	} catch (e) {
		if (e instanceof RuntimeException) {
			throw originalEx;
		}
	} finally {}
};
EnhancedPrecisionOp.difference = function (geom0, geom1) {
	var originalEx = null;
	try {
		var result = geom0.difference(geom1);
		return result;
	} catch (e) {
		if (e instanceof RuntimeException) {
			originalEx = ex;
		}
	} finally {}
	try {
		var cbo = new CommonBitsOp(true);
		var resultEP = cbo.difference(geom0, geom1);
		if (!resultEP.isValid()) throw originalEx;
		return resultEP;
	} catch (e) {
		if (e instanceof RuntimeException) {
			throw originalEx;
		}
	} finally {}
};

