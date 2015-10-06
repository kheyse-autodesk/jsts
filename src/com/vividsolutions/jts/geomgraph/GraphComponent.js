import Assert from 'com/vividsolutions/jts/util/Assert';
export default class GraphComponent {
	constructor(...args) {
		(() => {
			this.label = null;
			this.inResult = false;
			this.covered = false;
			this.coveredSet = false;
			this.visited = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 1:
					return ((...args) => {
						let [label] = args;
						this.label = label;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	setVisited(isVisited) {
		this.visited = isVisited;
	}
	setInResult(isInResult) {
		this.inResult = isInResult;
	}
	isCovered() {
		return this.covered;
	}
	isCoveredSet() {
		return this.coveredSet;
	}
	setLabel(label) {
		this.label = label;
	}
	getLabel() {
		return this.label;
	}
	setCovered(isCovered) {
		this.covered = isCovered;
		this.coveredSet = true;
	}
	updateIM(im) {
		Assert.isTrue(this.label.getGeometryCount() >= 2, "found partial label");
		this.computeIM(im);
	}
	isInResult() {
		return this.inResult;
	}
	isVisited() {
		return this.visited;
	}
}

