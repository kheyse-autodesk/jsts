function EdgeList() {
	this.edges = new ArrayList();
	this.ocaMap = new TreeMap();
	if (arguments.length === 0) return;
}
module.exports = EdgeList
var OrientedCoordinateArray = require('com/vividsolutions/jts/noding/OrientedCoordinateArray');
var ArrayList = require('java/util/ArrayList');
var TreeMap = require('java/util/TreeMap');
EdgeList.prototype.print = function (out) {
	out.print("MULTILINESTRING ( ");
	for (var j = 0; j < this.edges.size(); j++) {
		var e = this.edges.get(j);
		if (j > 0) out.print(",");
		out.print("(");
		var pts = e.getCoordinates();
		for (var i = 0; i < pts.length; i++) {
			if (i > 0) out.print(",");
			out.print(this.x + " " + this.y);
		}
		out.println(")");
	}
	out.print(")  ");
};
EdgeList.prototype.addAll = function (edgeColl) {
	for (var i = edgeColl.iterator(); i.hasNext(); ) {
		this.add(i.next());
	}
};
EdgeList.prototype.findEdgeIndex = function (e) {
	for (var i = 0; i < this.edges.size(); i++) {
		if (this.edges.get(i).equals(e)) return i;
	}
	return -1;
};
EdgeList.prototype.iterator = function () {
	return this.edges.iterator();
};
EdgeList.prototype.getEdges = function () {
	return this.edges;
};
EdgeList.prototype.get = function (i) {
	return this.edges.get(i);
};
EdgeList.prototype.findEqualEdge = function (e) {
	var oca = new OrientedCoordinateArray(e.getCoordinates());
	var matchEdge = this.ocaMap.get(oca);
	return matchEdge;
};
EdgeList.prototype.add = function (e) {
	this.edges.add(e);
	var oca = new OrientedCoordinateArray(e.getCoordinates());
	this.ocaMap.put(oca, e);
};

