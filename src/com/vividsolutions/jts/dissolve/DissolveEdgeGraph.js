import EdgeGraph from 'com/vividsolutions/jts/edgegraph/EdgeGraph';
import DissolveHalfEdge from 'com/vividsolutions/jts/dissolve/DissolveHalfEdge';
export default class DissolveEdgeGraph extends EdgeGraph {
	get interfaces_() {
		return [];
	}
	createEdge(p0) {
		return new DissolveHalfEdge(p0);
	}
}

