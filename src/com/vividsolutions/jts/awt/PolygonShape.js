import Rectangle2D from 'java/awt/geom/Rectangle2D';
import GeneralPath from 'java/awt/geom/GeneralPath';
import Shape from 'java/awt/Shape';
import Point2D from 'java/awt/geom/Point2D';
export default class PolygonShape {
	constructor(...args) {
		(() => {
			this.polygonPath = null;
			this.ringPath = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 2:
					return ((...args) => {
						let [shellVertices, holeVerticesCollection] = args;
						this.polygonPath = this.toPath(shellVertices);
						for (var i = holeVerticesCollection.iterator(); i.hasNext(); ) {
							var holeVertices = i.next();
							this.polygonPath.append(this.toPath(holeVertices), false);
						}
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Shape];
	}
	toPath(coordinates) {
		var path = new GeneralPath(GeneralPath.WIND_EVEN_ODD, coordinates.length);
		if (coordinates.length > 0) {
			path.moveTo(coordinates[0].x, coordinates[0].y);
			for (var i = 0; i < coordinates.length; i++) {
				path.lineTo(coordinates[i].x, coordinates[i].y);
			}
		}
		return path;
	}
	intersects(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [r] = args;
						return this.polygonPath.intersects(r);
					})(...args);
				case 4:
					return ((...args) => {
						let [x, y, w, h] = args;
						return this.polygonPath.intersects(x, y, w, h);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	addToRing(p) {
		if (this.ringPath === null) {
			this.ringPath = new GeneralPath(GeneralPath.WIND_EVEN_ODD);
			this.ringPath.moveTo(p.getX(), p.getY());
		} else {
			this.ringPath.lineTo(p.getX(), p.getY());
		}
	}
	getBounds2D() {
		return this.polygonPath.getBounds2D();
	}
	endRing() {
		this.ringPath.closePath();
		if (this.polygonPath === null) {
			this.polygonPath = this.ringPath;
		} else {
			this.polygonPath.append(this.ringPath, false);
		}
		this.ringPath = null;
	}
	contains(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Rectangle2D) {
						return ((...args) => {
							let [r] = args;
							return this.polygonPath.contains(r);
						})(...args);
					} else if (args[0] instanceof Point2D) {
						return ((...args) => {
							let [p] = args;
							return this.polygonPath.contains(p);
						})(...args);
					}
				case 2:
					return ((...args) => {
						let [x, y] = args;
						return this.polygonPath.contains(x, y);
					})(...args);
				case 4:
					return ((...args) => {
						let [x, y, w, h] = args;
						return this.polygonPath.contains(x, y, w, h);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getPathIterator(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [at] = args;
						return this.polygonPath.getPathIterator(at);
					})(...args);
				case 2:
					return ((...args) => {
						let [at, flatness] = args;
						return this.getPathIterator(at, flatness);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getBounds() {
		return this.polygonPath.getBounds();
	}
	getClass() {
		return PolygonShape;
	}
}

