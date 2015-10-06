import GeometryTransformer from 'com/vividsolutions/jts/geom/util/GeometryTransformer';
import LineStringSnapper from 'com/vividsolutions/jts/operation/overlay/snap/LineStringSnapper';
export default class SnapTransformer extends GeometryTransformer {
	constructor(...args) {
		super();
		(() => {
			this.snapTolerance = null;
			this.snapPts = null;
			this.isSelfSnap = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [snapTolerance, snapPts] = args;
						this.snapTolerance = snapTolerance;
						this.snapPts = snapPts;
					})(...args);
				case 3:
					return ((...args) => {
						let [snapTolerance, snapPts, isSelfSnap] = args;
						this.snapTolerance = snapTolerance;
						this.snapPts = snapPts;
						this.isSelfSnap = isSelfSnap;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	snapLine(srcPts, snapPts) {
		var snapper = new LineStringSnapper(srcPts, this.snapTolerance);
		snapper.setAllowSnappingToSourceVertices(this.isSelfSnap);
		return snapper.snapTo(snapPts);
	}
	transformCoordinates(coords, parent) {
		var srcPts = coords.toCoordinateArray();
		var newPts = this.snapLine(srcPts, this.snapPts);
		return this.factory.getCoordinateSequenceFactory().create(newPts);
	}
	getClass() {
		return SnapTransformer;
	}
}

