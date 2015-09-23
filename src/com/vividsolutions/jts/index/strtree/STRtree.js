function STRtree(...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [nodeCapacity] = args;
				STRtree.super_.call(this, nodeCapacity);
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				STRtree.call(this, STRtree.DEFAULT_NODE_CAPACITY);
			})(...args);
	}
}
module.exports = STRtree
var AbstractSTRtree = require('com/vividsolutions/jts/index/strtree/AbstractSTRtree');
var util = require('util');
util.inherits(STRtree, AbstractSTRtree)
var ItemBoundable = require('com/vividsolutions/jts/index/strtree/ItemBoundable');
var PriorityQueue = require('com/vividsolutions/jts/util/PriorityQueue');
var AbstractNode = require('com/vividsolutions/jts/index/strtree/AbstractNode');
var Double = require('java/lang/Double');
var Collections = require('java/util/Collections');
var BoundablePair = require('com/vividsolutions/jts/index/strtree/BoundablePair');
var ArrayList = require('java/util/ArrayList');
var Comparator = require('java/util/Comparator');
var Envelope = require('com/vividsolutions/jts/geom/Envelope');
var Assert = require('com/vividsolutions/jts/util/Assert');
var ItemDistance = require('com/vividsolutions/jts/index/strtree/ItemDistance');
STRtree.prototype.createParentBoundablesFromVerticalSlices = function (verticalSlices, newLevel) {
	Assert.isTrue(verticalSlices.length > 0);
	var parentBoundables = new ArrayList();
	for (var i = 0; i < verticalSlices.length; i++) {
		parentBoundables.addAll(this.createParentBoundablesFromVerticalSlice(verticalSlices[i], newLevel));
	}
	return parentBoundables;
};
STRtree.prototype.createNode = function (level) {
	return new STRtreeNode(level);
};
STRtree.prototype.size = function () {
	return STRtree.super_.prototype.size.call(this);
};
STRtree.prototype.insert = function (itemEnv, item) {
	if (itemEnv.isNull()) {
		return null;
	}
	STRtree.super_.prototype.insert.call(this, itemEnv, item);
};
STRtree.prototype.getIntersectsOp = function () {
	return STRtree.intersectsOp;
};
STRtree.prototype.verticalSlices = function (childBoundables, sliceCount) {
	var sliceCapacity = Math.ceil(childBoundables.size() / sliceCount);
	var slices = [];
	var i = childBoundables.iterator();
	for (var j = 0; j < sliceCount; j++) {
		slices[j] = new ArrayList();
		var boundablesAddedToSlice = 0;
		while (i.hasNext() && boundablesAddedToSlice < sliceCapacity) {
			var childBoundable = i.next();
			slices[j].add(childBoundable);
			boundablesAddedToSlice++;
		}
	}
	return slices;
};
STRtree.prototype.query = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [searchEnv, visitor] = args;
				STRtree.super_.prototype.query.call(this, searchEnv, visitor);
			})(...args);
		case 1:
			return ((...args) => {
				let [searchEnv] = args;
				return STRtree.super_.prototype.query.call(this, searchEnv);
			})(...args);
	}
};
STRtree.prototype.getComparator = function () {
	return STRtree.yComparator;
};
STRtree.prototype.createParentBoundablesFromVerticalSlice = function (childBoundables, newLevel) {
	return STRtree.super_.prototype.createParentBoundables.call(this, childBoundables, newLevel);
};
STRtree.prototype.remove = function (itemEnv, item) {
	return STRtree.super_.prototype.remove.call(this, itemEnv, item);
};
STRtree.prototype.depth = function () {
	return STRtree.super_.prototype.depth.call(this);
};
STRtree.prototype.createParentBoundables = function (childBoundables, newLevel) {
	Assert.isTrue(!childBoundables.isEmpty());
	var minLeafCount = Math.ceil(childBoundables.size() / this.getNodeCapacity());
	var sortedChildBoundables = new ArrayList(childBoundables);
	Collections.sort(sortedChildBoundables, STRtree.xComparator);
	var verticalSlices = this.verticalSlices(sortedChildBoundables, Math.ceil(Math.sqrt(minLeafCount)));
	return this.createParentBoundablesFromVerticalSlices(verticalSlices, newLevel);
};
STRtree.prototype.nearestNeighbour = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof STRtree && args[1] instanceof ItemDistance) {
				return ((...args) => {
					let [tree, itemDist] = args;
					var bp = new BoundablePair(this.getRoot(), tree.getRoot(), itemDist);
					return this.nearestNeighbour(bp);
				})(...args);
			} else if (args[0] instanceof BoundablePair && !Number.isInteger(args[1])) {
				return ((...args) => {
					let [initBndPair, maxDistance] = args;
					var distanceLowerBound = maxDistance;
					var minPair = null;
					var priQ = new PriorityQueue();
					priQ.add(initBndPair);
					while (!priQ.isEmpty() && distanceLowerBound > 0.0) {
						var bndPair = priQ.poll();
						var currentDistance = bndPair.getDistance();
						if (currentDistance >= distanceLowerBound) break;
						if (bndPair.isLeaves()) {
							distanceLowerBound = currentDistance;
							minPair = bndPair;
						} else {
							bndPair.expandToQueue(priQ, distanceLowerBound);
						}
					}
					return [minPair.getBoundable(0).getItem(), minPair.getBoundable(1).getItem()];
				})(...args);
			}
		case 1:
			if (args[0] instanceof ItemDistance) {
				return ((...args) => {
					let [itemDist] = args;
					var bp = new BoundablePair(this.getRoot(), this.getRoot(), itemDist);
					return this.nearestNeighbour(bp);
				})(...args);
			} else if (args[0] instanceof BoundablePair) {
				return ((...args) => {
					let [initBndPair] = args;
					return this.nearestNeighbour(initBndPair, Double.POSITIVE_INFINITY);
				})(...args);
			}
		case 3:
			return ((...args) => {
				let [env, item, itemDist] = args;
				var bnd = new ItemBoundable(env, item);
				var bp = new BoundablePair(this.getRoot(), bnd, itemDist);
				return this.nearestNeighbour(bp)[0];
			})(...args);
	}
};
STRtree.centreX = function (e) {
	return STRtree.avg(e.getMinX(), e.getMaxX());
};
STRtree.avg = function (a, b) {
	return (a + b) / 2;
};
STRtree.centreY = function (e) {
	return STRtree.avg(e.getMinY(), e.getMaxY());
};
function STRtreeNode(level) {
	if (arguments.length === 0) return;
	STRtreeNode.super_.call(this, level);
}
util.inherits(STRtreeNode, AbstractNode)
STRtreeNode.prototype.computeBounds = function () {
	var bounds = null;
	for (var i = this.getChildBoundables().iterator(); i.hasNext(); ) {
		var childBoundable = i.next();
		if (bounds === null) {
			bounds = new Envelope(childBoundable.getBounds());
		} else {
			bounds.expandToInclude(childBoundable.getBounds());
		}
	}
	return bounds;
};
STRtree.STRtreeNode = STRtreeNode;
STRtree.serialVersionUID = 259274702368956900;
STRtree.xComparator = new Comparator();
STRtree.yComparator = new Comparator();
STRtree.intersectsOp = {};
STRtree.DEFAULT_NODE_CAPACITY = 10;

