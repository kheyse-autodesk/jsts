import PolygonExtracter from '../../../geom/util/PolygonExtracter';
import WKTWriter from '../../../io/WKTWriter';
import Polygon from '../../../geom/Polygon';
import MultiPolygon from '../../../geom/MultiPolygon';
import System from 'java/lang/System';
import GeometryCollection from '../../../geom/GeometryCollection';
import ArrayList from 'java/util/ArrayList';
import LinearComponentExtracter from '../../../geom/util/LinearComponentExtracter';
import DistanceOp from '../../distance/DistanceOp';
import DiscreteHausdorffDistance from '../../../algorithm/distance/DiscreteHausdorffDistance';
export default class BufferDistanceValidator {
	constructor(...args) {
		(() => {
			this.input = null;
			this.bufDistance = null;
			this.result = null;
			this.minValidDistance = null;
			this.maxValidDistance = null;
			this.minDistanceFound = null;
			this.maxDistanceFound = null;
			this.isValid = true;
			this.errMsg = null;
			this.errorLocation = null;
			this.errorIndicator = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 3:
					return ((...args) => {
						let [input, bufDistance, result] = args;
						this.input = input;
						this.bufDistance = bufDistance;
						this.result = result;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get VERBOSE() {
		return false;
	}
	static get MAX_DISTANCE_DIFF_FRAC() {
		return .012;
	}
	checkMaximumDistance(input, bufCurve, maxDist) {
		var haus = new DiscreteHausdorffDistance(bufCurve, input);
		haus.setDensifyFraction(0.25);
		this.maxDistanceFound = haus.orientedDistance();
		if (this.maxDistanceFound > maxDist) {
			this.isValid = false;
			var pts = haus.getCoordinates();
			this.errorLocation = pts[1];
			this.errorIndicator = input.getFactory().createLineString(pts);
			this.errMsg = Math.trunc(Math.trunc("Distance between buffer curve and input is too large " + "(" + this.maxDistanceFound + " at ") + WKTWriter.toLineString(pts[0], pts[1])) + ")";
		}
	}
	isValid() {
		var posDistance = Math.abs(this.bufDistance);
		var distDelta = BufferDistanceValidator.MAX_DISTANCE_DIFF_FRAC * posDistance;
		this.minValidDistance = posDistance - distDelta;
		this.maxValidDistance = posDistance + distDelta;
		if (this.input.isEmpty() || this.result.isEmpty()) return true;
		if (this.bufDistance > 0.0) {
			this.checkPositiveValid();
		} else {
			this.checkNegativeValid();
		}
		if (BufferDistanceValidator.VERBOSE) {
			System.out.println(Math.trunc(Math.trunc(Math.trunc(Math.trunc(Math.trunc("Min Dist= " + this.minDistanceFound + "  err= ") + 1.0 - this.minDistanceFound / this.bufDistance) + "  Max Dist= ") + this.maxDistanceFound) + "  err= ") + this.maxDistanceFound / this.bufDistance - 1.0);
		}
		return this.isValid;
	}
	checkNegativeValid() {
		if (!(this.input instanceof Polygon || this.input instanceof MultiPolygon || this.input instanceof GeometryCollection)) {
			return null;
		}
		var inputCurve = this.getPolygonLines(this.input);
		this.checkMinimumDistance(inputCurve, this.result, this.minValidDistance);
		if (!this.isValid) return null;
		this.checkMaximumDistance(inputCurve, this.result, this.maxValidDistance);
	}
	getErrorIndicator() {
		return this.errorIndicator;
	}
	checkMinimumDistance(g1, g2, minDist) {
		var distOp = new DistanceOp(g1, g2, minDist);
		this.minDistanceFound = distOp.distance();
		if (this.minDistanceFound < minDist) {
			this.isValid = false;
			var pts = distOp.nearestPoints();
			this.errorLocation = distOp.nearestPoints()[1];
			this.errorIndicator = g1.getFactory().createLineString(pts);
			this.errMsg = Math.trunc(Math.trunc("Distance between buffer curve and input is too small " + "(" + this.minDistanceFound + " at ") + WKTWriter.toLineString(pts[0], pts[1])) + " )";
		}
	}
	checkPositiveValid() {
		var bufCurve = this.result.getBoundary();
		this.checkMinimumDistance(this.input, bufCurve, this.minValidDistance);
		if (!this.isValid) return null;
		this.checkMaximumDistance(this.input, bufCurve, this.maxValidDistance);
	}
	getErrorLocation() {
		return this.errorLocation;
	}
	getPolygonLines(g) {
		var lines = new ArrayList();
		var lineExtracter = new LinearComponentExtracter(lines);
		var polys = PolygonExtracter.getPolygons(g);
		for (var i = polys.iterator(); i.hasNext(); ) {
			var poly = i.next();
			poly.apply(lineExtracter);
		}
		return g.getFactory().buildGeometry(lines);
	}
	getErrorMessage() {
		return this.errMsg;
	}
	getClass() {
		return BufferDistanceValidator;
	}
}

