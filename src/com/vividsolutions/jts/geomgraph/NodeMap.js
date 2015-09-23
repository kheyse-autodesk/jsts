function NodeMap(nodeFact) {
	this.nodeMap = new TreeMap();
	this.nodeFact = null;
	if (arguments.length === 0) return;
	this.nodeFact = nodeFact;
}
module.exports = NodeMap
var Location = require('com/vividsolutions/jts/geom/Location');
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
var Node = require('com/vividsolutions/jts/geomgraph/Node');
var ArrayList = require('java/util/ArrayList');
var TreeMap = require('java/util/TreeMap');
NodeMap.prototype.find = function (coord) {
	return this.nodeMap.get(coord);
};
NodeMap.prototype.addNode = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof Coordinate) {
				return ((...args) => {
					let [coord] = args;
					var node = this.nodeMap.get(coord);
					if (node === null) {
						node = this.nodeFact.createNode(coord);
						this.nodeMap.put(coord, node);
					}
					return node;
				})(...args);
			} else if (args[0] instanceof Node) {
				return ((...args) => {
					let [n] = args;
					var node = this.nodeMap.get(n.getCoordinate());
					if (node === null) {
						this.nodeMap.put(n.getCoordinate(), n);
						return n;
					}
					node.mergeLabel(n);
					return node;
				})(...args);
			}
	}
};
NodeMap.prototype.print = function (out) {
	for (var it = this.iterator(); it.hasNext(); ) {
		var n = it.next();
		n.print(out);
	}
};
NodeMap.prototype.iterator = function () {
	return this.nodeMap.values().iterator();
};
NodeMap.prototype.values = function () {
	return this.nodeMap.values();
};
NodeMap.prototype.getBoundaryNodes = function (geomIndex) {
	var bdyNodes = new ArrayList();
	for (var i = this.iterator(); i.hasNext(); ) {
		var node = i.next();
		if (node.getLabel().getLocation(geomIndex) === Location.BOUNDARY) bdyNodes.add(node);
	}
	return bdyNodes;
};
NodeMap.prototype.add = function (e) {
	var p = e.getCoordinate();
	var n = this.addNode(p);
	n.add(e);
};

