import CoordinateList from '../geom/CoordinateList';
import LineSegment from '../geom/LineSegment';
export default class Densifier {
	constructor(...args) {
		(() => {
			this.inputGeom = null;
			this.distanceTolerance = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [inputGeom] = args;
						this.inputGeom = inputGeom;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static densifyPoints(pts, distanceTolerance, precModel) {
		var seg = new LineSegment();
		var coordList = new CoordinateList();
		for (var i = 0; i < pts.length - 1; i++) {
			seg.p0 = pts[i];
			seg.p1 = pts[i + 1];
			coordList.add(seg.p0, false);
			var len = seg.getLength();
			var densifiedSegCount = len / distanceTolerance + 1;
			if (densifiedSegCount > 1) {
				var densifiedSegLen = len / densifiedSegCount;
				for (var j = 1; j < densifiedSegCount; j++) {
					var segFract = j * densifiedSegLen / len;
					var p = seg.pointAlong(segFract);
					precModel.makePrecise(p);
					coordList.add(p, false);
				}
			}
		}
		coordList.add(pts[pts.length - 1], false);
		return coordList.toCoordinateArray();
	}
	static densify(geom, distanceTolerance) {
		var densifier = new Densifier(geom);
		densifier.setDistanceTolerance(distanceTolerance);
		return densifier.getResultGeometry();
	}
	getResultGeometry() {
		return new DensifyTransformer().transform(this.inputGeom);
	}
	setDistanceTolerance(distanceTolerance) {
		if (distanceTolerance <= 0.0) throw new IllegalArgumentException("Tolerance must be positive");
		this.distanceTolerance = distanceTolerance;
	}
	getClass() {
		return Densifier;
	}
}

