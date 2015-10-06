import DirectedEdgeStar from 'com/vividsolutions/jts/geomgraph/DirectedEdgeStar';
import Node from 'com/vividsolutions/jts/geomgraph/Node';
import NodeFactory from 'com/vividsolutions/jts/geomgraph/NodeFactory';
export default class OverlayNodeFactory extends NodeFactory {
	get interfaces_() {
		return [];
	}
	createNode(coord) {
		return new Node(coord, new DirectedEdgeStar());
	}
}

