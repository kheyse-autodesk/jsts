function Quadrant() {}
module.exports = Quadrant
var Coordinate = require('com/vividsolutions/jts/geom/Coordinate');
Quadrant.isNorthern = function (quad) {
	return quad === Quadrant.NE || quad === Quadrant.NW;
};
Quadrant.isOpposite = function (quad1, quad2) {
	if (quad1 === quad2) return false;
	var diff = (quad1 - quad2 + 4) % 4;
	if (diff === 2) return true;
	return false;
};
Quadrant.commonHalfPlane = function (quad1, quad2) {
	if (quad1 === quad2) return quad1;
	var diff = (quad1 - quad2 + 4) % 4;
	if (diff === 2) return -1;
	var min = quad1 < quad2 ? quad1 : quad2;
	var max = quad1 > quad2 ? quad1 : quad2;
	if (min === 0 && max === 3) return 3;
	return min;
};
Quadrant.isInHalfPlane = function (quad, halfPlane) {
	if (halfPlane === Quadrant.SE) {
		return quad === Quadrant.SE || quad === Quadrant.SW;
	}
	return quad === halfPlane || quad === halfPlane + 1;
};
Quadrant.quadrant = function (...args) {
	switch (args.length) {
		case 2:
			if (!Number.isInteger(args[0]) && !Number.isInteger(args[1])) {
				return ((...args) => {
					let [dx, dy] = args;
					if (dx === 0.0 && dy === 0.0) throw new IllegalArgumentException("Cannot compute the quadrant for point ( " + dx + ", " + dy + " )");
					if (dx >= 0.0) {
						if (dy >= 0.0) return Quadrant.NE; else return Quadrant.SE;
					} else {
						if (dy >= 0.0) return Quadrant.NW; else return Quadrant.SW;
					}
				})(...args);
			} else if (args[0] instanceof Coordinate && args[1] instanceof Coordinate) {
				return ((...args) => {
					let [p0, p1] = args;
					if (p1.x === p0.x && p1.y === p0.y) throw new IllegalArgumentException("Cannot compute the quadrant for two identical points " + p0);
					if (p1.x >= p0.x) {
						if (p1.y >= p0.y) return Quadrant.NE; else return Quadrant.SE;
					} else {
						if (p1.y >= p0.y) return Quadrant.NW; else return Quadrant.SW;
					}
				})(...args);
			}
	}
};
Quadrant.NE = 0;
Quadrant.NW = 1;
Quadrant.SW = 2;
Quadrant.SE = 3;

