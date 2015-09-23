function SimpleSweepLineIntersector() {
	this.events = new ArrayList();
	this.nOverlaps = null;
	if (arguments.length === 0) return;
}
module.exports = SimpleSweepLineIntersector
var EdgeSetIntersector = require('com/vividsolutions/jts/geomgraph/index/EdgeSetIntersector');
var util = require('util');
util.inherits(SimpleSweepLineIntersector, EdgeSetIntersector)
var SweepLineSegment = require('com/vividsolutions/jts/geomgraph/index/SweepLineSegment');
var SweepLineEvent = require('com/vividsolutions/jts/geomgraph/index/SweepLineEvent');
var Collections = require('java/util/Collections');
var SegmentIntersector = require('com/vividsolutions/jts/geomgraph/index/SegmentIntersector');
var ArrayList = require('java/util/ArrayList');
var Edge = require('com/vividsolutions/jts/geomgraph/Edge');
var List = require('java/util/List');
SimpleSweepLineIntersector.prototype.processOverlaps = function (start, end, ev0, si) {
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
};
SimpleSweepLineIntersector.prototype.prepareEvents = function () {
	Collections.sort(this.events);
	for (var i = 0; i < this.events.size(); i++) {
		var ev = this.events.get(i);
		if (ev.isDelete()) {
			ev.getInsertEvent().setDeleteEventIndex(i);
		}
	}
};
SimpleSweepLineIntersector.prototype.computeIntersections = function (...args) {
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
			if (args[2] instanceof boolean && args[0] instanceof List && args[1] instanceof SegmentIntersector) {
				return ((...args) => {
					let [edges, si, testAllSegments] = args;
					if (testAllSegments) this.add(edges, null); else this.add(edges);
					this.computeIntersections(si);
				})(...args);
			} else if (args[2] instanceof SegmentIntersector && args[0] instanceof List && args[1] instanceof List) {
				return ((...args) => {
					let [edges0, edges1, si] = args;
					this.add(edges0, edges0);
					this.add(edges1, edges1);
					this.computeIntersections(si);
				})(...args);
			}
	}
};
SimpleSweepLineIntersector.prototype.add = function (...args) {
	switch (args.length) {
		case 2:
			if (args[0] instanceof List && args[1] instanceof Object) {
				return ((...args) => {
					let [edges, edgeSet] = args;
					for (var i = edges.iterator(); i.hasNext(); ) {
						var edge = i.next();
						this.add(edge, edgeSet);
					}
				})(...args);
			} else if (args[0] instanceof Edge && args[1] instanceof Object) {
				return ((...args) => {
					let [edge, edgeSet] = args;
					var pts = edge.getCoordinates();
					for (var i = 0; i < pts.length - 1; i++) {
						var ss = new SweepLineSegment(edge, i);
						var insertEvent = new SweepLineEvent(edgeSet, ss.getMinX(), null);
						this.events.add(insertEvent);
						this.events.add(new SweepLineEvent(ss.getMaxX(), insertEvent));
					}
				})(...args);
			}
		case 1:
			return ((...args) => {
				let [edges] = args;
				for (var i = edges.iterator(); i.hasNext(); ) {
					var edge = i.next();
					this.add(edge, edge);
				}
			})(...args);
	}
};

