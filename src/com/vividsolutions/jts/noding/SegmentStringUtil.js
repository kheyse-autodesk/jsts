function SegmentStringUtil() {}
module.exports = SegmentStringUtil
var NodedSegmentString = require('com/vividsolutions/jts/noding/NodedSegmentString');
var ArrayList = require('java/util/ArrayList');
var LinearComponentExtracter = require('com/vividsolutions/jts/geom/util/LinearComponentExtracter');
SegmentStringUtil.toGeometry = function (segStrings, geomFact) {
	var lines = [];
	var index = 0;
	for (var i = segStrings.iterator(); i.hasNext(); ) {
		var ss = i.next();
		var line = geomFact.createLineString(ss.getCoordinates());
		lines[index++] = line;
	}
	if (lines.length === 1) return lines[0];
	return geomFact.createMultiLineString(lines);
};
SegmentStringUtil.extractNodedSegmentStrings = function (geom) {
	var segStr = new ArrayList();
	var lines = LinearComponentExtracter.getLines(geom);
	for (var i = lines.iterator(); i.hasNext(); ) {
		var line = i.next();
		var pts = line.getCoordinates();
		segStr.add(new NodedSegmentString(pts, geom));
	}
	return segStr;
};
SegmentStringUtil.extractSegmentStrings = function (geom) {
	return SegmentStringUtil.extractNodedSegmentStrings(geom);
};
SegmentStringUtil.toString = function (segStrings) {
	var buf = new StringBuffer();
	for (var i = segStrings.iterator(); i.hasNext(); ) {
		var segStr = i.next();
		buf.append(segStr.toString());
		buf.append("\n");
	}
	return buf.toString();
};

