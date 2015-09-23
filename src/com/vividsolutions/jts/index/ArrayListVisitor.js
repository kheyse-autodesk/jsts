function ArrayListVisitor() {
	this.items = new ArrayList();
	if (arguments.length === 0) return;
}
module.exports = ArrayListVisitor
var ArrayList = require('java/util/ArrayList');
ArrayListVisitor.prototype.visitItem = function (item) {
	this.items.add(item);
};
ArrayListVisitor.prototype.getItems = function () {
	return this.items;
};

