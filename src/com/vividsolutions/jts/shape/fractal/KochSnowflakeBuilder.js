import CoordinateList from '../../geom/CoordinateList';
import Coordinate from '../../geom/Coordinate';
import Vector2D from '../../math/Vector2D';
import GeometricShapeBuilder from '../GeometricShapeBuilder';
export default class KochSnowflakeBuilder extends GeometricShapeBuilder {
	constructor(...args) {
		super();
		(() => {
			this.coordList = new CoordinateList();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geomFactory] = args;
						super(geomFactory);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get HEIGHT_FACTOR() {
		return Math.sin(Math.PI / 3.0);
	}
	static get ONE_THIRD() {
		return 1.0 / 3.0;
	}
	static get THIRD_HEIGHT() {
		return KochSnowflakeBuilder.HEIGHT_FACTOR / 3.0;
	}
	static get TWO_THIRDS() {
		return 2.0 / 3.0;
	}
	static recursionLevelForSize(numPts) {
		var pow4 = Math.trunc(numPts / 3);
		var exp = Math.log(pow4) / Math.log(4);
		return Math.trunc(exp);
	}
	getBoundary(level, origin, width) {
		var y = origin.y;
		if (level > 0) {
			y += KochSnowflakeBuilder.THIRD_HEIGHT * width;
		}
		var p0 = new Coordinate(origin.x, y);
		var p1 = new Coordinate(origin.x + width / 2, y + width * KochSnowflakeBuilder.HEIGHT_FACTOR);
		var p2 = new Coordinate(origin.x + width, y);
		this.addSide(level, p0, p1);
		this.addSide(level, p1, p2);
		this.addSide(level, p2, p0);
		this.coordList.closeRing();
		return this.coordList.toCoordinateArray();
	}
	getGeometry() {
		var level = KochSnowflakeBuilder.recursionLevelForSize(this.numPts);
		var baseLine = this.getSquareBaseLine();
		var pts = this.getBoundary(level, baseLine.getCoordinate(0), baseLine.getLength());
		return this.geomFactory.createPolygon(this.geomFactory.createLinearRing(pts));
	}
	addSegment(p0, p1) {
		this.coordList.add(p1);
	}
	addSide(level, p0, p1) {
		if (level === 0) this.addSegment(p0, p1); else {
			var base = Vector2D.create(p0, p1);
			var midPt = base.multiply(0.5).translate(p0);
			var heightVec = base.multiply(KochSnowflakeBuilder.THIRD_HEIGHT);
			var offsetVec = heightVec.rotateByQuarterCircle(1);
			var offsetPt = offsetVec.translate(midPt);
			var n2 = level - 1;
			var thirdPt = base.multiply(KochSnowflakeBuilder.ONE_THIRD).translate(p0);
			var twoThirdPt = base.multiply(KochSnowflakeBuilder.TWO_THIRDS).translate(p0);
			this.addSide(n2, p0, thirdPt);
			this.addSide(n2, thirdPt, offsetPt);
			this.addSide(n2, offsetPt, twoThirdPt);
			this.addSide(n2, twoThirdPt, p1);
		}
	}
	getClass() {
		return KochSnowflakeBuilder;
	}
}

