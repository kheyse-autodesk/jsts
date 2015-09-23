function ItemBoundable(bounds, item) {
	this.bounds = null;
	this.item = null;
	if (arguments.length === 0) return;
	this.bounds = bounds;
	this.item = item;
}
module.exports = ItemBoundable
ItemBoundable.prototype.getItem = function () {
	return this.item;
};
ItemBoundable.prototype.getBounds = function () {
	return this.bounds;
};

