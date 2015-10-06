export default class BoundaryNodeRule {
	get interfaces_() {
		return [];
	}
	static get MOD2_BOUNDARY_RULE() {
		return new Mod2BoundaryNodeRule();
	}
	static get ENDPOINT_BOUNDARY_RULE() {
		return new EndPointBoundaryNodeRule();
	}
	static get MULTIVALENT_ENDPOINT_BOUNDARY_RULE() {
		return new MultiValentEndPointBoundaryNodeRule();
	}
	static get MONOVALENT_ENDPOINT_BOUNDARY_RULE() {
		return new MonoValentEndPointBoundaryNodeRule();
	}
	static get OGC_SFS_BOUNDARY_RULE() {
		return BoundaryNodeRule.MOD2_BOUNDARY_RULE;
	}
	static get Mod2BoundaryNodeRule() {
		return Mod2BoundaryNodeRule;
	}
	static get EndPointBoundaryNodeRule() {
		return EndPointBoundaryNodeRule;
	}
	static get MultiValentEndPointBoundaryNodeRule() {
		return MultiValentEndPointBoundaryNodeRule;
	}
	static get MonoValentEndPointBoundaryNodeRule() {
		return MonoValentEndPointBoundaryNodeRule;
	}
	isInBoundary(boundaryCount) {}
}
class Mod2BoundaryNodeRule {
	get interfaces_() {
		return [BoundaryNodeRule];
	}
	isInBoundary(boundaryCount) {
		return boundaryCount % 2 === 1;
	}
}
class EndPointBoundaryNodeRule {
	get interfaces_() {
		return [BoundaryNodeRule];
	}
	isInBoundary(boundaryCount) {
		return boundaryCount > 0;
	}
}
class MultiValentEndPointBoundaryNodeRule {
	get interfaces_() {
		return [BoundaryNodeRule];
	}
	isInBoundary(boundaryCount) {
		return boundaryCount > 1;
	}
}
class MonoValentEndPointBoundaryNodeRule {
	get interfaces_() {
		return [BoundaryNodeRule];
	}
	isInBoundary(boundaryCount) {
		return boundaryCount === 1;
	}
}

