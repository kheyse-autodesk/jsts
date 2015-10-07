import TreeSet from 'java/util/TreeSet';
import SnapTransformer from './SnapTransformer';
import Double from 'java/lang/Double';
import BufferOp from '../../buffer/BufferOp';
import PrecisionModel from '../../../geom/PrecisionModel';
import Polygonal from '../../../geom/Polygonal';
export default class GeometrySnapper {
	constructor(...args) {
		(() => {
			this.srcGeom = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [srcGeom] = args;
						this.srcGeom = srcGeom;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get SNAP_PRECISION_FACTOR() {
		return 1e-9;
	}
	static snap(g0, g1, snapTolerance) {
		var snapGeom = new Array(2);
		var snapper0 = new GeometrySnapper(g0);
		snapGeom[0] = snapper0.snapTo(g1, snapTolerance);
		var snapper1 = new GeometrySnapper(g1);
		snapGeom[1] = snapper1.snapTo(snapGeom[0], snapTolerance);
		return snapGeom;
	}
	static computeOverlaySnapTolerance(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [g] = args;
						var snapTolerance = GeometrySnapper.computeSizeBasedSnapTolerance(g);
						var pm = g.getPrecisionModel();
						if (pm.getType() === PrecisionModel.FIXED) {
							var fixedSnapTol = 1 / pm.getScale() * 2 / 1.415;
							if (fixedSnapTol > snapTolerance) snapTolerance = fixedSnapTol;
						}
						return snapTolerance;
					})(...args);
				case 2:
					return ((...args) => {
						let [g0, g1] = args;
						return Math.min(GeometrySnapper.computeOverlaySnapTolerance(g0), GeometrySnapper.computeOverlaySnapTolerance(g1));
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	static computeSizeBasedSnapTolerance(g) {
		var env = g.getEnvelopeInternal();
		var minDimension = Math.min(env.getHeight(), env.getWidth());
		var snapTol = minDimension * GeometrySnapper.SNAP_PRECISION_FACTOR;
		return snapTol;
	}
	static snapToSelf(geom, snapTolerance, cleanResult) {
		var snapper0 = new GeometrySnapper(geom);
		return snapper0.snapToSelf(snapTolerance, cleanResult);
	}
	snapTo(snapGeom, snapTolerance) {
		var snapPts = this.extractTargetCoordinates(snapGeom);
		var snapTrans = new SnapTransformer(snapTolerance, snapPts);
		return snapTrans.transform(this.srcGeom);
	}
	snapToSelf(snapTolerance, cleanResult) {
		var snapPts = this.extractTargetCoordinates(this.srcGeom);
		var snapTrans = new SnapTransformer(snapTolerance, snapPts, true);
		var snappedGeom = snapTrans.transform(this.srcGeom);
		var result = snappedGeom;
		if (cleanResult && result instanceof Polygonal) {
			result = BufferOp.bufferOp(snappedGeom, 0);
		}
		return result;
	}
	computeSnapTolerance(ringPts) {
		var minSegLen = this.computeMinimumSegmentLength(ringPts);
		var snapTol = minSegLen / 10;
		return snapTol;
	}
	extractTargetCoordinates(g) {
		var ptSet = new TreeSet();
		var pts = g.getCoordinates();
		for (var i = 0; i < pts.length; i++) {
			ptSet.add(pts[i]);
		}
		return ptSet.toArray(new Array(0));
	}
	computeMinimumSegmentLength(pts) {
		var minSegLen = Double.MAX_VALUE;
		for (var i = 0; i < pts.length - 1; i++) {
			var segLen = pts[i].distance(pts[i + 1]);
			if (segLen < minSegLen) minSegLen = segLen;
		}
		return minSegLen;
	}
	getClass() {
		return GeometrySnapper;
	}
}

