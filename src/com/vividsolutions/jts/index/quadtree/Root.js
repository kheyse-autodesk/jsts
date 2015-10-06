import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import NodeBase from 'com/vividsolutions/jts/index/quadtree/NodeBase';
import Node from 'com/vividsolutions/jts/index/quadtree/Node';
import IntervalSize from 'com/vividsolutions/jts/index/quadtree/IntervalSize';
import Assert from 'com/vividsolutions/jts/util/Assert';
export default class Root extends NodeBase {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get origin() {
		return new Coordinate(0.0, 0.0);
	}
	insert(itemEnv, item) {
		var index = Root.getSubnodeIndex(itemEnv, Root.origin.x, Root.origin.y);
		if (index === -1) {
			this.add(item);
			return null;
		}
		var node = this.subnode[index];
		if (node === null || !node.getEnvelope().contains(itemEnv)) {
			var largerNode = Node.createExpanded(node, itemEnv);
			this.subnode[index] = largerNode;
		}
		this.insertContained(this.subnode[index], itemEnv, item);
	}
	isSearchMatch(searchEnv) {
		return true;
	}
	insertContained(tree, itemEnv, item) {
		Assert.isTrue(tree.getEnvelope().contains(itemEnv));
		var isZeroX = IntervalSize.isZeroWidth(itemEnv.getMinX(), itemEnv.getMaxX());
		var isZeroY = IntervalSize.isZeroWidth(itemEnv.getMinY(), itemEnv.getMaxY());
		var node = null;
		if (isZeroX || isZeroY) node = tree.find(itemEnv); else node = tree.getNode(itemEnv);
		node.add(item);
	}
	getClass() {
		return Root;
	}
}

