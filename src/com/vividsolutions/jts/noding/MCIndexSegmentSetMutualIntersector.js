import SegmentSetMutualIntersector from 'com/vividsolutions/jts/noding/SegmentSetMutualIntersector';
import SegmentOverlapAction from 'com/vividsolutions/jts/noding/SegmentOverlapAction';
import STRtree from 'com/vividsolutions/jts/index/strtree/STRtree';
import MonotoneChainBuilder from 'com/vividsolutions/jts/index/chain/MonotoneChainBuilder';
import ArrayList from 'java/util/ArrayList';
export default class MCIndexSegmentSetMutualIntersector {
	constructor(...args) {
		(() => {
			this.index = new STRtree();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [baseSegStrings] = args;
						this.initBaseSegments(baseSegStrings);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [SegmentSetMutualIntersector];
	}
	addToIndex(segStr) {
		var segChains = MonotoneChainBuilder.getChains(segStr.getCoordinates(), segStr);
		for (var i = segChains.iterator(); i.hasNext(); ) {
			var mc = i.next();
			this.index.insert(mc.getEnvelope(), mc);
		}
	}
	addToMonoChains(segStr, monoChains) {
		var segChains = MonotoneChainBuilder.getChains(segStr.getCoordinates(), segStr);
		for (var i = segChains.iterator(); i.hasNext(); ) {
			var mc = i.next();
			monoChains.add(mc);
		}
	}
	process(segStrings, segInt) {
		var monoChains = new ArrayList();
		for (var i = segStrings.iterator(); i.hasNext(); ) {
			this.addToMonoChains(i.next(), monoChains);
		}
		this.intersectChains(monoChains, segInt);
	}
	initBaseSegments(segStrings) {
		for (var i = segStrings.iterator(); i.hasNext(); ) {
			this.addToIndex(i.next());
		}
		this.index.build();
	}
	getIndex() {
		return this.index;
	}
	intersectChains(monoChains, segInt) {
		var overlapAction = new SegmentOverlapAction(segInt);
		for (var i = monoChains.iterator(); i.hasNext(); ) {
			var queryChain = i.next();
			var overlapChains = this.index.query(queryChain.getEnvelope());
			for (var j = overlapChains.iterator(); j.hasNext(); ) {
				var testChain = j.next();
				queryChain.computeOverlaps(testChain, overlapAction);
				if (segInt.isDone()) return null;
			}
		}
	}
	getClass() {
		return MCIndexSegmentSetMutualIntersector;
	}
}

