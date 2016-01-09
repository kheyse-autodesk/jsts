import PathIterator from 'java/awt/geom/PathIterator';
export default class ShapeCollectionPathIterator {
	constructor(...args) {
		(() => {
			this.shapeIterator = null;
			this.currentPathIterator = new (class {
				getWindingRule() {
					throw new UnsupportedOperationException();
				}
				isDone() {
					return true;
				}
				next() {}
				currentSegment(coords) {
					throw new UnsupportedOperationException();
				}
				currentSegment(coords) {
					throw new UnsupportedOperationException();
				}
			})();
			this.affineTransform = null;
			this.done = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [shapes, affineTransform] = args;
						this.shapeIterator = shapes.iterator();
						this.affineTransform = affineTransform;
						this.next();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [PathIterator];
	}
	next() {
		this.currentPathIterator.next();
		if (this.currentPathIterator.isDone() && !this.shapeIterator.hasNext()) {
			this.done = true;
			return null;
		}
		if (this.currentPathIterator.isDone()) {
			this.currentPathIterator = this.shapeIterator.next().getPathIterator(this.affineTransform);
		}
	}
	currentSegment(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Array) {
						return ((...args) => {
							let [coords] = args;
							return this.currentPathIterator.currentSegment(coords);
						})(...args);
					} else if (args[0] instanceof Array) {
						return ((...args) => {
							let [coords] = args;
							return this.currentPathIterator.currentSegment(coords);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	isDone() {
		return this.done;
	}
	getWindingRule() {
		return PathIterator.WIND_EVEN_ODD;
	}
	getClass() {
		return ShapeCollectionPathIterator;
	}
}

