import Rectangle2D from 'java/awt/geom/Rectangle2D';
import Shape from 'java/awt/Shape';
import ArrayList from 'java/util/ArrayList';
import Point2D from 'java/awt/geom/Point2D';
import ShapeCollectionPathIterator from './ShapeCollectionPathIterator';
export default class GeometryCollectionShape {
	constructor(...args) {
		(() => {
			this.shapes = new ArrayList();
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
		return [Shape];
	}
	intersects(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [r] = args;
						throw new java.lang.UnsupportedOperationException("Method intersects() not yet implemented.");
					})(...args);
				case 4:
					return ((...args) => {
						let [x, y, w, h] = args;
						throw new java.lang.UnsupportedOperationException("Method intersects() not yet implemented.");
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getBounds2D() {
		var rectangle = null;
		for (var i = this.shapes.iterator(); i.hasNext(); ) {
			var shape = i.next();
			if (rectangle === null) {
				rectangle = shape.getBounds2D();
			} else {
				rectangle.add(shape.getBounds2D());
			}
		}
		return rectangle;
	}
	contains(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Rectangle2D) {
						return ((...args) => {
							let [r] = args;
							throw new java.lang.UnsupportedOperationException("Method contains() not yet implemented.");
						})(...args);
					} else if (args[0] instanceof Point2D) {
						return ((...args) => {
							let [p] = args;
							throw new java.lang.UnsupportedOperationException("Method contains() not yet implemented.");
						})(...args);
					}
				case 2:
					return ((...args) => {
						let [x, y] = args;
						throw new java.lang.UnsupportedOperationException("Method contains() not yet implemented.");
					})(...args);
				case 4:
					return ((...args) => {
						let [x, y, w, h] = args;
						throw new java.lang.UnsupportedOperationException("Method contains() not yet implemented.");
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	add(shape) {
		this.shapes.add(shape);
	}
	getPathIterator(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [at] = args;
						return new ShapeCollectionPathIterator(this.shapes, at);
					})(...args);
				case 2:
					return ((...args) => {
						let [at, flatness] = args;
						return this.getPathIterator(at);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getBounds() {
		throw new java.lang.UnsupportedOperationException("Method getBounds() not yet implemented.");
	}
	getClass() {
		return GeometryCollectionShape;
	}
}

