function DirectedEdgeStar() {
	this.outEdges = new ArrayList();
	this.sorted = false;
	if (arguments.length === 0) return;
}
module.exports = DirectedEdgeStar
var Collections = require('java/util/Collections');
var DirectedEdge = require('com/vividsolutions/jts/planargraph/DirectedEdge');
var ArrayList = require('java/util/ArrayList');
var Edge = require('com/vividsolutions/jts/planargraph/Edge');
DirectedEdgeStar.prototype.getNextEdge = function (dirEdge) {
	var i = this.getIndex(dirEdge);
	return this.outEdges.get(this.getIndex(i + 1));
};
DirectedEdgeStar.prototype.getCoordinate = function () {
	var it = this.iterator();
	if (!it.hasNext()) return null;
	var e = it.next();
	return e.getCoordinate();
};
DirectedEdgeStar.prototype.iterator = function () {
	this.sortEdges();
	return this.outEdges.iterator();
};
DirectedEdgeStar.prototype.sortEdges = function () {
	if (!this.sorted) {
		Collections.sort(this.outEdges);
		this.sorted = true;
	}
};
DirectedEdgeStar.prototype.remove = function (de) {
	this.outEdges.remove(de);
};
DirectedEdgeStar.prototype.getEdges = function () {
	this.sortEdges();
	return this.outEdges;
};
DirectedEdgeStar.prototype.getNextCWEdge = function (dirEdge) {
	var i = this.getIndex(dirEdge);
	return this.outEdges.get(this.getIndex(i - 1));
};
DirectedEdgeStar.prototype.getIndex = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Edge) {
				return ((...args) => {
					let [edge] = args;
					this.sortEdges();
					for (var i = 0; i < this.outEdges.size(); i++) {
						var de = this.outEdges.get(i);
						if (de.getEdge() === edge) return i;
					}
					return -1;
				})(...args);
			} else if (args[0] instanceof DirectedEdge) {
				return ((...args) => {
					let [dirEdge] = args;
					this.sortEdges();
					for (var i = 0; i < this.outEdges.size(); i++) {
						var de = this.outEdges.get(i);
						if (de === dirEdge) return i;
					}
					return -1;
				})(...args);
			} else if (Number.isInteger(args[0])) {
				return ((...args) => {
					let [i] = args;
					var modi = i % this.outEdges.size();
					if (modi < 0) modi += this.outEdges.size();
					return modi;
				})(...args);
			}
	}
};
DirectedEdgeStar.prototype.add = function (de) {
	this.outEdges.add(de);
	this.sorted = false;
};
DirectedEdgeStar.prototype.getDegree = function () {
	return this.outEdges.size();
};

