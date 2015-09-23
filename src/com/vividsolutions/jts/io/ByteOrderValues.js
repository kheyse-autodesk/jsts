function ByteOrderValues() {}
module.exports = ByteOrderValues
var Double = require('java/lang/Double');
ByteOrderValues.putLong = function (longValue, buf, byteOrder) {
	if (byteOrder === ByteOrderValues.BIG_ENDIAN) {
		buf[0] = longValue >> 56;
		buf[1] = longValue >> 48;
		buf[2] = longValue >> 40;
		buf[3] = longValue >> 32;
		buf[4] = longValue >> 24;
		buf[5] = longValue >> 16;
		buf[6] = longValue >> 8;
		buf[7] = longValue;
	} else {
		buf[0] = longValue;
		buf[1] = longValue >> 8;
		buf[2] = longValue >> 16;
		buf[3] = longValue >> 24;
		buf[4] = longValue >> 32;
		buf[5] = longValue >> 40;
		buf[6] = longValue >> 48;
		buf[7] = longValue >> 56;
	}
};
ByteOrderValues.getDouble = function (buf, byteOrder) {
	var longVal = ByteOrderValues.getLong(buf, byteOrder);
	return Double.longBitsToDouble(longVal);
};
ByteOrderValues.putInt = function (intValue, buf, byteOrder) {
	if (byteOrder === ByteOrderValues.BIG_ENDIAN) {
		buf[0] = intValue >> 24;
		buf[1] = intValue >> 16;
		buf[2] = intValue >> 8;
		buf[3] = intValue;
	} else {
		buf[0] = intValue;
		buf[1] = intValue >> 8;
		buf[2] = intValue >> 16;
		buf[3] = intValue >> 24;
	}
};
ByteOrderValues.putDouble = function (doubleValue, buf, byteOrder) {
	var longVal = Double.doubleToLongBits(doubleValue);
	ByteOrderValues.putLong(longVal, buf, byteOrder);
};
ByteOrderValues.getInt = function (buf, byteOrder) {
	if (byteOrder === ByteOrderValues.BIG_ENDIAN) {
		return (buf[0] & 0xff) << 24 | (buf[1] & 0xff) << 16 | (buf[2] & 0xff) << 8 | buf[3] & 0xff;
	} else {
		return (buf[3] & 0xff) << 24 | (buf[2] & 0xff) << 16 | (buf[1] & 0xff) << 8 | buf[0] & 0xff;
	}
};
ByteOrderValues.getLong = function (buf, byteOrder) {
	if (byteOrder === ByteOrderValues.BIG_ENDIAN) {
		return (buf[0] & 0xff) << 56 | (buf[1] & 0xff) << 48 | (buf[2] & 0xff) << 40 | (buf[3] & 0xff) << 32 | (buf[4] & 0xff) << 24 | (buf[5] & 0xff) << 16 | (buf[6] & 0xff) << 8 | buf[7] & 0xff;
	} else {
		return (buf[7] & 0xff) << 56 | (buf[6] & 0xff) << 48 | (buf[5] & 0xff) << 40 | (buf[4] & 0xff) << 32 | (buf[3] & 0xff) << 24 | (buf[2] & 0xff) << 16 | (buf[1] & 0xff) << 8 | buf[0] & 0xff;
	}
};
ByteOrderValues.BIG_ENDIAN = 1;
ByteOrderValues.LITTLE_ENDIAN = 2;

