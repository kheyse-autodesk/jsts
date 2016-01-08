import CoordinateList from '../../geom/CoordinateList';
import GeometryFactory from '../../geom/GeometryFactory';
import Coordinate from '../../geom/Coordinate';
import ArrayList from 'java/util/ArrayList';
import GeometricShapeBuilder from '../GeometricShapeBuilder';
export default class SierpinskiCarpetBuilder extends GeometricShapeBuilder {
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
	static recursionLevelForSize(numPts) {
		var pow4 = Math.trunc(numPts / 3);
		var exp = Math.log(pow4) / Math.log(4);
		return Math.trunc(exp);
	}
	addHoles(n, originX, originY, width, holeList) {
		if (n < 0) return null;
		var n2 = n - 1;
		var widthThird = width / 3.0;
		var widthTwoThirds = width * 2.0 / 3.0;
		var widthNinth = width / 9.0;
		this.addHoles(n2, originX, originY, widthThird, holeList);
		this.addHoles(n2, originX + widthThird, originY, widthThird, holeList);
		this.addHoles(n2, originX + 2 * widthThird, originY, widthThird, holeList);
		this.addHoles(n2, originX, originY + widthThird, widthThird, holeList);
		this.addHoles(n2, originX + 2 * widthThird, originY + widthThird, widthThird, holeList);
		this.addHoles(n2, originX, originY + 2 * widthThird, widthThird, holeList);
		this.addHoles(n2, originX + widthThird, originY + 2 * widthThird, widthThird, holeList);
		this.addHoles(n2, originX + 2 * widthThird, originY + 2 * widthThird, widthThird, holeList);
		holeList.add(this.createSquareHole(originX + widthThird, originY + widthThird, widthThird));
	}
	getHoles(n, originX, originY, width) {
		var holeList = new ArrayList();
		this.addHoles(n, originX, originY, width, holeList);
		return GeometryFactory.toLinearRingArray(holeList);
	}
	createSquareHole(x, y, width) {
		var pts = [new Coordinate(x, y), new Coordinate(x + width, y), new Coordinate(x + width, y + width), new Coordinate(x, y + width), new Coordinate(x, y)];
		return this.geomFactory.createLinearRing(pts);
	}
	getGeometry() {
		var level = SierpinskiCarpetBuilder.recursionLevelForSize(this.numPts);
		var baseLine = this.getSquareBaseLine();
		var origin = baseLine.getCoordinate(0);
		var holes = this.getHoles(level, origin.x, origin.y, this.getDiameter());
		var shell = this.geomFactory.toGeometry(this.getSquareExtent()).getExteriorRing();
		return this.geomFactory.createPolygon(shell, holes);
	}
	getClass() {
		return SierpinskiCarpetBuilder;
	}
}

