import CoordinateList from '../geom/CoordinateList';
import ArrayList from 'java/util/ArrayList';
export default class LinearGeometryBuilder {
	constructor(...args) {
		(() => {
			this.geomFact = null;
			this.lines = new ArrayList();
			this.coordList = null;
			this.ignoreInvalidLines = false;
			this.fixInvalidLines = false;
			this.lastPt = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geomFact] = args;
						this.geomFact = geomFact;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getGeometry() {
		this.endLine();
		return this.geomFact.buildGeometry(this.lines);
	}
	getLastCoordinate() {
		return this.lastPt;
	}
	endLine() {
		if (this.coordList === null) {
			return null;
		}
		if (this.ignoreInvalidLines && this.coordList.size() < 2) {
			this.coordList = null;
			return null;
		}
		var rawPts = this.coordList.toCoordinateArray();
		var pts = rawPts;
		if (this.fixInvalidLines) pts = this.validCoordinateSequence(rawPts);
		this.coordList = null;
		var line = null;
		try {
			line = this.geomFact.createLineString(pts);
		} catch (ex) {
			if (ex instanceof IllegalArgumentException) {
				if (!this.ignoreInvalidLines) throw ex;
			} else throw ex;
		} finally {}
		if (line !== null) this.lines.add(line);
	}
	setFixInvalidLines(fixInvalidLines) {
		this.fixInvalidLines = fixInvalidLines;
	}
	add(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [pt] = args;
						this.add(pt, true);
					})(...args);
				case 2:
					return ((...args) => {
						let [pt, allowRepeatedPoints] = args;
						if (this.coordList === null) this.coordList = new CoordinateList();
						this.coordList.add(pt, allowRepeatedPoints);
						this.lastPt = pt;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	setIgnoreInvalidLines(ignoreInvalidLines) {
		this.ignoreInvalidLines = ignoreInvalidLines;
	}
	validCoordinateSequence(pts) {
		if (pts.length >= 2) return pts;
		var validPts = [pts[0], pts[0]];
		return validPts;
	}
	getClass() {
		return LinearGeometryBuilder;
	}
}

