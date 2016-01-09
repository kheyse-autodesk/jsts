import CGAlgorithms from '../algorithm/CGAlgorithms';
import CoordinateList from '../geom/CoordinateList';
import GeometryFactory from '../geom/GeometryFactory';
import Coordinate from '../geom/Coordinate';
import AffineTransform from 'java/awt/geom/AffineTransform';
import ArrayList from 'java/util/ArrayList';
import PathIterator from 'java/awt/geom/PathIterator';
export default class ShapeReader {
	constructor(...args) {
		(() => {
			this.geometryFactory = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geometryFactory] = args;
						this.geometryFactory = geometryFactory;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get INVERT_Y() {
		return AffineTransform.getScaleInstance(1, -1);
	}
	static toCoordinates(pathIt) {
		var coordArrays = new ArrayList();
		while (!pathIt.isDone()) {
			var pts = ShapeReader.nextCoordinateArray(pathIt);
			if (pts === null) break;
			coordArrays.add(pts);
		}
		return coordArrays;
	}
	static read(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [pathIt, geomFact] = args;
						var pc = new ShapeReader(geomFact);
						return pc.read(pathIt);
					})(...args);
				case 3:
					return ((...args) => {
						let [shp, flatness, geomFact] = args;
						var pathIt = shp.getPathIterator(ShapeReader.INVERT_Y, flatness);
						return ShapeReader.read(pathIt, geomFact);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	static nextCoordinateArray(pathIt) {
		var pathPt = new Array(6);
		var coordList = null;
		var isDone = false;
		while (!pathIt.isDone()) {
			var segType = pathIt.currentSegment(pathPt);
			switch (segType) {
				case PathIterator.SEG_MOVETO:
					if (coordList !== null) {
						isDone = true;
					} else {
						coordList = new CoordinateList();
						coordList.add(new Coordinate(pathPt[0], pathPt[1]));
						pathIt.next();
					}
					break;
				case PathIterator.SEG_LINETO:
					coordList.add(new Coordinate(pathPt[0], pathPt[1]));
					pathIt.next();
					break;
				case PathIterator.SEG_CLOSE:
					coordList.closeRing();
					pathIt.next();
					isDone = true;
					break;
				default:
					throw new IllegalArgumentException("unhandled (non-linear) segment type encountered");
			}
			if (isDone) break;
		}
		return coordList.toCoordinateArray();
	}
	isHole(pts) {
		return CGAlgorithms.isCCW(pts);
	}
	read(pathIt) {
		var pathPtSeq = ShapeReader.toCoordinates(pathIt);
		var polys = new ArrayList();
		var seqIndex = 0;
		while (seqIndex < pathPtSeq.size()) {
			var pts = pathPtSeq.get(seqIndex);
			var shell = this.geometryFactory.createLinearRing(pts);
			seqIndex++;
			var holes = new ArrayList();
			while (seqIndex < pathPtSeq.size() && this.isHole(pathPtSeq.get(seqIndex))) {
				var holePts = pathPtSeq.get(seqIndex);
				var hole = this.geometryFactory.createLinearRing(holePts);
				holes.add(hole);
				seqIndex++;
			}
			var holeArray = GeometryFactory.toLinearRingArray(holes);
			polys.add(this.geometryFactory.createPolygon(shell, holeArray));
		}
		return this.geometryFactory.buildGeometry(polys);
	}
	getClass() {
		return ShapeReader;
	}
}

