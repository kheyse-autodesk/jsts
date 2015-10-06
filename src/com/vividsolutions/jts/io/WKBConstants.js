export default class WKBConstants {
	constructor(...args) {
		(() => {
			this.wkbXDR = 0;
			this.wkbNDR = 1;
			this.wkbPoint = 1;
			this.wkbLineString = 2;
			this.wkbPolygon = 3;
			this.wkbMultiPoint = 4;
			this.wkbMultiLineString = 5;
			this.wkbMultiPolygon = 6;
			this.wkbGeometryCollection = 7;
		})();
	}
	get interfaces_() {
		return [];
	}
}

