import Double from 'java/lang/Double';
import CoordinateSequence from 'com/vividsolutions/jts/geom/CoordinateSequence';
export default class CoordinateSequences {
	get interfaces_() {
		return [];
	}
	static copyCoord(src, srcPos, dest, destPos) {
		var minDim = Math.min(src.getDimension(), dest.getDimension());
		for (var dim = 0; dim < minDim; dim++) {
			dest.setOrdinate(destPos, dim, src.getOrdinate(srcPos, dim));
		}
	}
	static isRing(seq) {
		var n = seq.size();
		if (n === 0) return true;
		if (n <= 3) return false;
		return seq.getOrdinate(0, CoordinateSequence.X) === seq.getOrdinate(n - 1, CoordinateSequence.X) && seq.getOrdinate(0, CoordinateSequence.Y) === seq.getOrdinate(n - 1, CoordinateSequence.Y);
	}
	static isEqual(cs1, cs2) {
		var cs1Size = cs1.size();
		var cs2Size = cs2.size();
		if (cs1Size !== cs2Size) return false;
		var dim = Math.min(cs1.getDimension(), cs2.getDimension());
		for (var i = 0; i < cs1Size; i++) {
			for (var d = 0; d < dim; d++) {
				var v1 = cs1.getOrdinate(i, d);
				var v2 = cs2.getOrdinate(i, d);
				if (cs1.getOrdinate(i, d) === cs2.getOrdinate(i, d)) continue;
				if (Double.isNaN(v1) && Double.isNaN(v2)) continue;
				return false;
			}
		}
		return true;
	}
	static extend(fact, seq, size) {
		var newseq = fact.create(size, seq.getDimension());
		var n = seq.size();
		CoordinateSequences.copy(seq, 0, newseq, 0, n);
		if (n > 0) {
			for (var i = n; i < size; i++) CoordinateSequences.copy(seq, n - 1, newseq, i, 1);
		}
		return newseq;
	}
	static reverse(seq) {
		var last = seq.size() - 1;
		var mid = last / 2;
		for (var i = 0; i <= mid; i++) {
			CoordinateSequences.swap(seq, i, last - i);
		}
	}
	static swap(seq, i, j) {
		if (i === j) return null;
		for (var dim = 0; dim < seq.getDimension(); dim++) {
			var tmp = seq.getOrdinate(i, dim);
			seq.setOrdinate(i, dim, seq.getOrdinate(j, dim));
			seq.setOrdinate(j, dim, tmp);
		}
	}
	static copy(src, srcPos, dest, destPos, length) {
		for (var i = 0; i < length; i++) {
			CoordinateSequences.copyCoord(src, srcPos + i, dest, destPos + i);
		}
	}
	static ensureValidRing(fact, seq) {
		var n = seq.size();
		if (n === 0) return seq;
		if (n <= 3) return CoordinateSequences.createClosedRing(fact, seq, 4);
		var isClosed = seq.getOrdinate(0, CoordinateSequence.X) === seq.getOrdinate(n - 1, CoordinateSequence.X) && seq.getOrdinate(0, CoordinateSequence.Y) === seq.getOrdinate(n - 1, CoordinateSequence.Y);
		if (isClosed) return seq;
		return CoordinateSequences.createClosedRing(fact, seq, n + 1);
	}
	static createClosedRing(fact, seq, size) {
		var newseq = fact.create(size, seq.getDimension());
		var n = seq.size();
		CoordinateSequences.copy(seq, 0, newseq, 0, n);
		for (var i = n; i < size; i++) CoordinateSequences.copy(seq, 0, newseq, i, 1);
		return newseq;
	}
}

