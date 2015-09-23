function FacetSequenceTreeBuilder() {}
module.exports = FacetSequenceTreeBuilder
var FacetSequence = require('com/vividsolutions/jts/operation/distance/FacetSequence');
var STRtree = require('com/vividsolutions/jts/index/strtree/STRtree');
var GeometryComponentFilter = require('com/vividsolutions/jts/geom/GeometryComponentFilter');
var ArrayList = require('java/util/ArrayList');
FacetSequenceTreeBuilder.addFacetSequences = function (pts, sections) {
	var i = 0;
	var size = pts.size();
	while (i <= size - 1) {
		var end = i + FacetSequenceTreeBuilder.FACET_SEQUENCE_SIZE + 1;
		if (end >= size - 1) end = size;
		var sect = new FacetSequence(pts, i, end);
		sections.add(sect);
		i = i + FacetSequenceTreeBuilder.FACET_SEQUENCE_SIZE;
	}
};
FacetSequenceTreeBuilder.computeFacetSequences = function (g) {
	var sections = new ArrayList();
	g.apply(new GeometryComponentFilter());
	return sections;
};
FacetSequenceTreeBuilder.build = function (g) {
	var tree = new STRtree(FacetSequenceTreeBuilder.STR_TREE_NODE_CAPACITY);
	var sections = FacetSequenceTreeBuilder.computeFacetSequences(g);
	for (var i = sections.iterator(); i.hasNext(); ) {
		var section = i.next();
		tree.insert(section.getEnvelope(), section);
	}
	tree.build();
	return tree;
};
FacetSequenceTreeBuilder.FACET_SEQUENCE_SIZE = 6;
FacetSequenceTreeBuilder.STR_TREE_NODE_CAPACITY = 4;

