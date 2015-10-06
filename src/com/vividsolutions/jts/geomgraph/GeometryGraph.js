import PointLocator from 'com/vividsolutions/jts/algorithm/PointLocator';
import Location from 'com/vividsolutions/jts/geom/Location';
import LineString from 'com/vividsolutions/jts/geom/LineString';
import HashMap from 'java/util/HashMap';
import CGAlgorithms from 'com/vividsolutions/jts/algorithm/CGAlgorithms';
import Position from 'com/vividsolutions/jts/geomgraph/Position';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import Point from 'com/vividsolutions/jts/geom/Point';
import Polygon from 'com/vividsolutions/jts/geom/Polygon';
import MultiPoint from 'com/vividsolutions/jts/geom/MultiPoint';
import SimpleMCSweepLineIntersector from 'com/vividsolutions/jts/geomgraph/index/SimpleMCSweepLineIntersector';
import LinearRing from 'com/vividsolutions/jts/geom/LinearRing';
import BoundaryNodeRule from 'com/vividsolutions/jts/algorithm/BoundaryNodeRule';
import SegmentIntersector from 'com/vividsolutions/jts/geomgraph/index/SegmentIntersector';
import MultiPolygon from 'com/vividsolutions/jts/geom/MultiPolygon';
import Label from 'com/vividsolutions/jts/geomgraph/Label';
import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
import CoordinateArrays from 'com/vividsolutions/jts/geom/CoordinateArrays';
import Polygonal from 'com/vividsolutions/jts/geom/Polygonal';
import IndexedPointInAreaLocator from 'com/vividsolutions/jts/algorithm/locate/IndexedPointInAreaLocator';
import Assert from 'com/vividsolutions/jts/util/Assert';
import Edge from 'com/vividsolutions/jts/geomgraph/Edge';
import MultiLineString from 'com/vividsolutions/jts/geom/MultiLineString';
import PlanarGraph from 'com/vividsolutions/jts/geomgraph/PlanarGraph';
export default class GeometryGraph extends PlanarGraph {
	constructor(...args) {
		super();
		(() => {
			this.parentGeom = null;
			this.lineEdgeMap = new HashMap();
			this.boundaryNodeRule = null;
			this.useBoundaryDeterminationRule = true;
			this.argIndex = null;
			this.boundaryNodes = null;
			this.hasTooFewPoints = false;
			this.invalidPoint = null;
			this.areaPtLocator = null;
			this.ptLocator = new PointLocator();
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [argIndex, parentGeom] = args;
						overloads.call(this, argIndex, parentGeom, BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE);
					})(...args);
				case 3:
					return ((...args) => {
						let [argIndex, parentGeom, boundaryNodeRule] = args;
						this.argIndex = argIndex;
						this.parentGeom = parentGeom;
						this.boundaryNodeRule = boundaryNodeRule;
						if (parentGeom !== null) {
							this.add(parentGeom);
						}
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static determineBoundary(boundaryNodeRule, boundaryCount) {
		return boundaryNodeRule.isInBoundary(boundaryCount) ? Location.BOUNDARY : Location.INTERIOR;
	}
	insertBoundaryPoint(argIndex, coord) {
		var n = this.nodes.addNode(coord);
		var lbl = n.getLabel();
		var boundaryCount = 1;
		var loc = Location.NONE;
		loc = lbl.getLocation(argIndex, Position.ON);
		if (loc === Location.BOUNDARY) boundaryCount++;
		var newLoc = GeometryGraph.determineBoundary(this.boundaryNodeRule, boundaryCount);
		lbl.setLocation(argIndex, newLoc);
	}
	computeSelfNodes(li, computeRingSelfNodes) {
		var si = new SegmentIntersector(li, true, false);
		var esi = this.createEdgeSetIntersector();
		if (!computeRingSelfNodes && (this.parentGeom instanceof LinearRing || this.parentGeom instanceof Polygon || this.parentGeom instanceof MultiPolygon)) {
			esi.computeIntersections(this.edges, si, false);
		} else {
			esi.computeIntersections(this.edges, si, true);
		}
		this.addSelfIntersectionNodes(this.argIndex);
		return si;
	}
	computeSplitEdges(edgelist) {
		for (var i = this.edges.iterator(); i.hasNext(); ) {
			var e = i.next();
			e.eiList.addSplitEdges(edgelist);
		}
	}
	computeEdgeIntersections(g, li, includeProper) {
		var si = new SegmentIntersector(li, includeProper, true);
		si.setBoundaryNodes(this.getBoundaryNodes(), g.getBoundaryNodes());
		var esi = this.createEdgeSetIntersector();
		esi.computeIntersections(this.edges, g.edges, si);
		return si;
	}
	getGeometry() {
		return this.parentGeom;
	}
	getBoundaryNodeRule() {
		return this.boundaryNodeRule;
	}
	hasTooFewPoints() {
		return this.hasTooFewPoints;
	}
	addPoint(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Coordinate) {
						return ((...args) => {
							let [pt] = args;
							this.insertPoint(this.argIndex, pt, Location.INTERIOR);
						})(...args);
					} else if (args[0] instanceof Point) {
						return ((...args) => {
							let [p] = args;
							var coord = p.getCoordinate();
							this.insertPoint(this.argIndex, coord, Location.INTERIOR);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	addPolygon(p) {
		this.addPolygonRing(p.getExteriorRing(), Location.EXTERIOR, Location.INTERIOR);
		for (var i = 0; i < p.getNumInteriorRing(); i++) {
			var hole = p.getInteriorRingN(i);
			this.addPolygonRing(hole, Location.INTERIOR, Location.EXTERIOR);
		}
	}
	addEdge(e) {
		this.insertEdge(e);
		var coord = e.getCoordinates();
		this.insertPoint(this.argIndex, coord[0], Location.BOUNDARY);
		this.insertPoint(this.argIndex, coord[coord.length - 1], Location.BOUNDARY);
	}
	addLineString(line) {
		var coord = CoordinateArrays.removeRepeatedPoints(line.getCoordinates());
		if (coord.length < 2) {
			this.hasTooFewPoints = true;
			this.invalidPoint = coord[0];
			return null;
		}
		var e = new Edge(coord, new Label(this.argIndex, Location.INTERIOR));
		this.lineEdgeMap.put(line, e);
		this.insertEdge(e);
		Assert.isTrue(coord.length >= 2, "found LineString with single point");
		this.insertBoundaryPoint(this.argIndex, coord[0]);
		this.insertBoundaryPoint(this.argIndex, coord[coord.length - 1]);
	}
	getInvalidPoint() {
		return this.invalidPoint;
	}
	getBoundaryPoints() {
		var coll = this.getBoundaryNodes();
		var pts = new Array(coll.size());
		var i = 0;
		for (var it = coll.iterator(); it.hasNext(); ) {
			var node = it.next();
			pts[i++] = node.getCoordinate().clone();
		}
		return pts;
	}
	getBoundaryNodes() {
		if (this.boundaryNodes === null) this.boundaryNodes = this.nodes.getBoundaryNodes(this.argIndex);
		return this.boundaryNodes;
	}
	addSelfIntersectionNode(argIndex, coord, loc) {
		if (this.isBoundaryNode(argIndex, coord)) return null;
		if (loc === Location.BOUNDARY && this.useBoundaryDeterminationRule) this.insertBoundaryPoint(argIndex, coord); else this.insertPoint(argIndex, coord, loc);
	}
	addPolygonRing(lr, cwLeft, cwRight) {
		if (lr.isEmpty()) return null;
		var coord = CoordinateArrays.removeRepeatedPoints(lr.getCoordinates());
		if (coord.length < 4) {
			this.hasTooFewPoints = true;
			this.invalidPoint = coord[0];
			return null;
		}
		var left = cwLeft;
		var right = cwRight;
		if (CGAlgorithms.isCCW(coord)) {
			left = cwRight;
			right = cwLeft;
		}
		var e = new Edge(coord, new Label(this.argIndex, Location.BOUNDARY, left, right));
		this.lineEdgeMap.put(lr, e);
		this.insertEdge(e);
		this.insertPoint(this.argIndex, coord[0], Location.BOUNDARY);
	}
	insertPoint(argIndex, coord, onLocation) {
		var n = this.nodes.addNode(coord);
		var lbl = n.getLabel();
		if (lbl === null) {
			n.label = new Label(argIndex, onLocation);
		} else lbl.setLocation(argIndex, onLocation);
	}
	createEdgeSetIntersector() {
		return new SimpleMCSweepLineIntersector();
	}
	addSelfIntersectionNodes(argIndex) {
		for (var i = this.edges.iterator(); i.hasNext(); ) {
			var e = i.next();
			var eLoc = e.getLabel().getLocation(argIndex);
			for (var eiIt = e.eiList.iterator(); eiIt.hasNext(); ) {
				var ei = eiIt.next();
				this.addSelfIntersectionNode(argIndex, ei.coord, eLoc);
			}
		}
	}
	add(g) {
		if (g.isEmpty()) return null;
		if (g instanceof MultiPolygon) this.useBoundaryDeterminationRule = false;
		if (g instanceof Polygon) this.addPolygon(g); else if (g instanceof LineString) this.addLineString(g); else if (g instanceof Point) this.addPoint(g); else if (g instanceof MultiPoint) this.addCollection(g); else if (g instanceof MultiLineString) this.addCollection(g); else if (g instanceof MultiPolygon) this.addCollection(g); else if (g instanceof GeometryCollection) this.addCollection(g); else throw new UnsupportedOperationException(g.getClass().getName());
	}
	addCollection(gc) {
		for (var i = 0; i < gc.getNumGeometries(); i++) {
			var g = gc.getGeometryN(i);
			this.add(g);
		}
	}
	locate(pt) {
		if (this.parentGeom instanceof Polygonal && this.parentGeom.getNumGeometries() > 50) {
			if (this.areaPtLocator === null) {
				this.areaPtLocator = new IndexedPointInAreaLocator(this.parentGeom);
			}
			return this.areaPtLocator.locate(pt);
		}
		return this.ptLocator.locate(pt, this.parentGeom);
	}
	findEdge(line) {
		return this.lineEdgeMap.get(line);
	}
	getClass() {
		return GeometryGraph;
	}
}

