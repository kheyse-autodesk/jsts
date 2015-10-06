import HashMap from 'java/util/HashMap';
import TaggedLinesSimplifier from 'com/vividsolutions/jts/simplify/TaggedLinesSimplifier';
export default class TopologyPreservingSimplifier {
	constructor(...args) {
		(() => {
			this.inputGeom = null;
			this.lineSimplifier = new TaggedLinesSimplifier();
			this.linestringMap = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [inputGeom] = args;
						this.inputGeom = inputGeom;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static simplify(geom, distanceTolerance) {
		var tss = new TopologyPreservingSimplifier(geom);
		tss.setDistanceTolerance(distanceTolerance);
		return tss.getResultGeometry();
	}
	getResultGeometry() {
		if (this.inputGeom.isEmpty()) return this.inputGeom.clone();
		this.linestringMap = new HashMap();
		this.inputGeom.apply(new LineStringMapBuilderFilter());
		this.lineSimplifier.simplify(this.linestringMap.values());
		var result = new LineStringTransformer().transform(this.inputGeom);
		return result;
	}
	setDistanceTolerance(distanceTolerance) {
		if (distanceTolerance < 0.0) throw new IllegalArgumentException("Tolerance must be non-negative");
		this.lineSimplifier.setDistanceTolerance(distanceTolerance);
	}
	getClass() {
		return TopologyPreservingSimplifier;
	}
}

