import Pattern from 'java/util/regex/Pattern';
import SAXException from 'org/xml/sax/SAXException';
import HashMap from 'java/util/HashMap';
import Coordinate from '../../geom/Coordinate';
import StringUtil from '../../util/StringUtil';
import GMLConstants from './GMLConstants';
import Double from 'java/lang/Double';
import Integer from 'java/lang/Integer';
import Envelope from '../../geom/Envelope';
export default class GeometryStrategies {
	get interfaces_() {
		return [];
	}
	static get strategies() {
		return GeometryStrategies.loadStrategies();
	}
	static get ParseStrategy() {
		return ParseStrategy;
	}
	static getSrid(attrs, defaultValue) {
		var srs = null;
		if (attrs.getIndex(GMLConstants.GML_ATTR_SRSNAME) >= 0) srs = attrs.getValue(GMLConstants.GML_ATTR_SRSNAME); else if (attrs.getIndex(GMLConstants.GML_NAMESPACE, GMLConstants.GML_ATTR_SRSNAME) >= 0) srs = attrs.getValue(GMLConstants.GML_NAMESPACE, GMLConstants.GML_ATTR_SRSNAME);
		if (srs !== null) {
			srs = srs.trim();
			if (srs !== null && !(this.name === srs)) {
				try {
					return Integer.parseInt(srs);
				} catch (e) {
					if (e instanceof NumberFormatException) {
						var index = srs.lastIndexOf('#');
						if (index > -1) srs = srs.substring(index);
						try {
							return Integer.parseInt(srs);
						} catch (e2) {
							if (e2 instanceof NumberFormatException) {} else throw e2;
						} finally {}
					} else throw e;
				} finally {}
			}
		}
		return defaultValue;
	}
	static findStrategy(uri, localName) {
		return localName === null ? null : GeometryStrategies.strategies.get(localName.toLowerCase());
	}
	static loadStrategies() {
		var strats = new HashMap();
		strats.put(GMLConstants.GML_POINT.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() !== 1) throw new SAXException("Cannot create a point without exactly one coordinate");
				var srid = GeometryStrategies.getSrid(arg.attrs, gf.getSRID());
				var c = arg.children.get(0);
				var p = null;
				if (c instanceof Coordinate) {
					p = gf.createPoint(c);
				} else {
					p = gf.createPoint(c);
				}
				if (p.getSRID() !== srid) p.setSRID(srid);
				return p;
			}
		})());
		strats.put(GMLConstants.GML_LINESTRING.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() < 1) throw new SAXException("Cannot create a linestring without atleast two coordinates or one coordinate sequence");
				var srid = GeometryStrategies.getSrid(arg.attrs, gf.getSRID());
				var ls = null;
				if (arg.children.size() === 1) {
					try {
						var cs = arg.children.get(0);
						ls = gf.createLineString(cs);
					} catch (e) {
						if (e instanceof ClassCastException) {
							throw new SAXException("Cannot create a linestring without atleast two coordinates or one coordinate sequence", e);
						} else throw e;
					} finally {}
				} else {
					try {
						var coords = arg.children.toArray(new Array(arg.children.size()));
						ls = gf.createLineString(coords);
					} catch (e) {
						if (e instanceof ClassCastException) {
							throw new SAXException("Cannot create a linestring without atleast two coordinates or one coordinate sequence", e);
						} else throw e;
					} finally {}
				}
				if (ls.getSRID() !== srid) ls.setSRID(srid);
				return ls;
			}
		})());
		strats.put(GMLConstants.GML_LINEARRING.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() !== 1 && arg.children.size() < 4) throw new SAXException("Cannot create a linear ring without atleast four coordinates or one coordinate sequence");
				var srid = GeometryStrategies.getSrid(arg.attrs, gf.getSRID());
				var ls = null;
				if (arg.children.size() === 1) {
					try {
						var cs = arg.children.get(0);
						ls = gf.createLinearRing(cs);
					} catch (e) {
						if (e instanceof ClassCastException) {
							throw new SAXException("Cannot create a linear ring without atleast four coordinates or one coordinate sequence", e);
						} else throw e;
					} finally {}
				} else {
					try {
						var coords = arg.children.toArray(new Array(arg.children.size()));
						ls = gf.createLinearRing(coords);
					} catch (e) {
						if (e instanceof ClassCastException) {
							throw new SAXException("Cannot create a linear ring without atleast four coordinates or one coordinate sequence", e);
						} else throw e;
					} finally {}
				}
				if (ls.getSRID() !== srid) ls.setSRID(srid);
				return ls;
			}
		})());
		strats.put(GMLConstants.GML_POLYGON.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() < 1) throw new SAXException("Cannot create a polygon without atleast one linear ring");
				var srid = GeometryStrategies.getSrid(arg.attrs, gf.getSRID());
				var outer = arg.children.get(0);
				var t = arg.children.size() > 1 ? arg.children.subList(1, arg.children.size()) : null;
				var inner = t === null ? null : t.toArray(new Array(t.size()));
				var p = gf.createPolygon(outer, inner);
				if (p.getSRID() !== srid) p.setSRID(srid);
				return p;
			}
		})());
		strats.put(GMLConstants.GML_BOX.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() < 1 || arg.children.size() > 2) throw new SAXException("Cannot create a box without either two coords or one coordinate sequence");
				var box = null;
				if (arg.children.size() === 1) {
					var cs = arg.children.get(0);
					box = cs.expandEnvelope(new Envelope());
				} else {
					box = new Envelope(arg.children.get(0), arg.children.get(1));
				}
				return box;
			}
		})());
		strats.put(GMLConstants.GML_MULTI_POINT.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() < 1) throw new SAXException("Cannot create a multi-point without atleast one point");
				var srid = GeometryStrategies.getSrid(arg.attrs, gf.getSRID());
				var pts = arg.children.toArray(new Array(arg.children.size()));
				var mp = gf.createMultiPoint(pts);
				if (mp.getSRID() !== srid) mp.setSRID(srid);
				return mp;
			}
		})());
		strats.put(GMLConstants.GML_MULTI_LINESTRING.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() < 1) throw new SAXException("Cannot create a multi-linestring without atleast one linestring");
				var srid = GeometryStrategies.getSrid(arg.attrs, gf.getSRID());
				var lns = arg.children.toArray(new Array(arg.children.size()));
				var mp = gf.createMultiLineString(lns);
				if (mp.getSRID() !== srid) mp.setSRID(srid);
				return mp;
			}
		})());
		strats.put(GMLConstants.GML_MULTI_POLYGON.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() < 1) throw new SAXException("Cannot create a multi-polygon without atleast one polygon");
				var srid = GeometryStrategies.getSrid(arg.attrs, gf.getSRID());
				var plys = arg.children.toArray(new Array(arg.children.size()));
				var mp = gf.createMultiPolygon(plys);
				if (mp.getSRID() !== srid) mp.setSRID(srid);
				return mp;
			}
		})());
		strats.put(GMLConstants.GML_MULTI_GEOMETRY.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() < 1) throw new SAXException("Cannot create a multi-polygon without atleast one geometry");
				var geoms = arg.children.toArray(new Array(arg.children.size()));
				var gc = gf.createGeometryCollection(geoms);
				return gc;
			}
		})());
		strats.put(GMLConstants.GML_COORDINATES.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.text === null || this.name === arg.text) throw new SAXException("Cannot create a coordinate sequence without text to parse");
				var decimal = ".";
				var coordSeperator = ",";
				var toupleSeperator = " ";
				if (arg.attrs.getIndex("decimal") >= 0) decimal = arg.attrs.getValue("decimal"); else if (arg.attrs.getIndex(GMLConstants.GML_NAMESPACE, "decimal") >= 0) decimal = arg.attrs.getValue(GMLConstants.GML_NAMESPACE, "decimal");
				if (arg.attrs.getIndex("cs") >= 0) coordSeperator = arg.attrs.getValue("cs"); else if (arg.attrs.getIndex(GMLConstants.GML_NAMESPACE, "cs") >= 0) coordSeperator = arg.attrs.getValue(GMLConstants.GML_NAMESPACE, "cs");
				if (arg.attrs.getIndex("ts") >= 0) toupleSeperator = arg.attrs.getValue("ts"); else if (arg.attrs.getIndex(GMLConstants.GML_NAMESPACE, "ts") >= 0) toupleSeperator = arg.attrs.getValue(GMLConstants.GML_NAMESPACE, "ts");
				var t = arg.text.toString();
				t = t.replaceAll("\\s", " ");
				var ptn = this.patterns.get(toupleSeperator);
				if (ptn === null) {
					var ts = new String(toupleSeperator);
					if (ts.indexOf('\\') > -1) {
						ts = ts.replaceAll("\\", "\\\\");
					}
					if (ts.indexOf('.') > -1) {
						ts = ts.replaceAll("\\.", "\\\\.");
					}
					ptn = Pattern.compile(ts);
					this.patterns.put(toupleSeperator, ptn);
				}
				var touples = ptn.split(t.trim());
				if (touples.length === 0) throw new SAXException("Cannot create a coordinate sequence without a touple to parse");
				var numNonNullTouples = 0;
				for (var i = 0; i < touples.length; i++) {
					if (touples[i] !== null && !(this.name === touples[i].trim())) {
						if (i !== numNonNullTouples) {
							touples[numNonNullTouples] = touples[i];
						}
						numNonNullTouples++;
					}
				}
				for (var i = numNonNullTouples; i < touples.length; i++) touples[i] = null;
				if (numNonNullTouples === 0) throw new SAXException("Cannot create a coordinate sequence without a non-null touple to parse");
				var dim = StringUtil.split(touples[0], coordSeperator).length;
				var cs = gf.getCoordinateSequenceFactory().create(numNonNullTouples, dim);
				dim = cs.getDimension();
				var replaceDec = !(this.name === decimal);
				for (var i = 0; i < numNonNullTouples; i++) {
					ptn = this.patterns.get(coordSeperator);
					if (ptn === null) {
						var ts = new String(coordSeperator);
						if (ts.indexOf('\\') > -1) {
							ts = ts.replaceAll("\\", "\\\\");
						}
						if (ts.indexOf('.') > -1) {
							ts = ts.replaceAll("\\.", "\\\\.");
						}
						ptn = Pattern.compile(ts);
						this.patterns.put(coordSeperator, ptn);
					}
					var coords = ptn.split(touples[i]);
					var dimIndex = 0;
					for (var j = 0; j < coords.length && j < dim; j++) {
						if (coords[j] !== null && !(this.name === coords[j].trim())) {
							var ordinate = Double.parseDouble(replaceDec ? coords[j].replaceAll(decimal, ".") : coords[j]);
							cs.setOrdinate(i, dimIndex++, ordinate);
						}
					}
					for (; dimIndex < dim; ) cs.setOrdinate(i, dimIndex++, Double.NaN);
				}
				return cs;
			}
		})());
		strats.put(GMLConstants.GML_COORD.toLowerCase(), new (class {
			parse(arg, gf) {
				if (arg.children.size() < 1) throw new SAXException("Cannot create a coordinate without atleast one axis");
				if (arg.children.size() > 3) throw new SAXException("Cannot create a coordinate with more than 3 axis");
				var axis = arg.children.toArray(new Array(arg.children.size()));
				var c = new Coordinate();
				c.x = axis[0].doubleValue();
				if (axis.length > 1) c.y = axis[1].doubleValue();
				if (axis.length > 2) c.z = axis[2].doubleValue();
				return c;
			}
		})());
		var coord_child = new (class {
			parse(arg, gf) {
				if (arg.text === null) return null;
				return new Double(arg.text.toString());
			}
		})();
		strats.put(GMLConstants.GML_COORD_X.toLowerCase(), coord_child);
		strats.put(GMLConstants.GML_COORD_Y.toLowerCase(), coord_child);
		strats.put(GMLConstants.GML_COORD_Z.toLowerCase(), coord_child);
		var member = new (class {
			parse(arg, gf) {
				if (arg.children.size() !== 1) throw new SAXException("Geometry Members may only contain one geometry.");
				return arg.children.get(0);
			}
		})();
		strats.put(GMLConstants.GML_OUTER_BOUNDARY_IS.toLowerCase(), member);
		strats.put(GMLConstants.GML_INNER_BOUNDARY_IS.toLowerCase(), member);
		strats.put(GMLConstants.GML_POINT_MEMBER.toLowerCase(), member);
		strats.put(GMLConstants.GML_LINESTRING_MEMBER.toLowerCase(), member);
		strats.put(GMLConstants.GML_POLYGON_MEMBER.toLowerCase(), member);
		return strats;
	}
	getClass() {
		return GeometryStrategies;
	}
}
class ParseStrategy {
	get interfaces_() {
		return [];
	}
	parse(arg, gf) {}
	getClass() {
		return ParseStrategy;
	}
}

