function EdgeEndBuilder() {
	if (arguments.length === 0) return;
}
module.exports = EdgeEndBuilder
var EdgeEnd = require('com/vividsolutions/jts/geomgraph/EdgeEnd');
var Label = require('com/vividsolutions/jts/geomgraph/Label');
var ArrayList = require('java/util/ArrayList');
EdgeEndBuilder.prototype.createEdgeEndForNext = function (edge, l, eiCurr, eiNext) {
	var iNext = eiCurr.segmentIndex + 1;
	if (iNext >= edge.getNumPoints() && eiNext === null) return null;
	var pNext = edge.getCoordinate(iNext);
	if (eiNext !== null && eiNext.segmentIndex === eiCurr.segmentIndex) pNext = eiNext.coord;
	var e = new EdgeEnd(edge, eiCurr.coord, pNext, new Label(edge.getLabel()));
	l.add(e);
};
EdgeEndBuilder.prototype.createEdgeEndForPrev = function (edge, l, eiCurr, eiPrev) {
	var iPrev = eiCurr.segmentIndex;
	if (eiCurr.dist === 0.0) {
		if (iPrev === 0) return null;
		iPrev--;
	}
	var pPrev = edge.getCoordinate(iPrev);
	if (eiPrev !== null && eiPrev.segmentIndex >= iPrev) pPrev = eiPrev.coord;
	var label = new Label(edge.getLabel());
	label.flip();
	var e = new EdgeEnd(edge, eiCurr.coord, pPrev, label);
	l.add(e);
};
EdgeEndBuilder.prototype.computeEdgeEnds = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [edge, l] = args;
				var eiList = edge.getEdgeIntersectionList();
				eiList.addEndpoints();
				var it = eiList.iterator();
				var eiPrev = null;
				var eiCurr = null;
				if (!it.hasNext()) return null;
				var eiNext = it.next();
				do {
					eiPrev = eiCurr;
					eiCurr = eiNext;
					eiNext = null;
					if (it.hasNext()) eiNext = it.next();
					if (eiCurr !== null) {
						this.createEdgeEndForPrev(edge, l, eiCurr, eiPrev);
						this.createEdgeEndForNext(edge, l, eiCurr, eiNext);
					}
				} while (eiCurr !== null);
			})(...args);
		case 1:
			return ((...args) => {
				let [edges] = args;
				var l = new ArrayList();
				for (var i = edges; i.hasNext(); ) {
					var e = i.next();
					this.computeEdgeEnds(e, l);
				}
				return l;
			})(...args);
	}
};

