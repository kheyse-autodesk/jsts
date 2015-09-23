function AbstractNode(...args) {
	this.childBoundables = new ArrayList();
	this.bounds = null;
	this.level = null;
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [level] = args;
				this.level = level;
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = AbstractNode
var ArrayList = require('java/util/ArrayList');
var Assert = require('com/vividsolutions/jts/util/Assert');
AbstractNode.prototype.getLevel = function () {
	return this.level;
};
AbstractNode.prototype.size = function () {
	return this.childBoundables.size();
};
AbstractNode.prototype.getChildBoundables = function () {
	return this.childBoundables;
};
AbstractNode.prototype.addChildBoundable = function (childBoundable) {
	Assert.isTrue(this.bounds === null);
	this.childBoundables.add(childBoundable);
};
AbstractNode.prototype.isEmpty = function () {
	return this.childBoundables.isEmpty();
};
AbstractNode.prototype.getBounds = function () {
	if (this.bounds === null) {
		this.bounds = this.computeBounds();
	}
	return this.bounds;
};
AbstractNode.serialVersionUID = 6493722185909573708;

