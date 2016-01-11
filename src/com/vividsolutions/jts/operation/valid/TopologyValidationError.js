export default class TopologyValidationError {
	constructor(...args) {
		(() => {
			this.errorType = null;
			this.pt = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [errorType] = args;
						overloads.call(this, errorType, null);
					})(...args);
				case 2:
					return ((...args) => {
						let [errorType, pt] = args;
						this.errorType = errorType;
						if (pt !== null) this.pt = pt.copy();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get ERROR() {
		return 0;
	}
	static get REPEATED_POINT() {
		return 1;
	}
	static get HOLE_OUTSIDE_SHELL() {
		return 2;
	}
	static get NESTED_HOLES() {
		return 3;
	}
	static get DISCONNECTED_INTERIOR() {
		return 4;
	}
	static get SELF_INTERSECTION() {
		return 5;
	}
	static get RING_SELF_INTERSECTION() {
		return 6;
	}
	static get NESTED_SHELLS() {
		return 7;
	}
	static get DUPLICATE_RINGS() {
		return 8;
	}
	static get TOO_FEW_POINTS() {
		return 9;
	}
	static get INVALID_COORDINATE() {
		return 10;
	}
	static get RING_NOT_CLOSED() {
		return 11;
	}
	static get errMsg() {
		return ["Topology Validation Error", "Repeated Point", "Hole lies outside shell", "Holes are nested", "Interior is disconnected", "Self-intersection", "Ring Self-intersection", "Nested shells", "Duplicate Rings", "Too few distinct points in geometry component", "Invalid Coordinate", "Ring is not closed"];
	}
	getErrorType() {
		return this.errorType;
	}
	getMessage() {
		return TopologyValidationError.errMsg[this.errorType];
	}
	getCoordinate() {
		return this.pt;
	}
	toString() {
		var locStr = "";
		if (this.pt !== null) locStr = " at or near point " + this.pt;
		return this.getMessage() + locStr;
	}
	getClass() {
		return TopologyValidationError;
	}
}

