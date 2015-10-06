import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import ConstraintSplitPointFinder from 'com/vividsolutions/jts/triangulate/ConstraintSplitPointFinder';
export default class MidpointSplitPointFinder {
	get interfaces_() {
		return [ConstraintSplitPointFinder];
	}
	findSplitPoint(seg, encroachPt) {
		var p0 = seg.getStart();
		var p1 = seg.getEnd();
		return new Coordinate((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
	}
}

