import LineString from 'com/vividsolutions/jts/geom/LineString';
import CoordinateList from 'com/vividsolutions/jts/geom/CoordinateList';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import LinearRing from 'com/vividsolutions/jts/geom/LinearRing';
export default class PrecisionReducerCoordinateOperation extends CoordinateOperation {
	constructor(...args) {
		super();
		(() => {
			this.targetPM = null;
			this.removeCollapsed = true;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [targetPM, removeCollapsed] = args;
						this.targetPM = targetPM;
						this.removeCollapsed = removeCollapsed;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	edit(coordinates, geom) {
		if (coordinates.length === 0) return null;
		var reducedCoords = [];
		for (var i = 0; i < coordinates.length; i++) {
			var coord = new Coordinate(coordinates[i]);
			this.targetPM.makePrecise(coord);
			reducedCoords[i] = coord;
		}
		var noRepeatedCoordList = new CoordinateList(reducedCoords, false);
		var noRepeatedCoords = noRepeatedCoordList.toCoordinateArray();
		var minLength = 0;
		if (geom instanceof LineString) minLength = 2;
		if (geom instanceof LinearRing) minLength = 4;
		var collapsedCoords = reducedCoords;
		if (this.removeCollapsed) collapsedCoords = null;
		if (noRepeatedCoords.length < minLength) {
			return collapsedCoords;
		}
		return noRepeatedCoords;
	}
}

