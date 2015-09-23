function NumberUtil() {}
module.exports = NumberUtil
NumberUtil.equalsWithTolerance = function (x1, x2, tolerance) {
	return Math.abs(x1 - x2) <= tolerance;
};

