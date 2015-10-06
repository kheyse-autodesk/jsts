import ItemVisitor from 'com/vividsolutions/jts/index/ItemVisitor';
import PointOnGeometryLocator from 'com/vividsolutions/jts/algorithm/locate/PointOnGeometryLocator';
import SortedPackedIntervalRTree from 'com/vividsolutions/jts/index/intervalrtree/SortedPackedIntervalRTree';
import LineSegment from 'com/vividsolutions/jts/geom/LineSegment';
import Polygonal from 'com/vividsolutions/jts/geom/Polygonal';
import LinearComponentExtracter from 'com/vividsolutions/jts/geom/util/LinearComponentExtracter';
import ArrayListVisitor from 'com/vividsolutions/jts/index/ArrayListVisitor';
import RayCrossingCounter from 'com/vividsolutions/jts/algorithm/RayCrossingCounter';
export default class IndexedPointInAreaLocator {
	constructor(...args) {
		(() => {
			this.index = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [g] = args;
						if (!(g instanceof Polygonal)) throw new IllegalArgumentException("Argument must be Polygonal");
						this.index = new IntervalIndexedGeometry(g);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [PointOnGeometryLocator];
	}
	static get SegmentVisitor() {
		return SegmentVisitor;
	}
	static get IntervalIndexedGeometry() {
		return IntervalIndexedGeometry;
	}
	locate(p) {
		var rcc = new RayCrossingCounter(p);
		var visitor = new SegmentVisitor(rcc);
		this.index.query(p.y, p.y, visitor);
		return rcc.getLocation();
	}
}
class SegmentVisitor {
	constructor(...args) {
		(() => {
			this.counter = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [counter] = args;
						this.counter = counter;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [ItemVisitor];
	}
	visitItem(item) {
		var seg = item;
		this.counter.countSegment(seg.getCoordinate(0), seg.getCoordinate(1));
	}
}
class IntervalIndexedGeometry {
	constructor(...args) {
		(() => {
			this.index = new SortedPackedIntervalRTree();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geom] = args;
						this.init(geom);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	init(geom) {
		var lines = LinearComponentExtracter.getLines(geom);
		for (var i = lines.iterator(); i.hasNext(); ) {
			var line = i.next();
			var pts = line.getCoordinates();
			this.addLine(pts);
		}
	}
	addLine(pts) {
		for (var i = 1; i < pts.length; i++) {
			var seg = new LineSegment(pts[i - 1], pts[i]);
			var min = Math.min(seg.p0.y, seg.p1.y);
			var max = Math.max(seg.p0.y, seg.p1.y);
			this.index.insert(min, max, seg);
		}
	}
	query(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [min, max] = args;
						var visitor = new ArrayListVisitor();
						this.index.query(min, max, visitor);
						return visitor.getItems();
					})(...args);
				case 3:
					return ((...args) => {
						let [min, max, visitor] = args;
						this.index.query(min, max, visitor);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
}

