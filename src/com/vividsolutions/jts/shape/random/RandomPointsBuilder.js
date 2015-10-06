import Location from 'com/vividsolutions/jts/geom/Location';
import GeometryFactory from 'com/vividsolutions/jts/geom/GeometryFactory';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import Polygonal from 'com/vividsolutions/jts/geom/Polygonal';
import IndexedPointInAreaLocator from 'com/vividsolutions/jts/algorithm/locate/IndexedPointInAreaLocator';
import GeometricShapeBuilder from 'com/vividsolutions/jts/shape/GeometricShapeBuilder';
export default class RandomPointsBuilder extends GeometricShapeBuilder {
	constructor(...args) {
		super();
		(() => {
			this.maskPoly = null;
			this.extentLocator = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						super(new GeometryFactory());
					})(...args);
				case 1:
					return ((...args) => {
						let [geomFact] = args;
						super(geomFact);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getGeometry() {
		var pts = [];
		var i = 0;
		while (i < this.numPts) {
			var p = this.createRandomCoord(this.getExtent());
			if (this.extentLocator !== null && !this.isInExtent(p)) continue;
			pts[i++] = p;
		}
		return this.geomFactory.createMultiPoint(pts);
	}
	createRandomCoord(env) {
		var x = env.getMinX() + env.getWidth() * Math.random();
		var y = env.getMinY() + env.getHeight() * Math.random();
		return this.createCoord(x, y);
	}
	isInExtent(p) {
		if (this.extentLocator !== null) return this.extentLocator.locate(p) !== Location.EXTERIOR;
		return this.getExtent().contains(p);
	}
	setExtent(mask) {
		if (!(mask instanceof Polygonal)) throw new IllegalArgumentException("Only polygonal extents are supported");
		this.maskPoly = mask;
		this.setExtent(mask.getEnvelopeInternal());
		this.extentLocator = new IndexedPointInAreaLocator(mask);
	}
	createCoord(x, y) {
		var pt = new Coordinate(x, y);
		this.geomFactory.getPrecisionModel().makePrecise(pt);
		return pt;
	}
}

