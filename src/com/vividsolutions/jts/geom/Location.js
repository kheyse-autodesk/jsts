import IllegalArgumentException from 'java/lang/IllegalArgumentException';
export default class Location {
	get interfaces_() {
		return [];
	}
	static get INTERIOR() {
		return 0;
	}
	static get BOUNDARY() {
		return 1;
	}
	static get EXTERIOR() {
		return 2;
	}
	static get NONE() {
		return -1;
	}
	static toLocationSymbol(locationValue) {
		switch (locationValue) {
			case Location.EXTERIOR:
				return 'e';
			case Location.BOUNDARY:
				return 'b';
			case Location.INTERIOR:
				return 'i';
			case Location.NONE:
				return '-';
		}
		throw new IllegalArgumentException("Unknown location value: " + locationValue);
	}
	getClass() {
		return Location;
	}
}

