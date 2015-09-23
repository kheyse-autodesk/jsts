function NodeBase() {
	this.items = new ArrayList();
	this.subnode = [];
	if (arguments.length === 0) return;
}
module.exports = NodeBase
var ArrayList = require('java/util/ArrayList');
NodeBase.prototype.hasChildren = function () {
	for (var i = 0; i < 4; i++) {
		if (this.subnode[i] !== null) return true;
	}
	return false;
};
NodeBase.prototype.isPrunable = function () {
	return !(this.hasChildren() || this.hasItems());
};
NodeBase.prototype.addAllItems = function (resultItems) {
	resultItems.addAll(this.items);
	for (var i = 0; i < 4; i++) {
		if (this.subnode[i] !== null) {
			this.subnode[i].addAllItems(resultItems);
		}
	}
	return resultItems;
};
NodeBase.prototype.getNodeCount = function () {
	var subSize = 0;
	for (var i = 0; i < 4; i++) {
		if (this.subnode[i] !== null) {
			subSize += this.subnode[i].size();
		}
	}
	return subSize + 1;
};
NodeBase.prototype.size = function () {
	var subSize = 0;
	for (var i = 0; i < 4; i++) {
		if (this.subnode[i] !== null) {
			subSize += this.subnode[i].size();
		}
	}
	return subSize + this.items.size();
};
NodeBase.prototype.addAllItemsFromOverlapping = function (searchEnv, resultItems) {
	if (!this.isSearchMatch(searchEnv)) return null;
	resultItems.addAll(this.items);
	for (var i = 0; i < 4; i++) {
		if (this.subnode[i] !== null) {
			this.subnode[i].addAllItemsFromOverlapping(searchEnv, resultItems);
		}
	}
};
NodeBase.prototype.visitItems = function (searchEnv, visitor) {
	for (var i = this.items.iterator(); i.hasNext(); ) {
		visitor.visitItem(i.next());
	}
};
NodeBase.prototype.hasItems = function () {
	return !this.items.isEmpty();
};
NodeBase.prototype.remove = function (itemEnv, item) {
	if (!this.isSearchMatch(itemEnv)) return false;
	var found = false;
	for (var i = 0; i < 4; i++) {
		if (this.subnode[i] !== null) {
			found = this.subnode[i].remove(itemEnv, item);
			if (found) {
				if (this.subnode[i].isPrunable()) this.subnode[i] = null;
				break;
			}
		}
	}
	if (found) return found;
	found = this.items.remove(item);
	return found;
};
NodeBase.prototype.visit = function (searchEnv, visitor) {
	if (!this.isSearchMatch(searchEnv)) return null;
	this.visitItems(searchEnv, visitor);
	for (var i = 0; i < 4; i++) {
		if (this.subnode[i] !== null) {
			this.subnode[i].visit(searchEnv, visitor);
		}
	}
};
NodeBase.prototype.getItems = function () {
	return this.items;
};
NodeBase.prototype.depth = function () {
	var maxSubDepth = 0;
	for (var i = 0; i < 4; i++) {
		if (this.subnode[i] !== null) {
			var sqd = this.subnode[i].depth();
			if (sqd > maxSubDepth) maxSubDepth = sqd;
		}
	}
	return maxSubDepth + 1;
};
NodeBase.prototype.isEmpty = function () {
	var isEmpty = true;
	if (!this.items.isEmpty()) isEmpty = false;
	for (var i = 0; i < 4; i++) {
		if (this.subnode[i] !== null) {
			if (!this.subnode[i].isEmpty()) isEmpty = false;
		}
	}
	return isEmpty;
};
NodeBase.prototype.add = function (item) {
	this.items.add(item);
};
NodeBase.getSubnodeIndex = function (env, centrex, centrey) {
	var subnodeIndex = -1;
	if (env.getMinX() >= centrex) {
		if (env.getMinY() >= centrey) subnodeIndex = 3;
		if (env.getMaxY() <= centrey) subnodeIndex = 1;
	}
	if (env.getMaxX() <= centrex) {
		if (env.getMinY() >= centrey) subnodeIndex = 2;
		if (env.getMaxY() <= centrey) subnodeIndex = 0;
	}
	return subnodeIndex;
};

