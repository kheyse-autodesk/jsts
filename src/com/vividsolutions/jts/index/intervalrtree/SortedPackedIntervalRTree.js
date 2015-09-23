function SortedPackedIntervalRTree() {
	this.leaves = new ArrayList();
	this.root = null;
	this.level = 0;
	if (arguments.length === 0) return;
}
module.exports = SortedPackedIntervalRTree
var WKTWriter = require('com/vividsolutions/jts/io/WKTWriter');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var IntervalRTreeLeafNode = require('com/vividsolutions/jts/index/intervalrtree/IntervalRTreeLeafNode');
var Collections = require('java/util/Collections');
var ArrayList = require('java/util/ArrayList');
var IntervalRTreeBranchNode = require('com/vividsolutions/jts/index/intervalrtree/IntervalRTreeBranchNode');
SortedPackedIntervalRTree.prototype.buildTree = function () {
	Collections.sort(this.leaves, new IntervalRTreeNode.NodeComparator());
	var src = this.leaves;
	var temp = null;
	var dest = new ArrayList();
	while (true) {
		this.buildLevel(src, dest);
		if (dest.size() === 1) return dest.get(0);
		temp = src;
		src = dest;
		dest = temp;
	}
};
SortedPackedIntervalRTree.prototype.insert = function (min, max, item) {
	if (this.root !== null) throw new IllegalStateException("Index cannot be added to once it has been queried");
	this.leaves.add(new IntervalRTreeLeafNode(min, max, item));
};
SortedPackedIntervalRTree.prototype.query = function (min, max, visitor) {
	this.init();
	this.root.query(min, max, visitor);
};
SortedPackedIntervalRTree.prototype.buildRoot = function () {
	if (this.root !== null) return null;
	this.root = this.buildTree();
};
SortedPackedIntervalRTree.prototype.printNode = function (node) {
	System.out.println(WKTWriter.toLineString(new Coordinate(node.min, this.level), new Coordinate(node.max, this.level)));
};
SortedPackedIntervalRTree.prototype.init = function () {
	if (this.root !== null) return null;
	this.buildRoot();
};
SortedPackedIntervalRTree.prototype.buildLevel = function (src, dest) {
	this.level++;
	dest.clear();
	for (var i = 0; i < src.size(); i += 2) {
		var n1 = src.get(i);
		var n2 = i + 1 < src.size() ? src.get(i) : null;
		if (n2 === null) {
			dest.add(n1);
		} else {
			var node = new IntervalRTreeBranchNode(src.get(i), src.get(i + 1));
			dest.add(node);
		}
	}
};

