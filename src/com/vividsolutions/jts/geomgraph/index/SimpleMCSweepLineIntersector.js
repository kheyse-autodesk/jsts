import MonotoneChain from './MonotoneChain';
import SweepLineEvent from './SweepLineEvent';
import EdgeSetIntersector from './EdgeSetIntersector';
import Collections from 'java/util/Collections';
import SegmentIntersector from './SegmentIntersector';
import ArrayList from 'java/util/ArrayList';
import List from 'java/util/List';
export default class SimpleMCSweepLineIntersector extends EdgeSetIntersector {
	constructor(...args) {
		super();
		(() => {
			this.events = new ArrayList();
			this.nOverlaps = null;
		})();
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
	addEdgeWithEdgeSet(edge, edgeSet) {
		var mce = edge.getMonotoneChainEdge();
		var startIndex = mce.getStartIndexes();
		for (var i = 0; i < startIndex.length - 1; i++) {
			var mc = new MonotoneChain(mce, i);
			var insertEvent = SweepLineEvent.createInsertWithLabelAndObject(mce.getMinX(i), edgeSet, mc);
			this.events.add(insertEvent);
			this.events.add(SweepLineEvent.createDelete(mce.getMaxX(i), insertEvent));
		}
	}
	prepareEvents() {
		Collections.sort(this.events);
		for (var i = 0; i < this.events.size(); i++) {
			var ev = this.events.get(i);
			if (ev.isDelete()) {
				ev.getInsertEvent().setDeleteEventIndex(i);
			}
		}
	}
	computeIntersections(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [si] = args;
						this.nOverlaps = 0;
						this.prepareEvents();
						for (var i = 0; i < this.events.size(); i++) {
							var ev = this.events.get(i);
							if (ev.isInsert()) {
								this.processOverlaps(i, ev.getDeleteEventIndex(), ev, si);
							}
						}
					})(...args);
				case 3:
					if (typeof args[2] === "boolean" && args[0].interfaces_ && args[0].interfaces_.indexOf(List) > -1 && args[1] instanceof SegmentIntersector) {
						return ((...args) => {
							let [edges, si, testAllSegments] = args;
							this.addEdges(edges, testAllSegments);
							this.computeIntersections(si);
						})(...args);
					} else if (args[2] instanceof SegmentIntersector && args[0].interfaces_ && args[0].interfaces_.indexOf(List) > -1 && args[1].interfaces_ && args[1].interfaces_.indexOf(List) > -1) {
						return ((...args) => {
							let [edges0, edges1, si] = args;
							this.addEdgesWithEdgeSet(edges0, edges0);
							this.addEdgesWithEdgeSet(edges1, edges1);
							this.computeIntersections(si);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	addEdgesWithEdgeSet(edges, edgeSet) {
		for (var i = edges.iterator(); i.hasNext(); ) {
			var edge = i.next();
			this.addEdgeWithEdgeSet(edge, edgeSet);
		}
	}
	addEdge(edge) {
		var mce = edge.getMonotoneChainEdge();
		var startIndex = mce.getStartIndexes();
		for (var i = 0; i < startIndex.length - 1; i++) {
			var mc = new MonotoneChain(mce, i);
			var insertEvent = SweepLineEvent.createInsertWithLabel(mce.getMinX(i), mc);
			this.events.add(insertEvent);
			this.events.add(SweepLineEvent.createDelete(mce.getMaxX(i), insertEvent));
		}
	}
	processOverlaps(start, end, ev0, si) {
		var mc0 = ev0.getObject();
		for (var i = start; i < end; i++) {
			var ev1 = this.events.get(i);
			if (ev1.isInsert()) {
				var mc1 = ev1.getObject();
				if (!ev0.isSameLabel(ev1)) {
					mc0.computeIntersections(mc1, si);
					this.nOverlaps++;
				}
			}
		}
	}
	addEdges(edges, testAllSegments) {
		for (var i = edges.iterator(); i.hasNext(); ) {
			var edge = i.next();
			if (testAllSegments) {
				this.addEdge(edge);
			} else {
				this.addEdgeWithEdgeSet(edge, edge);
			}
		}
	}
	getClass() {
		return SimpleMCSweepLineIntersector;
	}
}

