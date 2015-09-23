function TaggedLinesSimplifier() {
	this.inputIndex = new LineSegmentIndex();
	this.outputIndex = new LineSegmentIndex();
	this.distanceTolerance = 0.0;
	if (arguments.length === 0) return;
}
module.exports = TaggedLinesSimplifier
var TaggedLineStringSimplifier = require('com/vividsolutions/jts/simplify/TaggedLineStringSimplifier');
var LineSegmentIndex = require('com/vividsolutions/jts/simplify/LineSegmentIndex');
TaggedLinesSimplifier.prototype.setDistanceTolerance = function (distanceTolerance) {
	this.distanceTolerance = distanceTolerance;
};
TaggedLinesSimplifier.prototype.simplify = function (taggedLines) {
	for (var i = taggedLines.iterator(); i.hasNext(); ) {
		this.inputIndex.add(i.next());
	}
	for (var i = taggedLines.iterator(); i.hasNext(); ) {
		var tlss = new TaggedLineStringSimplifier(this.inputIndex, this.outputIndex);
		tlss.setDistanceTolerance(this.distanceTolerance);
		tlss.simplify(i.next());
	}
};

