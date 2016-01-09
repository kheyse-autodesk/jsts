import Assert from '../util/Assert';
export default class GraphComponent {
	constructor(...args) {
		(() => {
			this.label = null;
			this.isInResult = false;
			this.isCovered = false;
			this.isCoveredSet = false;
			this.isVisited = false;
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
		this.isVisited = isVisited;
	}
	setInResult(isInResult) {
		this.isInResult = isInResult;
	}
	isCovered() {
		return this.isCovered;
	}
	isCoveredSet() {
		return this.isCoveredSet;
	}
	setLabel(label) {
		this.label = label;
	}
	getLabel() {
		return this.label;
	}
	setCovered(isCovered) {
		this.isCovered = isCovered;
		this.isCoveredSet = true;
	}
	updateIM(im) {
		Assert.isTrue(this.label.getGeometryCount() >= 2, "found partial label");
		this.computeIM(im);
	}
	isInResult() {
		return this.isInResult;
	}
	isVisited() {
		return this.isVisited;
	}
	getClass() {
		return GraphComponent;
	}
}

