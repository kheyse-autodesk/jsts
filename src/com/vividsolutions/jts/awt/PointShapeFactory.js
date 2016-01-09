import GeneralPath from 'java/awt/geom/GeneralPath';
export default class PointShapeFactory {
	get interfaces_() {
		return [];
	}
	static get BasePointShapeFactory() {
		return BasePointShapeFactory;
	}
	static get Point() {
		return Point;
	}
	static get Square() {
		return Square;
	}
	static get Star() {
		return Star;
	}
	static get Triangle() {
		return Triangle;
	}
	static get Circle() {
		return Circle;
	}
	static get Cross() {
		return Cross;
	}
	static get X() {
		return X;
	}
	createPoint(point) {}
	getClass() {
		return PointShapeFactory;
	}
}
class BasePointShapeFactory {
	constructor(...args) {
		(() => {
			this.size = BasePointShapeFactory.DEFAULT_SIZE;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 1:
					return ((...args) => {
						let [size] = args;
						this.size = size;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [PointShapeFactory];
	}
	static get DEFAULT_SIZE() {
		return 3.0;
	}
	getClass() {
		return BasePointShapeFactory;
	}
}
class Point extends BasePointShapeFactory {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						super();
					})(...args);
				case 1:
					return ((...args) => {
						let [size] = args;
						super(size);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	createPoint(point) {
		var pointMarker = new Line2D.Double(point.getX(), point.getY(), point.getX(), point.getY());
		return pointMarker;
	}
	getClass() {
		return Point;
	}
}
class Square extends BasePointShapeFactory {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						super();
					})(...args);
				case 1:
					return ((...args) => {
						let [size] = args;
						super(size);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	createPoint(point) {
		var pointMarker = new Rectangle2D.Double(0.0, 0.0, this.size, this.size);
		pointMarker.x = point.getX() - this.size / 2;
		pointMarker.y = point.getY() - this.size / 2;
		return pointMarker;
	}
	getClass() {
		return Square;
	}
}
class Star extends BasePointShapeFactory {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						super();
					})(...args);
				case 1:
					return ((...args) => {
						let [size] = args;
						super(size);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	createPoint(point) {
		var path = new GeneralPath();
		path.moveTo(point.getX(), point.getY() - this.size / 2);
		path.lineTo(point.getX() + this.size * 1 / 8, point.getY() - this.size * 1 / 8);
		path.lineTo(point.getX() + this.size / 2, point.getY() - this.size * 1 / 8);
		path.lineTo(point.getX() + this.size * 2 / 8, point.getY() + this.size * 1 / 8);
		path.lineTo(point.getX() + this.size * 3 / 8, point.getY() + this.size / 2);
		path.lineTo(point.getX(), point.getY() + this.size * 2 / 8);
		path.lineTo(point.getX() - this.size * 3 / 8, point.getY() + this.size / 2);
		path.lineTo(point.getX() - this.size * 2 / 8, point.getY() + this.size * 1 / 8);
		path.lineTo(point.getX() - this.size / 2, point.getY() - this.size * 1 / 8);
		path.lineTo(point.getX() - this.size * 1 / 8, point.getY() - this.size * 1 / 8);
		path.closePath();
		return path;
	}
	getClass() {
		return Star;
	}
}
class Triangle extends BasePointShapeFactory {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						super();
					})(...args);
				case 1:
					return ((...args) => {
						let [size] = args;
						super(size);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	createPoint(point) {
		var path = new GeneralPath();
		path.moveTo(point.getX(), point.getY() - this.size / 2);
		path.lineTo(point.getX() + this.size / 2, point.getY() + this.size / 2);
		path.lineTo(point.getX() - this.size / 2, point.getY() + this.size / 2);
		path.lineTo(point.getX(), point.getY() - this.size / 2);
		return path;
	}
	getClass() {
		return Triangle;
	}
}
class Circle extends BasePointShapeFactory {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						super();
					})(...args);
				case 1:
					return ((...args) => {
						let [size] = args;
						super(size);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	createPoint(point) {
		var pointMarker = new Ellipse2D.Double(0.0, 0.0, this.size, this.size);
		pointMarker.x = point.getX() - this.size / 2;
		pointMarker.y = point.getY() - this.size / 2;
		return pointMarker;
	}
	getClass() {
		return Circle;
	}
}
class Cross extends BasePointShapeFactory {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						super();
					})(...args);
				case 1:
					return ((...args) => {
						let [size] = args;
						super(size);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	createPoint(point) {
		var x1 = point.getX() - this.size / 2f;
		var x2 = point.getX() - this.size / 4f;
		var x3 = point.getX() + this.size / 4f;
		var x4 = point.getX() + this.size / 2f;
		var y1 = point.getY() - this.size / 2f;
		var y2 = point.getY() - this.size / 4f;
		var y3 = point.getY() + this.size / 4f;
		var y4 = point.getY() + this.size / 2f;
		var path = new GeneralPath();
		path.moveTo(x2, y1);
		path.lineTo(x3, y1);
		path.lineTo(x3, y2);
		path.lineTo(x4, y2);
		path.lineTo(x4, y3);
		path.lineTo(x3, y3);
		path.lineTo(x3, y4);
		path.lineTo(x2, y4);
		path.lineTo(x2, y3);
		path.lineTo(x1, y3);
		path.lineTo(x1, y2);
		path.lineTo(x2, y2);
		path.lineTo(x2, y1);
		return path;
	}
	getClass() {
		return Cross;
	}
}
class X extends BasePointShapeFactory {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						super();
					})(...args);
				case 1:
					return ((...args) => {
						let [size] = args;
						super(size);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	createPoint(point) {
		var path = new GeneralPath();
		path.moveTo(point.getX(), point.getY() - this.size * 1 / 8);
		path.lineTo(point.getX() + this.size * 2 / 8, point.getY() - this.size / 2);
		path.lineTo(point.getX() + this.size / 2, point.getY() - this.size / 2);
		path.lineTo(point.getX() + this.size * 1 / 8, point.getY());
		path.lineTo(point.getX() + this.size / 2, point.getY() + this.size / 2);
		path.lineTo(point.getX() + this.size * 2 / 8, point.getY() + this.size / 2);
		path.lineTo(point.getX(), point.getY() + this.size * 1 / 8);
		path.lineTo(point.getX() - this.size * 2 / 8, point.getY() + this.size / 2);
		path.lineTo(point.getX() - this.size / 2, point.getY() + this.size / 2);
		path.lineTo(point.getX() - this.size * 1 / 8, point.getY());
		path.lineTo(point.getX() - this.size / 2, point.getY() - this.size / 2);
		path.lineTo(point.getX() - this.size * 2 / 8, point.getY() - this.size / 2);
		path.closePath();
		return path;
	}
	getClass() {
		return X;
	}
}

