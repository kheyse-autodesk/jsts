function NodeMap() {
	this.nodeMap = new TreeMap();
	if (arguments.length === 0) return;
}
module.exports = NodeMap
var TreeMap = require('java/util/TreeMap');
NodeMap.prototype.find = function (coord) {
	return this.nodeMap.get(coord);
};
NodeMap.prototype.iterator = function () {
	return this.nodeMap.values().iterator();
};
NodeMap.prototype.remove = function (pt) {
	return this.nodeMap.remove(pt);
};
NodeMap.prototype.values = function () {
	return this.nodeMap.values();
};
NodeMap.prototype.add = function (n) {
	this.nodeMap.put(n.getCoordinate(), n);
	return n;
};

