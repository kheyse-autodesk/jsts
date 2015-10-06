export default class Position {
	get interfaces_() {
		return [];
	}
	static get ON() {
		return 0;
	}
	static get LEFT() {
		return 1;
	}
	static get RIGHT() {
		return 2;
	}
	static opposite(position) {
		if (position === Position.LEFT) return Position.RIGHT;
		if (position === Position.RIGHT) return Position.LEFT;
		return position;
	}
}

