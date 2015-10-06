import Boundable from 'com/vividsolutions/jts/index/strtree/Boundable';
import ArrayList from 'java/util/ArrayList';
import Serializable from 'java/io/Serializable';
import Assert from 'com/vividsolutions/jts/util/Assert';
export default class AbstractNode {
	constructor(...args) {
		(() => {
			this.childBoundables = new ArrayList();
			this.bounds = null;
			this.level = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 1:
					return ((...args) => {
						let [level] = args;
						this.level = level;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Boundable, Serializable];
	}
	static get serialVersionUID() {
		return 6493722185909573708;
	}
	getLevel() {
		return this.level;
	}
	size() {
		return this.childBoundables.size();
	}
	getChildBoundables() {
		return this.childBoundables;
	}
	addChildBoundable(childBoundable) {
		Assert.isTrue(this.bounds === null);
		this.childBoundables.add(childBoundable);
	}
	isEmpty() {
		return this.childBoundables.isEmpty();
	}
	getBounds() {
		if (this.bounds === null) {
			this.bounds = this.computeBounds();
		}
		return this.bounds;
	}
	getClass() {
		return AbstractNode;
	}
}

