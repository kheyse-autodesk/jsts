function KdTree(...args) {
	this.root = null;
	this.numberOfNodes = null;
	this.tolerance = null;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [tolerance] = args;
				this.tolerance = tolerance;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				KdTree.call(this, 0.0);
			})(...args);
	}
}
module.exports = KdTree
var CoordinateList = require('com/vividsolutions/jts/geom/CoordinateList');
var ArrayList = require('java/util/ArrayList');
var KdNodeVisitor = require('com/vividsolutions/jts/index/kdtree/KdNodeVisitor');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var List = require('java/util/List');
var KdNode = require('com/vividsolutions/jts/index/kdtree/KdNode');
KdTree.prototype.insert = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p, data] = args;
				if (this.root === null) {
					this.root = new KdNode(p, data);
					return this.root;
				}
				if (this.tolerance > 0) {
					var matchNode = this.findBestMatchNode(p);
					if (matchNode !== null) {
						matchNode.increment();
						return matchNode;
					}
				}
				return this.insertExact(p, data);
			})(...args);
		case 1:
			return ((...args) => {
				let [p] = args;
				return this.insert(p, null);
			})(...args);
	}
};
KdTree.prototype.query = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof Envelope && args[1] instanceof KdNodeVisitor) {
				return ((...args) => {
					let [queryEnv, visitor] = args;
					this.queryNode(this.root, queryEnv, true, visitor);
				})(...args);
			} else if (args[0] instanceof Envelope && args[1] instanceof List) {
				return ((...args) => {
					let [queryEnv, result] = args;
					this.queryNode(this.root, queryEnv, true, new KdNodeVisitor());
				})(...args);
			}
		case 1:
			return ((...args) => {
				let [queryEnv] = args;
				var result = new ArrayList();
				this.query(queryEnv, result);
				return result;
			})(...args);
	}
};
KdTree.prototype.queryNode = function (currentNode, queryEnv, odd, visitor) {
	if (currentNode === null) return null;
	var min = null;
	var max = null;
	var discriminant = null;
	if (odd) {
		min = queryEnv.getMinX();
		max = queryEnv.getMaxX();
		discriminant = currentNode.getX();
	} else {
		min = queryEnv.getMinY();
		max = queryEnv.getMaxY();
		discriminant = currentNode.getY();
	}
	var searchLeft = min < discriminant;
	var searchRight = discriminant <= max;
	if (searchLeft) {
		this.queryNode(currentNode.getLeft(), queryEnv, !odd, visitor);
	}
	if (queryEnv.contains(currentNode.getCoordinate())) {
		visitor.visit(currentNode);
	}
	if (searchRight) {
		this.queryNode(currentNode.getRight(), queryEnv, !odd, visitor);
	}
};
KdTree.prototype.findBestMatchNode = function (p) {
	var visitor = new BestMatchVisitor(p, this.tolerance);
	this.query(visitor.queryEnvelope(), visitor);
	return visitor.getNode();
};
KdTree.prototype.isEmpty = function () {
	if (this.root === null) return true;
	return false;
};
KdTree.prototype.insertExact = function (p, data) {
	var currentNode = this.root;
	var leafNode = this.root;
	var isOddLevel = true;
	var isLessThan = true;
	while (currentNode !== null) {
		if (currentNode !== null) {
			var isInTolerance = p.distance(currentNode.getCoordinate()) <= this.tolerance;
			if (isInTolerance) {
				currentNode.increment();
				return currentNode;
			}
		}
		if (isOddLevel) {
			isLessThan = p.x < currentNode.getX();
		} else {
			isLessThan = p.y < currentNode.getY();
		}
		leafNode = currentNode;
		if (isLessThan) {
			currentNode = currentNode.getLeft();
		} else {
			currentNode = currentNode.getRight();
		}
		isOddLevel = !isOddLevel;
	}
	this.numberOfNodes = this.numberOfNodes + 1;
	var node = new KdNode(p, data);
	if (isLessThan) {
		leafNode.setLeft(node);
	} else {
		leafNode.setRight(node);
	}
	return node;
};
KdTree.toCoordinates = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [kdnodes, includeRepeated] = args;
				var coord = new CoordinateList();
				for (var it = kdnodes.iterator(); it.hasNext(); ) {
					var node = it.next();
					var count = includeRepeated ? node.getCount() : 1;
					for (var i = 0; i < count; i++) {
						coord.add(node.getCoordinate(), true);
					}
				}
				return coord.toCoordinateArray();
			})(...args);
		case 1:
			return ((...args) => {
				let [kdnodes] = args;
				return KdTree.toCoordinates(kdnodes, false);
			})(...args);
	}
};
function BestMatchVisitor(p, tolerance) {
	this.tolerance = null;
	this.matchNode = null;
	this.matchDist = 0.0;
	this.p = null;
	if (arguments.length === 0) return;
	this.p = p;
	this.tolerance = tolerance;
}
BestMatchVisitor.prototype.visit = function (node) {
	var dist = this.p.distance(node.getCoordinate());
	var isInTolerance = dist <= this.tolerance;
	if (!isInTolerance) return null;
	var update = false;
	if (this.matchNode === null || dist < this.matchDist || this.matchNode !== null && dist === this.matchDist && node.getCoordinate().compareTo(this.matchNode.getCoordinate()) < 1) update = true;
	if (update) {
		this.matchNode = node;
		this.matchDist = dist;
	}
};
BestMatchVisitor.prototype.queryEnvelope = function () {
	var queryEnv = new Envelope(this.p);
	queryEnv.expandBy(this.tolerance);
	return queryEnv;
};
BestMatchVisitor.prototype.getNode = function () {
	return this.matchNode;
};
KdTree.BestMatchVisitor = BestMatchVisitor;

