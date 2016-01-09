import Lineal from '../geom/Lineal';
export default class LinearIterator {
	constructor(...args) {
		(() => {
			this.linearGeom = null;
			this.numLines = null;
			this.currentLine = null;
			this.componentIndex = 0;
			this.vertexIndex = 0;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [linear] = args;
						overloads.call(this, linear, 0, 0);
					})(...args);
				case 2:
					return ((...args) => {
						let [linear, start] = args;
						overloads.call(this, linear, start.getComponentIndex(), LinearIterator.segmentEndVertexIndex(start));
					})(...args);
				case 3:
					return ((...args) => {
						let [linearGeom, componentIndex, vertexIndex] = args;
						if (!(linearGeom instanceof Lineal)) throw new IllegalArgumentException("Lineal geometry is required");
						this.linearGeom = linearGeom;
						this.numLines = linearGeom.getNumGeometries();
						this.componentIndex = componentIndex;
						this.vertexIndex = vertexIndex;
						this.loadCurrentLine();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static segmentEndVertexIndex(loc) {
		if (loc.getSegmentFraction() > 0.0) return loc.getSegmentIndex() + 1;
		return loc.getSegmentIndex();
	}
	getComponentIndex() {
		return this.componentIndex;
	}
	getLine() {
		return this.currentLine;
	}
	getVertexIndex() {
		return this.vertexIndex;
	}
	getSegmentEnd() {
		if (this.vertexIndex < this.getLine().getNumPoints() - 1) return this.currentLine.getCoordinateN(this.vertexIndex + 1);
		return null;
	}
	next() {
		if (!this.hasNext()) return null;
		this.vertexIndex++;
		if (this.vertexIndex >= this.currentLine.getNumPoints()) {
			this.componentIndex++;
			this.loadCurrentLine();
			this.vertexIndex = 0;
		}
	}
	loadCurrentLine() {
		if (this.componentIndex >= this.numLines) {
			this.currentLine = null;
			return null;
		}
		this.currentLine = this.linearGeom.getGeometryN(this.componentIndex);
	}
	getSegmentStart() {
		return this.currentLine.getCoordinateN(this.vertexIndex);
	}
	isEndOfLine() {
		if (this.componentIndex >= this.numLines) return false;
		if (this.vertexIndex < this.currentLine.getNumPoints() - 1) return false;
		return true;
	}
	hasNext() {
		if (this.componentIndex >= this.numLines) return false;
		if (this.componentIndex === this.numLines - 1 && this.vertexIndex >= this.currentLine.getNumPoints()) return false;
		return true;
	}
	getClass() {
		return LinearIterator;
	}
}

