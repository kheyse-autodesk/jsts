import LineString from 'com/vividsolutions/jts/geom/LineString';
import Point from 'com/vividsolutions/jts/geom/Point';
import Polygon from 'com/vividsolutions/jts/geom/Polygon';
import GeometryLocation from 'com/vividsolutions/jts/operation/distance/GeometryLocation';
import ArrayList from 'java/util/ArrayList';
import GeometryFilter from 'com/vividsolutions/jts/geom/GeometryFilter';
export default class ConnectedElementLocationFilter {
	constructor(...args) {
		(() => {
			this.locations = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [locations] = args;
						this.locations = locations;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [GeometryFilter];
	}
	static getLocations(geom) {
		var locations = new ArrayList();
		geom.apply(new ConnectedElementLocationFilter(locations));
		return locations;
	}
	filter(geom) {
		if (geom instanceof Point || geom instanceof LineString || geom instanceof Polygon) this.locations.add(new GeometryLocation(geom, 0, geom.getCoordinate()));
	}
	getClass() {
		return ConnectedElementLocationFilter;
	}
}

