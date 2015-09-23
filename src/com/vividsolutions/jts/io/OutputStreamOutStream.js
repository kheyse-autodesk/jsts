function OutputStreamOutStream(os) {
	this.os = null;
	if (arguments.length === 0) return;
	this.os = os;
}
module.exports = OutputStreamOutStream
OutputStreamOutStream.prototype.write = function (buf, len) {
	this.os.write(buf, 0, len);
};

