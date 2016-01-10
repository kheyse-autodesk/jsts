import Location from '../geom/Location';
import Label from './Label';
import GraphComponent from './GraphComponent';
export default class Node extends GraphComponent {
	constructor(...args) {
		super();
		(() => {
			this.coord = null;
			this.edges = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [coord, edges] = args;
						this.coord = coord;
						this.edges = edges;
						this.label = new Label(0, Location.NONE);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	isIncidentEdgeInResult() {
		for (var it = this.getEdges().getEdges().iterator(); it.hasNext(); ) {
			var de = it.next();
			if (de.getEdge().isInResult()) return true;
		}
		return false;
	}
	isIsolated() {
		return this.label.getGeometryCount() === 1;
	}
	getCoordinate() {
		return this.coord;
	}
	print(out) {
		out.println("node " + this.coord + " lbl: " + this.label);
	}
	computeIM(im) {}
	computeMergedLocation(label2, eltIndex) {
		var loc = Location.NONE;
		loc = this.label.getLocation(eltIndex);
		if (!label2.isNull(eltIndex)) {
			var nLoc = label2.getLocation(eltIndex);
			if (loc !== Location.BOUNDARY) loc = nLoc;
		}
		return loc;
	}
	setLabel(argIndex, onLocation) {
		if (this.label === null) {
			this.label = new Label(argIndex, onLocation);
		} else this.label.setLocation(argIndex, onLocation);
	}
	getEdges() {
		return this.edges;
	}
	mergeLabel(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Label) {
						return ((...args) => {
							let [label2] = args;
							for (var i = 0; i < 2; i++) {
								var loc = this.computeMergedLocation(label2, i);
								var thisLoc = this.label.getLocation(i);
								if (thisLoc === Location.NONE) this.label.setLocation(i, loc);
							}
						})(...args);
					} else if (args[0] instanceof Node) {
						return ((...args) => {
							let [n] = args;
							this.mergeLabel(n.label);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	add(e) {
		this.edges.insert(e);
		e.setNode(this);
	}
	setLabelBoundary(argIndex) {
		if (this.label === null) return null;
		var loc = Location.NONE;
		if (this.label !== null) loc = this.label.getLocation(argIndex);
		var newLoc = null;
		switch (loc) {
			case Location.BOUNDARY:
				newLoc = Location.INTERIOR;
				break;
			case Location.INTERIOR:
				newLoc = Location.BOUNDARY;
				break;
			default:
				newLoc = Location.BOUNDARY;
				break;
		}
		this.label.setLocation(argIndex, newLoc);
	}
	getClass() {
		return Node;
	}
}

