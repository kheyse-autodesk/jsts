import LineString from '../geom/LineString';
import GeometryCollectionShape from './GeometryCollectionShape';
import Geometry from '../geom/Geometry';
import Point from '../geom/Point';
import Polygon from '../geom/Polygon';
import GeneralPath from 'java/awt/geom/GeneralPath';
import PolygonShape from './PolygonShape';
import Double from 'java/lang/Double';
import IdentityPointTransformation from './IdentityPointTransformation';
import GeometryCollection from '../geom/GeometryCollection';
import MultiLineString from '../geom/MultiLineString';
export default class ShapeWriter {
	constructor(...args) {
		(() => {
			this.pointTransformer = ShapeWriter.DEFAULT_POINT_TRANSFORMATION;
			this.pointFactory = ShapeWriter.DEFAULT_POINT_FACTORY;
			this.transPoint = new Point2D.Double();
			this.doRemoveDuplicatePoints = false;
			this.decimationDistance = 0;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 1:
					return ((...args) => {
						let [pointTransformer] = args;
						overloads.call(this, pointTransformer, null);
					})(...args);
				case 2:
					return ((...args) => {
						let [pointTransformer, pointFactory] = args;
						if (pointTransformer !== null) this.pointTransformer = pointTransformer;
						if (pointFactory !== null) this.pointFactory = pointFactory;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get DEFAULT_POINT_TRANSFORMATION() {
		return new IdentityPointTransformation();
	}
	static get DEFAULT_POINT_FACTORY() {
		return new PointShapeFactory.Square(3.0);
	}
	transformPoint(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [model] = args;
						return this.transformPoint(model, new Point2D.Double());
					})(...args);
				case 2:
					return ((...args) => {
						let [model, view] = args;
						this.pointTransformer.transform(model, view);
						return view;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	setRemoveDuplicatePoints(doRemoveDuplicatePoints) {
		this.doRemoveDuplicatePoints = doRemoveDuplicatePoints;
	}
	toShape(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Point) {
						return ((...args) => {
							let [point] = args;
							var viewPoint = this.transformPoint(point.getCoordinate());
							return this.pointFactory.createPoint(viewPoint);
						})(...args);
					} else if (args[0] instanceof LineString) {
						return ((...args) => {
							let [lineString] = args;
							var shape = new GeneralPath();
							var prev = lineString.getCoordinateN(0);
							this.transformPoint(prev, this.transPoint);
							shape.moveTo(this.transPoint.getX(), this.transPoint.getY());
							var prevx = this.transPoint.getX();
							var prevy = this.transPoint.getY();
							var n = lineString.getNumPoints() - 1;
							for (var i = 1; i <= n; i++) {
								var currentCoord = lineString.getCoordinateN(i);
								if (this.decimationDistance > 0.0) {
									var isDecimated = prev !== null && Math.abs(currentCoord.x - prev.x) < this.decimationDistance && Math.abs(currentCoord.y - prev.y) < this.decimationDistance;
									if (i < n && isDecimated) {
										continue;
									}
									prev = currentCoord;
								}
								this.transformPoint(currentCoord, this.transPoint);
								if (this.doRemoveDuplicatePoints) {
									var isDup = this.transPoint.getX() === prevx && this.transPoint.getY() === prevy;
									if (i < n && isDup) continue;
									prevx = this.transPoint.getX();
									prevy = this.transPoint.getY();
								}
								shape.lineTo(this.transPoint.getX(), this.transPoint.getY());
							}
							return shape;
						})(...args);
					} else if (args[0] instanceof MultiLineString) {
						return ((...args) => {
							let [mls] = args;
							var path = new GeneralPath();
							for (var i = 0; i < mls.getNumGeometries(); i++) {
								var lineString = mls.getGeometryN(i);
								path.append(this.toShape(lineString), false);
							}
							return path;
						})(...args);
					} else if (args[0] instanceof GeometryCollection) {
						return ((...args) => {
							let [gc] = args;
							var shape = new GeometryCollectionShape();
							for (var i = 0; i < gc.getNumGeometries(); i++) {
								var g = gc.getGeometryN(i);
								shape.add(this.toShape(g));
							}
							return shape;
						})(...args);
					} else if (args[0] instanceof Polygon) {
						return ((...args) => {
							let [p] = args;
							var poly = new PolygonShape();
							this.appendRing(poly, p.getExteriorRing().getCoordinates());
							for (var j = 0; j < p.getNumInteriorRing(); j++) {
								this.appendRing(poly, p.getInteriorRingN(j).getCoordinates());
							}
							return poly;
						})(...args);
					} else if (args[0] instanceof Geometry) {
						return ((...args) => {
							let [geometry] = args;
							if (geometry.isEmpty()) return new GeneralPath();
							if (geometry instanceof Polygon) return this.toShape(geometry);
							if (geometry instanceof LineString) return this.toShape(geometry);
							if (geometry instanceof MultiLineString) return this.toShape(geometry);
							if (geometry instanceof Point) return this.toShape(geometry);
							if (geometry instanceof GeometryCollection) return this.toShape(geometry);
							throw new IllegalArgumentException("Unrecognized Geometry class: " + geometry.getClass());
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	appendRing(poly, coords) {
		var prevx = Double.NaN;
		var prevy = Double.NaN;
		var prev = null;
		var n = coords.length - 1;
		for (var i = 0; i < n; i++) {
			if (this.decimationDistance > 0.0) {
				var isDecimated = prev !== null && Math.abs(coords[i].x - prev.x) < this.decimationDistance && Math.abs(coords[i].y - prev.y) < this.decimationDistance;
				if (i < n && isDecimated) continue;
				prev = coords[i];
			}
			this.transformPoint(coords[i], this.transPoint);
			if (this.doRemoveDuplicatePoints) {
				var isDup = this.transPoint.getX() === prevx && this.transPoint.getY() === prevy;
				if (i < n && isDup) continue;
				prevx = this.transPoint.getX();
				prevy = this.transPoint.getY();
			}
			poly.addToRing(this.transPoint);
		}
		poly.endRing();
	}
	setDecimation(decimationDistance) {
		this.decimationDistance = decimationDistance;
	}
	getClass() {
		return ShapeWriter;
	}
}

