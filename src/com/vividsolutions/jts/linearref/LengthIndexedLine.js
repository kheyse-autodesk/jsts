import LocationIndexedLine from './LocationIndexedLine';
import LengthIndexOfPoint from './LengthIndexOfPoint';
import LocationIndexOfLine from './LocationIndexOfLine';
import LengthLocationMap from './LengthLocationMap';
import ExtractLineByLocation from './ExtractLineByLocation';
export default class LengthIndexedLine {
	constructor(...args) {
		(() => {
			this.linearGeom = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [linearGeom] = args;
						this.linearGeom = linearGeom;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	clampIndex(index) {
		var posIndex = this.positiveIndex(index);
		var startIndex = this.getStartIndex();
		if (posIndex < startIndex) return startIndex;
		var endIndex = this.getEndIndex();
		if (posIndex > endIndex) return endIndex;
		return posIndex;
	}
	locationOf(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [index] = args;
						return LengthLocationMap.getLocation(this.linearGeom, index);
					})(...args);
				case 2:
					return ((...args) => {
						let [index, resolveLower] = args;
						return LengthLocationMap.getLocation(this.linearGeom, index, resolveLower);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	project(pt) {
		return LengthIndexOfPoint.indexOf(this.linearGeom, pt);
	}
	positiveIndex(index) {
		if (index >= 0.0) return index;
		return this.linearGeom.getLength() + index;
	}
	extractPoint(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [index] = args;
						var loc = LengthLocationMap.getLocation(this.linearGeom, index);
						return loc.getCoordinate(this.linearGeom);
					})(...args);
				case 2:
					return ((...args) => {
						let [index, offsetDistance] = args;
						var loc = LengthLocationMap.getLocation(this.linearGeom, index);
						var locLow = loc.toLowest(this.linearGeom);
						return locLow.getSegment(this.linearGeom).pointAlongOffset(locLow.getSegmentFraction(), offsetDistance);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	isValidIndex(index) {
		return index >= this.getStartIndex() && index <= this.getEndIndex();
	}
	getEndIndex() {
		return this.linearGeom.getLength();
	}
	getStartIndex() {
		return 0.0;
	}
	indexOfAfter(pt, minIndex) {
		return LengthIndexOfPoint.indexOfAfter(this.linearGeom, pt, minIndex);
	}
	extractLine(startIndex, endIndex) {
		var lil = new LocationIndexedLine(this.linearGeom);
		var startIndex2 = this.clampIndex(startIndex);
		var endIndex2 = this.clampIndex(endIndex);
		var resolveStartLower = startIndex2 === endIndex2;
		var startLoc = this.locationOf(startIndex2, resolveStartLower);
		var endLoc = this.locationOf(endIndex2);
		return ExtractLineByLocation.extract(this.linearGeom, startLoc, endLoc);
	}
	indexOf(pt) {
		return LengthIndexOfPoint.indexOf(this.linearGeom, pt);
	}
	indicesOf(subLine) {
		var locIndex = LocationIndexOfLine.indicesOf(this.linearGeom, subLine);
		var index = [LengthLocationMap.getLength(this.linearGeom, locIndex[0]), LengthLocationMap.getLength(this.linearGeom, locIndex[1])];
		return index;
	}
	getClass() {
		return LengthIndexedLine;
	}
}

