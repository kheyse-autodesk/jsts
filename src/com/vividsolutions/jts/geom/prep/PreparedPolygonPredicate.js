import Location from '../Location';
import ComponentCoordinateExtracter from '../util/ComponentCoordinateExtracter';
import SimplePointInAreaLocator from '../../algorithm/locate/SimplePointInAreaLocator';
export default class PreparedPolygonPredicate {
	constructor(...args) {
		(() => {
			this.prepPoly = null;
			this.targetPointLocator = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [prepPoly] = args;
						this.prepPoly = prepPoly;
						this.targetPointLocator = prepPoly.getPointLocator();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	isAnyTargetComponentInAreaTest(testGeom, targetRepPts) {
		var piaLoc = new SimplePointInAreaLocator(testGeom);
		for (var i = targetRepPts.iterator(); i.hasNext(); ) {
			var p = i.next();
			var loc = piaLoc.locate(p);
			if (loc !== Location.EXTERIOR) return true;
		}
		return false;
	}
	isAllTestComponentsInTarget(testGeom) {
		var coords = ComponentCoordinateExtracter.getCoordinates(testGeom);
		for (var i = coords.iterator(); i.hasNext(); ) {
			var p = i.next();
			var loc = this.targetPointLocator.locate(p);
			if (loc === Location.EXTERIOR) return false;
		}
		return true;
	}
	isAnyTestComponentInTargetInterior(testGeom) {
		var coords = ComponentCoordinateExtracter.getCoordinates(testGeom);
		for (var i = coords.iterator(); i.hasNext(); ) {
			var p = i.next();
			var loc = this.targetPointLocator.locate(p);
			if (loc === Location.INTERIOR) return true;
		}
		return false;
	}
	isAllTestComponentsInTargetInterior(testGeom) {
		var coords = ComponentCoordinateExtracter.getCoordinates(testGeom);
		for (var i = coords.iterator(); i.hasNext(); ) {
			var p = i.next();
			var loc = this.targetPointLocator.locate(p);
			if (loc !== Location.INTERIOR) return false;
		}
		return true;
	}
	isAnyTestComponentInTarget(testGeom) {
		var coords = ComponentCoordinateExtracter.getCoordinates(testGeom);
		for (var i = coords.iterator(); i.hasNext(); ) {
			var p = i.next();
			var loc = this.targetPointLocator.locate(p);
			if (loc !== Location.EXTERIOR) return true;
		}
		return false;
	}
	getClass() {
		return PreparedPolygonPredicate;
	}
}

