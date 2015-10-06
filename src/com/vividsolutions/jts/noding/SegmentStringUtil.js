import NodedSegmentString from 'com/vividsolutions/jts/noding/NodedSegmentString';
import ArrayList from 'java/util/ArrayList';
import LinearComponentExtracter from 'com/vividsolutions/jts/geom/util/LinearComponentExtracter';
export default class SegmentStringUtil {
	get interfaces_() {
		return [];
	}
	static toGeometry(segStrings, geomFact) {
		var lines = [];
		var index = 0;
		for (var i = segStrings.iterator(); i.hasNext(); ) {
			var ss = i.next();
			var line = geomFact.createLineString(ss.getCoordinates());
			lines[index++] = line;
		}
		if (lines.length === 1) return lines[0];
		return geomFact.createMultiLineString(lines);
	}
	static extractNodedSegmentStrings(geom) {
		var segStr = new ArrayList();
		var lines = LinearComponentExtracter.getLines(geom);
		for (var i = lines.iterator(); i.hasNext(); ) {
			var line = i.next();
			var pts = line.getCoordinates();
			segStr.add(new NodedSegmentString(pts, geom));
		}
		return segStr;
	}
	static extractSegmentStrings(geom) {
		return SegmentStringUtil.extractNodedSegmentStrings(geom);
	}
	static toString(segStrings) {
		var buf = new StringBuffer();
		for (var i = segStrings.iterator(); i.hasNext(); ) {
			var segStr = i.next();
			buf.append(segStr.toString());
			buf.append("\n");
		}
		return buf.toString();
	}
}

