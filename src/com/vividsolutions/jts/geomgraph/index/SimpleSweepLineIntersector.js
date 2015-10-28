import SweepLineSegment from './SweepLineSegment';
import SweepLineEvent from './SweepLineEvent';
import EdgeSetIntersector from './EdgeSetIntersector';
import Collections from 'java/util/Collections';
import SegmentIntersector from './SegmentIntersector';
import ArrayList from 'java/util/ArrayList';
import Edge from '../Edge';
import List from 'java/util/List';
export default class SimpleSweepLineIntersector extends EdgeSetIntersector {
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
	processOverlaps(start, end, ev0, si) {
		var ss0 = ev0.getObject();
		for (var i = start; i < end; i++) {
			var ev1 = this.events.get(i);
			if (ev1.isInsert()) {
				var ss1 = ev1.getObject();
				if (!ev0.isSameLabel(ev1)) {
					ss0.computeIntersections(ss1, si);
					this.nOverlaps++;
				}
			}
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
							this.add(edges, testAllSegments);
							this.computeIntersections(si);
						})(...args);
					} else if (args[2] instanceof SegmentIntersector && args[0].interfaces_ && args[0].interfaces_.indexOf(List) > -1 && args[1].interfaces_ && args[1].interfaces_.indexOf(List) > -1) {
						return ((...args) => {
							let [edges0, edges1, si] = args;
							this.add(edges0, edges0);
							this.add(edges1, edges1);
							this.computeIntersections(si);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	add(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Edge) {
						return ((...args) => {
							let [edge] = args;
							var pts = edge.getCoordinates();
							for (var i = 0; i < pts.length - 1; i++) {
								var ss = new SweepLineSegment(edge, i);
								var insertEvent = SweepLineEvent.createInsert(ss.getMinX());
								this.events.add(insertEvent);
								this.events.add(SweepLineEvent.createDelete(ss.getMaxX(), insertEvent));
							}
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(List) > -1) {
						return ((...args) => {
							let [edges] = args;
							for (var i = edges.iterator(); i.hasNext(); ) {
								var edge = i.next();
								this.add(edge);
							}
						})(...args);
					}
				case 2:
					if (args[0] instanceof Edge && args[1] instanceof Object) {
						return ((...args) => {
							let [edge, edgeSet] = args;
							var pts = edge.getCoordinates();
							for (var i = 0; i < pts.length - 1; i++) {
								var ss = new SweepLineSegment(edge, i);
								var insertEvent = SweepLineEvent.createInsertWithLabel(ss.getMinX(), edgeSet);
								this.events.add(insertEvent);
								this.events.add(SweepLineEvent.createDelete(ss.getMaxX(), insertEvent));
							}
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(List) > -1 && typeof args[1] === "boolean") {
						return ((...args) => {
							let [edges, testAllSegments] = args;
							for (var i = edges.iterator(); i.hasNext(); ) {
								var edge = i.next();
								if (testAllSegments) {
									this.add(edge);
								} else {
									this.add(edge, edge);
								}
							}
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(List) > -1 && args[1] instanceof Object) {
						return ((...args) => {
							let [edges, edgeSet] = args;
							for (var i = edges.iterator(); i.hasNext(); ) {
								var edge = i.next();
								this.add(edge, edgeSet);
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return SimpleSweepLineIntersector;
	}
}

