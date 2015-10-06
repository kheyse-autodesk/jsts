import IsValidOp from 'com/vividsolutions/jts/operation/valid/IsValidOp';
import BufferOp from 'com/vividsolutions/jts/operation/buffer/BufferOp';
import CommonBitsOp from 'com/vividsolutions/jts/precision/CommonBitsOp';
import RuntimeException from 'java/lang/RuntimeException';
import OverlayOp from 'com/vividsolutions/jts/operation/overlay/OverlayOp';
export default class EnhancedPrecisionOp {
	get interfaces_() {
		return [];
	}
	static union(geom0, geom1) {
		var originalEx = null;
		try {
			var result = OverlayOp.union(geom0, geom1);
			return result;
		} catch (ex) {
			if (ex instanceof RuntimeException) {
				originalEx = ex;
			} else throw ex;
		} finally {}
		try {
			var cbo = new CommonBitsOp(true);
			var resultEP = cbo.union(geom0, geom1);
			if (!IsValidOp.isValid(resultEP)) throw originalEx;
			return resultEP;
		} catch (ex2) {
			if (ex2 instanceof RuntimeException) {
				throw originalEx;
			} else throw ex2;
		} finally {}
	}
	static intersection(geom0, geom1) {
		var originalEx = null;
		try {
			var result = OverlayOp.intersection(geom0, geom1);
			return result;
		} catch (ex) {
			if (ex instanceof RuntimeException) {
				originalEx = ex;
			} else throw ex;
		} finally {}
		try {
			var cbo = new CommonBitsOp(true);
			var resultEP = cbo.intersection(geom0, geom1);
			if (!IsValidOp.isValid(resultEP)) throw originalEx;
			return resultEP;
		} catch (ex2) {
			if (ex2 instanceof RuntimeException) {
				throw originalEx;
			} else throw ex2;
		} finally {}
	}
	static buffer(geom, distance) {
		var originalEx = null;
		try {
			var result = BufferOp.bufferOp(geom, distance);
			return result;
		} catch (ex) {
			if (ex instanceof RuntimeException) {
				originalEx = ex;
			} else throw ex;
		} finally {}
		try {
			var cbo = new CommonBitsOp(true);
			var resultEP = BufferOp.bufferOp(geom, distance);
			if (!IsValidOp.isValid(resultEP)) throw originalEx;
			return resultEP;
		} catch (ex2) {
			if (ex2 instanceof RuntimeException) {
				throw originalEx;
			} else throw ex2;
		} finally {}
	}
	static symDifference(geom0, geom1) {
		var originalEx = null;
		try {
			var result = OverlayOp.symDifference(geom0, geom1);
			return result;
		} catch (ex) {
			if (ex instanceof RuntimeException) {
				originalEx = ex;
			} else throw ex;
		} finally {}
		try {
			var cbo = new CommonBitsOp(true);
			var resultEP = cbo.symDifference(geom0, geom1);
			if (!IsValidOp.isValid(resultEP)) throw originalEx;
			return resultEP;
		} catch (ex2) {
			if (ex2 instanceof RuntimeException) {
				throw originalEx;
			} else throw ex2;
		} finally {}
	}
	static difference(geom0, geom1) {
		var originalEx = null;
		try {
			var result = OverlayOp.difference(geom0, geom1);
			return result;
		} catch (ex) {
			if (ex instanceof RuntimeException) {
				originalEx = ex;
			} else throw ex;
		} finally {}
		try {
			var cbo = new CommonBitsOp(true);
			var resultEP = cbo.difference(geom0, geom1);
			if (!IsValidOp.isValid(resultEP)) throw originalEx;
			return resultEP;
		} catch (ex2) {
			if (ex2 instanceof RuntimeException) {
				throw originalEx;
			} else throw ex2;
		} finally {}
	}
}

