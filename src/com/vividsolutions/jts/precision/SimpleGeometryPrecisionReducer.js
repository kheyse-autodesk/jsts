import GeometryFactory from '../geom/GeometryFactory';
import GeometryEditor from '../geom/util/GeometryEditor';
import PrecisionReducerCoordinateOperation from './PrecisionReducerCoordinateOperation';
export default class SimpleGeometryPrecisionReducer {
	constructor(...args) {
		(() => {
			this.newPrecisionModel = null;
			this.removeCollapsed = true;
			this.changePrecisionModel = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [pm] = args;
						this.newPrecisionModel = pm;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static reduce(g, precModel) {
		var reducer = new SimpleGeometryPrecisionReducer(precModel);
		return reducer.reduce(g);
	}
	reduce(geom) {
		var geomEdit = null;
		if (this.changePrecisionModel) {
			var newFactory = new GeometryFactory(this.newPrecisionModel, geom.getFactory().getSRID());
			geomEdit = new GeometryEditor(newFactory);
		} else geomEdit = new GeometryEditor();
		return geomEdit.edit(geom, new PrecisionReducerCoordinateOperation());
	}
	setChangePrecisionModel(changePrecisionModel) {
		this.changePrecisionModel = changePrecisionModel;
	}
	setRemoveCollapsedComponents(removeCollapsed) {
		this.removeCollapsed = removeCollapsed;
	}
	getClass() {
		return SimpleGeometryPrecisionReducer;
	}
}

