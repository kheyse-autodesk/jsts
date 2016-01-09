export default class GMLConstants {
	get interfaces_() {
		return [];
	}
	static get GML_NAMESPACE() {
		return "http://www.opengis.net/gml";
	}
	static get GML_PREFIX() {
		return "gml";
	}
	static get GML_ATTR_SRSNAME() {
		return "srsName";
	}
	static get GML_GEOMETRY_MEMBER() {
		return "geometryMember";
	}
	static get GML_POINT_MEMBER() {
		return "pointMember";
	}
	static get GML_POLYGON_MEMBER() {
		return "polygonMember";
	}
	static get GML_LINESTRING_MEMBER() {
		return "lineStringMember";
	}
	static get GML_OUTER_BOUNDARY_IS() {
		return "outerBoundaryIs";
	}
	static get GML_INNER_BOUNDARY_IS() {
		return "innerBoundaryIs";
	}
	static get GML_POINT() {
		return "Point";
	}
	static get GML_LINESTRING() {
		return "LineString";
	}
	static get GML_LINEARRING() {
		return "LinearRing";
	}
	static get GML_POLYGON() {
		return "Polygon";
	}
	static get GML_BOX() {
		return "Box";
	}
	static get GML_MULTI_GEOMETRY() {
		return "MultiGeometry";
	}
	static get GML_MULTI_POINT() {
		return "MultiPoint";
	}
	static get GML_MULTI_LINESTRING() {
		return "MultiLineString";
	}
	static get GML_MULTI_POLYGON() {
		return "MultiPolygon";
	}
	static get GML_COORDINATES() {
		return "coordinates";
	}
	static get GML_COORD() {
		return "coord";
	}
	static get GML_COORD_X() {
		return "X";
	}
	static get GML_COORD_Y() {
		return "Y";
	}
	static get GML_COORD_Z() {
		return "Z";
	}
	getClass() {
		return GMLConstants;
	}
}

