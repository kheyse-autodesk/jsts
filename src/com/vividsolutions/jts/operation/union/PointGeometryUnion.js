import PointLocator from 'com/vividsolutions/jts/algorithm/PointLocator';
import Location from 'com/vividsolutions/jts/geom/Location';
import TreeSet from 'java/util/TreeSet';
import GeometryCombiner from 'com/vividsolutions/jts/geom/util/GeometryCombiner';
import CoordinateArrays from 'com/vividsolutions/jts/geom/CoordinateArrays';
export default class PointGeometryUnion {
	constructor(...args) {
		(() => {
			this.pointGeom = null;
			this.otherGeom = null;
			this.geomFact = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [pointGeom, otherGeom] = args;
						this.pointGeom = pointGeom;
						this.otherGeom = otherGeom;
						this.geomFact = otherGeom.getFactory();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static union(pointGeom, otherGeom) {
		var unioner = new PointGeometryUnion(pointGeom, otherGeom);
		return unioner.union();
	}
	union() {
		var locater = new PointLocator();
		var exteriorCoords = new TreeSet();
		for (var i = 0; i < this.pointGeom.getNumGeometries(); i++) {
			var point = this.pointGeom.getGeometryN(i);
			var coord = point.getCoordinate();
			var loc = locater.locate(coord, this.otherGeom);
			if (loc === Location.EXTERIOR) exteriorCoords.add(coord);
		}
		if (exteriorCoords.size() === 0) return this.otherGeom;
		var ptComp = null;
		var coords = CoordinateArrays.toCoordinateArray(exteriorCoords);
		if (coords.length === 1) {
			ptComp = this.geomFact.createPoint(coords[0]);
		} else {
			ptComp = this.geomFact.createMultiPoint(coords);
		}
		return GeometryCombiner.combine(ptComp, this.otherGeom);
	}
	getClass() {
		return PointGeometryUnion;
	}
}

