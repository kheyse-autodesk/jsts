function EdgeConnectedTriangleTraversal() {
	this.triQueue = new LinkedList();
	if (arguments.length === 0) return;
}
module.exports = EdgeConnectedTriangleTraversal
var Collection = require('java/util/Collection');
var QuadEdgeTriangle = require('com/vividsolutions/jts/triangulate/quadedge/QuadEdgeTriangle');
var LinkedList = require('java/util/LinkedList');
EdgeConnectedTriangleTraversal.prototype.init = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof QuadEdgeTriangle) {
				return ((...args) => {
					let [tri] = args;
					this.triQueue.addLast(tri);
				})(...args);
			} else if (args[0] instanceof Collection) {
				return ((...args) => {
					let [tris] = args;
					this.triQueue.addAll(tris);
				})(...args);
			}
	}
};
EdgeConnectedTriangleTraversal.prototype.process = function (currTri, visitor) {
	currTri.getNeighbours();
	for (var i = 0; i < 3; i++) {
		var neighTri = currTri.getEdge(i).sym().getData();
		if (neighTri === null) continue;
		if (visitor.visit(currTri, i, neighTri)) this.triQueue.addLast(neighTri);
	}
};
EdgeConnectedTriangleTraversal.prototype.visitAll = function (visitor) {
	while (!this.triQueue.isEmpty()) {
		var tri = this.triQueue.removeFirst();
		this.process(tri, visitor);
	}
};

