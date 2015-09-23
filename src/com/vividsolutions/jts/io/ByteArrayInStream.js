function ByteArrayInStream(buffer) {
	this.buffer = null;
	this.position = null;
	if (arguments.length === 0) return;
	this.setBytes(buffer);
}
module.exports = ByteArrayInStream
ByteArrayInStream.prototype.setBytes = function (buffer) {
	this.buffer = buffer;
	this.position = 0;
};
ByteArrayInStream.prototype.read = function (buf) {
	var numToRead = buf.length;
	if (this.position + numToRead > this.buffer.length) {
		numToRead = this.buffer.length - this.position;
		System.arraycopy(this.buffer, this.position, buf, 0, numToRead);
		for (var i = numToRead; i < buf.length; i++) {
			buf[i] = 0;
		}
	} else {
		System.arraycopy(this.buffer, this.position, buf, 0, numToRead);
	}
	this.position += numToRead;
};

