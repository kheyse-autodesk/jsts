function ByteOrderDataInStream(...args) {
	this.byteOrder = ByteOrderValues.BIG_ENDIAN;
	this.stream = null;
	this.buf1 = [];
	this.buf4 = [];
	this.buf8 = [];
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [stream] = args;
				this.stream = stream;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				this.stream = null;
			})(...args);
	}
}
module.exports = ByteOrderDataInStream
var ByteOrderValues = require('com/vividsolutions/jts/io/ByteOrderValues');
ByteOrderDataInStream.prototype.setInStream = function (stream) {
	this.stream = stream;
};
ByteOrderDataInStream.prototype.readLong = function () {
	this.stream.read(this.buf8);
	return ByteOrderValues.getLong(this.buf8, this.byteOrder);
};
ByteOrderDataInStream.prototype.setOrder = function (byteOrder) {
	this.byteOrder = byteOrder;
};
ByteOrderDataInStream.prototype.readByte = function () {
	this.stream.read(this.buf1);
	return this.buf1[0];
};
ByteOrderDataInStream.prototype.readDouble = function () {
	this.stream.read(this.buf8);
	return ByteOrderValues.getDouble(this.buf8, this.byteOrder);
};
ByteOrderDataInStream.prototype.readInt = function () {
	this.stream.read(this.buf4);
	return ByteOrderValues.getInt(this.buf4, this.byteOrder);
};

