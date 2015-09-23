function AbstractSTRtree(...args) {
	this.root = null;
	this.built = false;
	this.itemBoundables = new ArrayList();
	this.nodeCapacity = null;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [nodeCapacity] = args;
				Assert.isTrue(nodeCapacity > 1, "Node capacity must be greater than 1");
				this.nodeCapacity = nodeCapacity;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				AbstractSTRtree.call(this, AbstractSTRtree.DEFAULT_NODE_CAPACITY);
			})(...args);
	}
}
module.exports = AbstractSTRtree
var ItemBoundable = require('com/vividsolutions/jts/index/strtree/ItemBoundable');
var ItemVisitor = require('com/vividsolutions/jts/index/ItemVisitor');
var AbstractNode = require('com/vividsolutions/jts/index/strtree/AbstractNode');
var Collections = require('java/util/Collections');
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
var List = require('java/util/List');
AbstractSTRtree.prototype.getNodeCapacity = function () {
	return this.nodeCapacity;
};
AbstractSTRtree.prototype.lastNode = function (nodes) {
	return nodes.get(nodes.size() - 1);
};
AbstractSTRtree.prototype.size = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [node] = args;
				var size = 0;
				for (var i = node.getChildBoundables().iterator(); i.hasNext(); ) {
					var childBoundable = i.next();
					if (childBoundable instanceof AbstractNode) {
						size += this.size(childBoundable);
					} else if (childBoundable instanceof ItemBoundable) {
						size += 1;
					}
				}
				return size;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				if (this.isEmpty()) {
					return 0;
				}
				this.build();
				return this.size(this.root);
			})(...args);
	}
};
AbstractSTRtree.prototype.removeItem = function (node, item) {
	var childToRemove = null;
	for (var i = node.getChildBoundables().iterator(); i.hasNext(); ) {
		var childBoundable = i.next();
		if (childBoundable instanceof ItemBoundable) {
			if (childBoundable.getItem() === item) childToRemove = childBoundable;
		}
	}
	if (childToRemove !== null) {
		node.getChildBoundables().remove(childToRemove);
		return true;
	}
	return false;
};
AbstractSTRtree.prototype.itemsTree = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [node] = args;
				var valuesTreeForNode = new ArrayList();
				for (var i = node.getChildBoundables().iterator(); i.hasNext(); ) {
					var childBoundable = i.next();
					if (childBoundable instanceof AbstractNode) {
						var valuesTreeForChild = this.itemsTree(childBoundable);
						if (valuesTreeForChild !== null) valuesTreeForNode.add(valuesTreeForChild);
					} else if (childBoundable instanceof ItemBoundable) {
						valuesTreeForNode.add(childBoundable.getItem());
					} else {
						Assert.shouldNeverReachHere();
					}
				}
				if (valuesTreeForNode.size() <= 0) return null;
				return valuesTreeForNode;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				this.build();
				var valuesTree = this.itemsTree(this.root);
				if (valuesTree === null) return new ArrayList();
				return valuesTree;
			})(...args);
	}
};
AbstractSTRtree.prototype.insert = function (bounds, item) {
	Assert.isTrue(!this.built, "Cannot insert items into an STR packed R-tree after it has been built.");
	this.itemBoundables.add(new ItemBoundable(bounds, item));
};
AbstractSTRtree.prototype.boundablesAtLevel = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [level] = args;
				var boundables = new ArrayList();
				this.boundablesAtLevel(level, this.root, boundables);
				return boundables;
			})(...args);
		case 3:
			return ((...args) => {
				let [level, top, boundables] = args;
				Assert.isTrue(level > -2);
				if (top.getLevel() === level) {
					boundables.add(top);
					return null;
				}
				for (var i = top.getChildBoundables().iterator(); i.hasNext(); ) {
					var boundable = i.next();
					if (boundable instanceof AbstractNode) {
						this.boundablesAtLevel(level, boundable, boundables);
					} else {
						Assert.isTrue(boundable instanceof ItemBoundable);
						if (level === -1) {
							boundables.add(boundable);
						}
					}
				}
				return null;
			})(...args);
	}
};
AbstractSTRtree.prototype.query = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [searchBounds, visitor] = args;
				this.build();
				if (this.isEmpty()) {
					return null;
				}
				if (this.getIntersectsOp().intersects(this.root.getBounds(), searchBounds)) {
					this.query(searchBounds, this.root, visitor);
				}
			})(...args);
		case 1:
			return ((...args) => {
				let [searchBounds] = args;
				this.build();
				var matches = new ArrayList();
				if (this.isEmpty()) {
					return matches;
				}
				if (this.getIntersectsOp().intersects(this.root.getBounds(), searchBounds)) {
					this.query(searchBounds, this.root, matches);
				}
				return matches;
			})(...args);
		case 3:
			if (args[2] instanceof List && args[0] instanceof Object && args[1] instanceof AbstractNode) {
				return ((...args) => {
					let [searchBounds, node, matches] = args;
					var childBoundables = node.getChildBoundables();
					for (var i = 0; i < childBoundables.size(); i++) {
						var childBoundable = childBoundables.get(i);
						if (!this.getIntersectsOp().intersects(childBoundable.getBounds(), searchBounds)) {
							continue;
						}
						if (childBoundable instanceof AbstractNode) {
							this.query(searchBounds, childBoundable, matches);
						} else if (childBoundable instanceof ItemBoundable) {
							matches.add(childBoundable.getItem());
						} else {
							Assert.shouldNeverReachHere();
						}
					}
				})(...args);
			} else if (args[2] instanceof ItemVisitor && args[0] instanceof Object && args[1] instanceof AbstractNode) {
				return ((...args) => {
					let [searchBounds, node, visitor] = args;
					var childBoundables = node.getChildBoundables();
					for (var i = 0; i < childBoundables.size(); i++) {
						var childBoundable = childBoundables.get(i);
						if (!this.getIntersectsOp().intersects(childBoundable.getBounds(), searchBounds)) {
							continue;
						}
						if (childBoundable instanceof AbstractNode) {
							this.query(searchBounds, childBoundable, visitor);
						} else if (childBoundable instanceof ItemBoundable) {
							visitor.visitItem(childBoundable.getItem());
						} else {
							Assert.shouldNeverReachHere();
						}
					}
				})(...args);
			}
	}
};
AbstractSTRtree.prototype.build = function () {
	if (this.built) return null;
	this.root = this.itemBoundables.isEmpty() ? this.createNode(0) : this.createHigherLevels(this.itemBoundables, -1);
	this.itemBoundables = null;
	this.built = true;
};
AbstractSTRtree.prototype.getRoot = function () {
	this.build();
	return this.root;
};
AbstractSTRtree.prototype.remove = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [searchBounds, item] = args;
				this.build();
				if (this.getIntersectsOp().intersects(this.root.getBounds(), searchBounds)) {
					return this.remove(searchBounds, this.root, item);
				}
				return false;
			})(...args);
		case 3:
			return ((...args) => {
				let [searchBounds, node, item] = args;
				var found = this.removeItem(node, item);
				if (found) return true;
				var childToPrune = null;
				for (var i = node.getChildBoundables().iterator(); i.hasNext(); ) {
					var childBoundable = i.next();
					if (!this.getIntersectsOp().intersects(childBoundable.getBounds(), searchBounds)) {
						continue;
					}
					if (childBoundable instanceof AbstractNode) {
						found = this.remove(searchBounds, childBoundable, item);
						if (found) {
							childToPrune = childBoundable;
							break;
						}
					}
				}
				if (childToPrune !== null) {
					if (childToPrune.getChildBoundables().isEmpty()) {
						node.getChildBoundables().remove(childToPrune);
					}
				}
				return found;
			})(...args);
	}
};
AbstractSTRtree.prototype.createHigherLevels = function (boundablesOfALevel, level) {
	Assert.isTrue(!boundablesOfALevel.isEmpty());
	var parentBoundables = this.createParentBoundables(boundablesOfALevel, level + 1);
	if (parentBoundables.size() === 1) {
		return parentBoundables.get(0);
	}
	return this.createHigherLevels(parentBoundables, level + 1);
};
AbstractSTRtree.prototype.depth = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [node] = args;
				var maxChildDepth = 0;
				for (var i = node.getChildBoundables().iterator(); i.hasNext(); ) {
					var childBoundable = i.next();
					if (childBoundable instanceof AbstractNode) {
						var childDepth = this.depth(childBoundable);
						if (childDepth > maxChildDepth) maxChildDepth = childDepth;
					}
				}
				return maxChildDepth + 1;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
				if (this.isEmpty()) {
					return 0;
				}
				this.build();
				return this.depth(this.root);
			})(...args);
	}
};
AbstractSTRtree.prototype.createParentBoundables = function (childBoundables, newLevel) {
	Assert.isTrue(!childBoundables.isEmpty());
	var parentBoundables = new ArrayList();
	parentBoundables.add(this.createNode(newLevel));
	var sortedChildBoundables = new ArrayList(childBoundables);
	Collections.sort(sortedChildBoundables, this.getComparator());
	for (var i = sortedChildBoundables.iterator(); i.hasNext(); ) {
		var childBoundable = i.next();
		if (this.lastNode(parentBoundables).getChildBoundables().size() === this.getNodeCapacity()) {
			parentBoundables.add(this.createNode(newLevel));
		}
		this.lastNode(parentBoundables).addChildBoundable(childBoundable);
	}
	return parentBoundables;
};
AbstractSTRtree.prototype.isEmpty = function () {
	if (!this.built) return this.itemBoundables.isEmpty();
	return this.root.isEmpty();
};
AbstractSTRtree.compareDoubles = function (a, b) {
	return a > b ? 1 : a < b ? -1 : 0;
};
function IntersectsOp() {}
IntersectsOp.prototype.intersects = function (aBounds, bBounds) {};
AbstractSTRtree.IntersectsOp = IntersectsOp;
AbstractSTRtree.serialVersionUID = -3886435814360241337;
AbstractSTRtree.DEFAULT_NODE_CAPACITY = 10;

