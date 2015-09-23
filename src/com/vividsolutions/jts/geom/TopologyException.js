function TopologyException(...args) {
	this.pt = null;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [msg, pt] = args;
				TopologyException.super_.call(this, TopologyException.msgWithCoord(msg, pt));
				this.pt = new Coordinate(pt);
			})(...args);
		case 1:
			return ((...args) => {
				let [msg] = args;
				TopologyException.super_.call(this, msg);
			})(...args);
	}
}
module.exports = TopologyException
var RuntimeException = require('java/lang/RuntimeException');
var util = require('util');
util.inherits(TopologyException, RuntimeException)
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
TopologyException.prototype.getCoordinate = function () {
	return this.pt;
};
TopologyException.msgWithCoord = function (msg, pt) {
	if (pt !== null) return msg + " [ " + pt + " ]";
	return msg;
};

