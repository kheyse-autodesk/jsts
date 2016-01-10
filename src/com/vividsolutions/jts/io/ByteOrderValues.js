import Double from 'java/lang/Double';
export default class ByteOrderValues {
	get interfaces_() {
		return [];
	}
	static get BIG_ENDIAN() {
		return 1;
	}
	static get LITTLE_ENDIAN() {
		return 2;
	}
	static putLong(longValue, buf, byteOrder) {
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
	}
	static getDouble(buf, byteOrder) {
		var longVal = ByteOrderValues.getLong(buf, byteOrder);
		return Double.longBitsToDouble(longVal);
	}
	static putInt(intValue, buf, byteOrder) {
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
	}
	static putDouble(doubleValue, buf, byteOrder) {
		var longVal = Double.doubleToLongBits(doubleValue);
		ByteOrderValues.putLong(longVal, buf, byteOrder);
	}
	static getInt(buf, byteOrder) {
		if (byteOrder === ByteOrderValues.BIG_ENDIAN) {
			return Math.trunc(buf[0] & 0xff) << 24 | Math.trunc(buf[1] & 0xff) << 16 | Math.trunc(buf[2] & 0xff) << 8 | Math.trunc(buf[3] & 0xff);
		} else {
			return Math.trunc(buf[3] & 0xff) << 24 | Math.trunc(buf[2] & 0xff) << 16 | Math.trunc(buf[1] & 0xff) << 8 | Math.trunc(buf[0] & 0xff);
		}
	}
	static getLong(buf, byteOrder) {
		if (byteOrder === ByteOrderValues.BIG_ENDIAN) {
			return (buf[0] & 0xff) << 56 | (buf[1] & 0xff) << 48 | (buf[2] & 0xff) << 40 | (buf[3] & 0xff) << 32 | (buf[4] & 0xff) << 24 | (buf[5] & 0xff) << 16 | (buf[6] & 0xff) << 8 | buf[7] & 0xff;
		} else {
			return (buf[7] & 0xff) << 56 | (buf[6] & 0xff) << 48 | (buf[5] & 0xff) << 40 | (buf[4] & 0xff) << 32 | (buf[3] & 0xff) << 24 | (buf[2] & 0xff) << 16 | (buf[1] & 0xff) << 8 | buf[0] & 0xff;
		}
	}
	getClass() {
		return ByteOrderValues;
	}
}

