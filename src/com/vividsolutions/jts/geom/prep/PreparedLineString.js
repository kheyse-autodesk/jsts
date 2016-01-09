import FastSegmentSetIntersectionFinder from '../../noding/FastSegmentSetIntersectionFinder';
import SegmentStringUtil from '../../noding/SegmentStringUtil';
import PreparedLineStringIntersects from './PreparedLineStringIntersects';
import BasicPreparedGeometry from './BasicPreparedGeometry';
export default class PreparedLineString extends BasicPreparedGeometry {
	constructor(...args) {
		super();
		(() => {
			this.segIntFinder = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [line] = args;
						super(line);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getIntersectionFinder() {
		if (this.segIntFinder === null) this.segIntFinder = new FastSegmentSetIntersectionFinder(SegmentStringUtil.extractSegmentStrings(this.getGeometry()));
		return this.segIntFinder;
	}
	intersects(g) {
		if (!this.envelopesIntersect(g)) return false;
		return PreparedLineStringIntersects.intersects(this, g);
	}
	getClass() {
		return PreparedLineString;
	}
}

