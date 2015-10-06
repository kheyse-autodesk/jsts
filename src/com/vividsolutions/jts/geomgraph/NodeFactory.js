import Node from 'com/vividsolutions/jts/geomgraph/Node';
export default class NodeFactory {
	get interfaces_() {
		return [];
	}
	createNode(coord) {
		return new Node(coord, null);
	}
	getClass() {
		return NodeFactory;
	}
}

