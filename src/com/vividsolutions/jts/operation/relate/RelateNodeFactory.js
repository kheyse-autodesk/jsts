import EdgeEndBundleStar from 'com/vividsolutions/jts/operation/relate/EdgeEndBundleStar';
import RelateNode from 'com/vividsolutions/jts/operation/relate/RelateNode';
import NodeFactory from 'com/vividsolutions/jts/geomgraph/NodeFactory';
export default class RelateNodeFactory extends NodeFactory {
	get interfaces_() {
		return [];
	}
	createNode(coord) {
		return new RelateNode(coord, new EdgeEndBundleStar());
	}
}

