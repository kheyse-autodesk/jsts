function NodeBase() {
	this.items = new ArrayList();
	this.subnode = [];
	if (arguments.length === 0) return;
}
module.exports = NodeBase
var ArrayList = require('java/util/ArrayList');
NodeBase.prototype.hasChildren = function () {
	for (var i = 0; i < 2; i++) {
		if (this.subnode[i] !== null) return true;
	}
	return false;
};
NodeBase.prototype.isPrunable = function () {
	return !(this.hasChildren() || this.hasItems());
};
NodeBase.prototype.addAllItems = function (items) {
	items.addAll(this.items);
	for (var i = 0; i < 2; i++) {
		if (this.subnode[i] !== null) {
			this.subnode[i].addAllItems(items);
		}
	}
	return items;
};
NodeBase.prototype.size = function () {
	var subSize = 0;
	for (var i = 0; i < 2; i++) {
		if (this.subnode[i] !== null) {
			subSize += this.subnode[i].size();
		}
	}
	return subSize + this.items.size();
};
NodeBase.prototype.addAllItemsFromOverlapping = function (interval, resultItems) {
	if (interval !== null && !this.isSearchMatch(interval)) return null;
	resultItems.addAll(this.items);
	if (this.subnode[0] !== null) this.subnode[0].addAllItemsFromOverlapping(interval, resultItems);
	if (this.subnode[1] !== null) this.subnode[1].addAllItemsFromOverlapping(interval, resultItems);
};
NodeBase.prototype.hasItems = function () {
	return !this.items.isEmpty();
};
NodeBase.prototype.remove = function (itemInterval, item) {
	if (!this.isSearchMatch(itemInterval)) return false;
	var found = false;
	for (var i = 0; i < 2; i++) {
		if (this.subnode[i] !== null) {
			found = this.subnode[i].remove(itemInterval, item);
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
NodeBase.prototype.getItems = function () {
	return this.items;
};
NodeBase.prototype.depth = function () {
	var maxSubDepth = 0;
	for (var i = 0; i < 2; i++) {
		if (this.subnode[i] !== null) {
			var sqd = this.subnode[i].depth();
			if (sqd > maxSubDepth) maxSubDepth = sqd;
		}
	}
	return maxSubDepth + 1;
};
NodeBase.prototype.nodeSize = function () {
	var subSize = 0;
	for (var i = 0; i < 2; i++) {
		if (this.subnode[i] !== null) {
			subSize += this.subnode[i].nodeSize();
		}
	}
	return subSize + 1;
};
NodeBase.prototype.add = function (item) {
	this.items.add(item);
};
NodeBase.getSubnodeIndex = function (interval, centre) {
	var subnodeIndex = -1;
	if (interval.min >= centre) subnodeIndex = 1;
	if (interval.max <= centre) subnodeIndex = 0;
	return subnodeIndex;
};

