import PreparedPoint from './PreparedPoint';
import Lineal from '../Lineal';
import PreparedLineString from './PreparedLineString';
import Polygonal from '../Polygonal';
import PreparedPolygon from './PreparedPolygon';
import Puntal from '../Puntal';
import BasicPreparedGeometry from './BasicPreparedGeometry';
export default class PreparedGeometryFactory {
	constructor(...args) {
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static prepare(geom) {
		return new PreparedGeometryFactory().create(geom);
	}
	create(geom) {
		if (geom instanceof Polygonal) return new PreparedPolygon(geom);
		if (geom instanceof Lineal) return new PreparedLineString(geom);
		if (geom instanceof Puntal) return new PreparedPoint(geom);
		return new BasicPreparedGeometry(geom);
	}
	getClass() {
		return PreparedGeometryFactory;
	}
}

