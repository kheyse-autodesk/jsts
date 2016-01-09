import PreparedPolygonIntersects from './PreparedPolygonIntersects';
import FastSegmentSetIntersectionFinder from '../../noding/FastSegmentSetIntersectionFinder';
import SegmentStringUtil from '../../noding/SegmentStringUtil';
import PreparedPolygonContainsProperly from './PreparedPolygonContainsProperly';
import PreparedPolygonContains from './PreparedPolygonContains';
import PreparedPolygonCovers from './PreparedPolygonCovers';
import BasicPreparedGeometry from './BasicPreparedGeometry';
import IndexedPointInAreaLocator from '../../algorithm/locate/IndexedPointInAreaLocator';
import RectangleContains from '../../operation/predicate/RectangleContains';
import RectangleIntersects from '../../operation/predicate/RectangleIntersects';
export default class PreparedPolygon extends BasicPreparedGeometry {
	constructor(...args) {
		super();
		(() => {
			this.isRectangle = null;
			this.segIntFinder = null;
			this.pia = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [poly] = args;
						super(poly);
						this.isRectangle = this.getGeometry().isRectangle();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	containsProperly(g) {
		if (!this.envelopeCovers(g)) return false;
		return PreparedPolygonContainsProperly.containsProperly(this, g);
	}
	getPointLocator() {
		if (this.pia === null) this.pia = new IndexedPointInAreaLocator(this.getGeometry());
		return this.pia;
	}
	covers(g) {
		if (!this.envelopeCovers(g)) return false;
		if (this.isRectangle) {
			return true;
		}
		return PreparedPolygonCovers.covers(this, g);
	}
	intersects(g) {
		if (!this.envelopesIntersect(g)) return false;
		if (this.isRectangle) {
			return RectangleIntersects.intersects(this.getGeometry(), g);
		}
		return PreparedPolygonIntersects.intersects(this, g);
	}
	contains(g) {
		if (!this.envelopeCovers(g)) return false;
		if (this.isRectangle) {
			return RectangleContains.contains(this.getGeometry(), g);
		}
		return PreparedPolygonContains.contains(this, g);
	}
	getIntersectionFinder() {
		if (this.segIntFinder === null) this.segIntFinder = new FastSegmentSetIntersectionFinder(SegmentStringUtil.extractSegmentStrings(this.getGeometry()));
		return this.segIntFinder;
	}
	getClass() {
		return PreparedPolygon;
	}
}

