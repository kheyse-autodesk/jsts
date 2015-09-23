function BoundaryNodeRule() {}
module.exports = BoundaryNodeRule
BoundaryNodeRule.prototype.isInBoundary = function (boundaryCount) {};
function Mod2BoundaryNodeRule() {}
Mod2BoundaryNodeRule.prototype.isInBoundary = function (boundaryCount) {
	return boundaryCount % 2 === 1;
};
BoundaryNodeRule.Mod2BoundaryNodeRule = Mod2BoundaryNodeRule;
function EndPointBoundaryNodeRule() {}
EndPointBoundaryNodeRule.prototype.isInBoundary = function (boundaryCount) {
	return boundaryCount > 0;
};
BoundaryNodeRule.EndPointBoundaryNodeRule = EndPointBoundaryNodeRule;
function MultiValentEndPointBoundaryNodeRule() {}
MultiValentEndPointBoundaryNodeRule.prototype.isInBoundary = function (boundaryCount) {
	return boundaryCount > 1;
};
BoundaryNodeRule.MultiValentEndPointBoundaryNodeRule = MultiValentEndPointBoundaryNodeRule;
function MonoValentEndPointBoundaryNodeRule() {}
MonoValentEndPointBoundaryNodeRule.prototype.isInBoundary = function (boundaryCount) {
	return boundaryCount === 1;
};
BoundaryNodeRule.MonoValentEndPointBoundaryNodeRule = MonoValentEndPointBoundaryNodeRule;
BoundaryNodeRule.MOD2_BOUNDARY_RULE = new Mod2BoundaryNodeRule();
BoundaryNodeRule.ENDPOINT_BOUNDARY_RULE = new EndPointBoundaryNodeRule();
BoundaryNodeRule.MULTIVALENT_ENDPOINT_BOUNDARY_RULE = new MultiValentEndPointBoundaryNodeRule();
BoundaryNodeRule.MONOVALENT_ENDPOINT_BOUNDARY_RULE = new MonoValentEndPointBoundaryNodeRule();
BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE = BoundaryNodeRule.MOD2_BOUNDARY_RULE;

