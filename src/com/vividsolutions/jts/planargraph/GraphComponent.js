function GraphComponent() {
	this.isMarked = false;
	this.isVisited = false;
	this.data = null;
	if (arguments.length === 0) return;
}
module.exports = GraphComponent
GraphComponent.prototype.setVisited = function (isVisited) {
	this.isVisited = isVisited;
};
GraphComponent.prototype.isMarked = function () {
	return this.isMarked;
};
GraphComponent.prototype.setData = function (data) {
	this.data = data;
};
GraphComponent.prototype.getData = function () {
	return this.data;
};
GraphComponent.prototype.setMarked = function (isMarked) {
	this.isMarked = isMarked;
};
GraphComponent.prototype.getContext = function () {
	return this.data;
};
GraphComponent.prototype.isVisited = function () {
	return this.isVisited;
};
GraphComponent.prototype.setContext = function (data) {
	this.data = data;
};
GraphComponent.getComponentWithVisitedState = function (i, visitedState) {
	while (i.hasNext()) {
		var comp = i.next();
		if (comp.isVisited() === visitedState) return comp;
	}
	return null;
};
GraphComponent.setVisited = function (i, visited) {
	while (i.hasNext()) {
		var comp = i.next();
		comp.setVisited(visited);
	}
};
GraphComponent.setMarked = function (i, marked) {
	while (i.hasNext()) {
		var comp = i.next();
		comp.setMarked(marked);
	}
};

