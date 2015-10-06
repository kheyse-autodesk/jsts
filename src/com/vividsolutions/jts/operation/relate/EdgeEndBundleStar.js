import EdgeEndStar from 'com/vividsolutions/jts/geomgraph/EdgeEndStar';
import EdgeEndBundle from 'com/vividsolutions/jts/operation/relate/EdgeEndBundle';
export default class EdgeEndBundleStar extends EdgeEndStar {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	updateIM(im) {
		for (var it = this.iterator(); it.hasNext(); ) {
			var esb = it.next();
			esb.updateIM(im);
		}
	}
	insert(e) {
		var eb = this.edgeMap.get(e);
		if (eb === null) {
			eb = new EdgeEndBundle(e);
			this.insertEdgeEnd(e, eb);
		} else {
			eb.insert(e);
		}
	}
	getClass() {
		return EdgeEndBundleStar;
	}
}

