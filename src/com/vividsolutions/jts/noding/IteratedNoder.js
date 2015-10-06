import Noder from 'com/vividsolutions/jts/noding/Noder';
import MCIndexNoder from 'com/vividsolutions/jts/noding/MCIndexNoder';
import TopologyException from 'com/vividsolutions/jts/geom/TopologyException';
import RobustLineIntersector from 'com/vividsolutions/jts/algorithm/RobustLineIntersector';
import IntersectionAdder from 'com/vividsolutions/jts/noding/IntersectionAdder';
export default class IteratedNoder {
	constructor(...args) {
		(() => {
			this.pm = null;
			this.li = null;
			this.nodedSegStrings = null;
			this.maxIter = IteratedNoder.MAX_ITER;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [pm] = args;
						this.li = new RobustLineIntersector();
						this.pm = pm;
						this.li.setPrecisionModel(pm);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Noder];
	}
	static get MAX_ITER() {
		return 5;
	}
	setMaximumIterations(maxIter) {
		this.maxIter = maxIter;
	}
	node(segStrings, numInteriorIntersections) {
		var si = new IntersectionAdder(this.li);
		var noder = new MCIndexNoder();
		noder.setSegmentIntersector(si);
		noder.computeNodes(segStrings);
		this.nodedSegStrings = noder.getNodedSubstrings();
		numInteriorIntersections[0] = si.numInteriorIntersections;
	}
	computeNodes(segStrings) {
		var numInteriorIntersections = [];
		this.nodedSegStrings = segStrings;
		var nodingIterationCount = 0;
		var lastNodesCreated = -1;
		do {
			this.node(this.nodedSegStrings, numInteriorIntersections);
			nodingIterationCount++;
			var nodesCreated = numInteriorIntersections[0];
			if (lastNodesCreated > 0 && nodesCreated >= lastNodesCreated && nodingIterationCount > this.maxIter) {
				throw new TopologyException("Iterated noding failed to converge after " + nodingIterationCount + " iterations");
			}
			lastNodesCreated = nodesCreated;
		} while (lastNodesCreated > 0);
	}
	getNodedSubstrings() {
		return this.nodedSegStrings;
	}
}

