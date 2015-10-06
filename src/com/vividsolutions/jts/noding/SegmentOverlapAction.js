import MonotoneChainOverlapAction from 'com/vividsolutions/jts/index/chain/MonotoneChainOverlapAction';
export default class SegmentOverlapAction extends MonotoneChainOverlapAction {
	constructor(...args) {
		super();
		(() => {
			this.si = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [si] = args;
						this.si = si;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	overlap(mc1, start1, mc2, start2) {
		var ss1 = mc1.getContext();
		var ss2 = mc2.getContext();
		this.si.processIntersections(ss1, start1, ss2, start2);
	}
}

