import CommonBits from './CommonBits';
import CoordinateFilter from '../geom/CoordinateFilter';
import Coordinate from '../geom/Coordinate';
export default class CommonCoordinateFilter {
	constructor(...args) {
		(() => {
			this.commonBitsX = new CommonBits();
			this.commonBitsY = new CommonBits();
		})();
	}
	get interfaces_() {
		return [CoordinateFilter];
	}
	filter(coord) {
		this.commonBitsX.add(coord.x);
		this.commonBitsY.add(coord.y);
	}
	getCommonCoordinate() {
		return new Coordinate(this.commonBitsX.getCommon(), this.commonBitsY.getCommon());
	}
	getClass() {
		return CommonCoordinateFilter;
	}
}

