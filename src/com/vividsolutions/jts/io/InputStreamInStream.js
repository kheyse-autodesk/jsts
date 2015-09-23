function InputStreamInStream(is) {
	this.is = null;
	if (arguments.length === 0) return;
	this.is = is;
}
module.exports = InputStreamInStream
InputStreamInStream.prototype.read = function (buf) {
	this.is.read(buf);
};

