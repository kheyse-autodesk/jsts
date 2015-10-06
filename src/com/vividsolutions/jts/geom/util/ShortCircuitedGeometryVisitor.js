import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
export default class ShortCircuitedGeometryVisitor {
	constructor(...args) {
		(() => {
			this.isDone = false;
		})();
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
	applyTo(geom) {
		for (var i = 0; i < geom.getNumGeometries() && !this.isDone; i++) {
			var element = geom.getGeometryN(i);
			if (!(element instanceof GeometryCollection)) {
				this.visit(element);
				if (this.isDone()) {
					this.isDone = true;
					return null;
				}
			} else this.applyTo(element);
		}
	}
	getClass() {
		return ShortCircuitedGeometryVisitor;
	}
}

