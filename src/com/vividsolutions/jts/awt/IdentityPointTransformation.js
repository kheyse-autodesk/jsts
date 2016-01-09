import PointTransformation from './PointTransformation';
export default class IdentityPointTransformation {
	get interfaces_() {
		return [PointTransformation];
	}
	transform(model, view) {
		view.setLocation(model.x, model.y);
	}
	getClass() {
		return IdentityPointTransformation;
	}
}

