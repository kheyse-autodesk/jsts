import LineString from '../../geom/LineString';
import Geometry from '../../geom/Geometry';
import IllegalArgumentException from 'java/lang/IllegalArgumentException';
import Writer from 'java/io/Writer';
import Point from '../../geom/Point';
import Polygon from '../../geom/Polygon';
import MultiPoint from '../../geom/MultiPoint';
import GMLConstants from './GMLConstants';
import Double from 'java/lang/Double';
import StringWriter from 'java/io/StringWriter';
import MultiPolygon from '../../geom/MultiPolygon';
import GeometryCollection from '../../geom/GeometryCollection';
import Assert from '../../util/Assert';
import IOException from 'java/io/IOException';
import MultiLineString from '../../geom/MultiLineString';
export default class GMLWriter {
	constructor(...args) {
		(() => {
			this.INDENT = "  ";
			this.startingIndentIndex = 0;
			this.maxCoordinatesPerLine = 10;
			this.emitNamespace = false;
			this.isRootTag = false;
			this.prefix = GMLConstants.GML_PREFIX;
			this.namespace = GMLConstants.GML_NAMESPACE;
			this.srsName = null;
			this.customElements = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 1:
					return ((...args) => {
						let [emitNamespace] = args;
						this.setNamespace(emitNamespace);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get coordinateSeparator() {
		return ",";
	}
	static get tupleSeparator() {
		return " ";
	}
	writeGeometryCollection(gc, writer, level) {
		this.startLine(level, writer);
		this.startGeomTag(GMLConstants.GML_MULTI_GEOMETRY, gc, writer);
		for (var t = 0; t < gc.getNumGeometries(); t++) {
			this.startLine(level + 1, writer);
			this.startGeomTag(GMLConstants.GML_GEOMETRY_MEMBER, null, writer);
			this.write(gc.getGeometryN(t), writer, level + 2);
			this.startLine(level + 1, writer);
			this.endGeomTag(GMLConstants.GML_GEOMETRY_MEMBER, writer);
		}
		this.startLine(level, writer);
		this.endGeomTag(GMLConstants.GML_MULTI_GEOMETRY, writer);
	}
	writePoint(p, writer, level) {
		this.startLine(level, writer);
		this.startGeomTag(GMLConstants.GML_POINT, p, writer);
		this.write([p.getCoordinate()], writer, level + 1);
		this.startLine(level, writer);
		this.endGeomTag(GMLConstants.GML_POINT, writer);
	}
	startLine(level, writer) {
		for (var i = 0; i < level; i++) writer.write(this.INDENT);
	}
	writeAttributes(geom, writer) {
		if (geom === null) return null;
		if (!this.isRootTag) return null;
		if (this.emitNamespace) {
			writer.write(" xmlns" + (this.prefix === null || this.name === this.prefix ? "" : ":" + this.prefix) + "='" + this.namespace + "'");
		}
		if (this.srsName !== null && this.srsName.length > 0) {
			writer.write(" " + GMLConstants.GML_ATTR_SRSNAME + "='" + this.srsName + "'");
		}
	}
	setCustomElements(customElements) {
		this.customElements = customElements;
	}
	writeMultiPoint(mp, writer, level) {
		this.startLine(level, writer);
		this.startGeomTag(GMLConstants.GML_MULTI_POINT, mp, writer);
		for (var t = 0; t < mp.getNumGeometries(); t++) {
			this.startLine(level + 1, writer);
			this.startGeomTag(GMLConstants.GML_POINT_MEMBER, null, writer);
			this.writePoint(mp.getGeometryN(t), writer, level + 2);
			this.startLine(level + 1, writer);
			this.endGeomTag(GMLConstants.GML_POINT_MEMBER, writer);
		}
		this.startLine(level, writer);
		this.endGeomTag(GMLConstants.GML_MULTI_POINT, writer);
	}
	writeMultiPolygon(mp, writer, level) {
		this.startLine(level, writer);
		this.startGeomTag(GMLConstants.GML_MULTI_POLYGON, mp, writer);
		for (var t = 0; t < mp.getNumGeometries(); t++) {
			this.startLine(level + 1, writer);
			this.startGeomTag(GMLConstants.GML_POLYGON_MEMBER, null, writer);
			this.writePolygon(mp.getGeometryN(t), writer, level + 2);
			this.startLine(level + 1, writer);
			this.endGeomTag(GMLConstants.GML_POLYGON_MEMBER, writer);
		}
		this.startLine(level, writer);
		this.endGeomTag(GMLConstants.GML_MULTI_POLYGON, writer);
	}
	prefix() {
		if (this.prefix === null || this.prefix.length === 0) return "";
		return this.prefix + ":";
	}
	startGeomTag(geometryName, g, writer) {
		writer.write("<" + (this.prefix === null || this.name === this.prefix ? "" : this.prefix + ":"));
		writer.write(geometryName);
		this.writeAttributes(g, writer);
		writer.write(">\n");
		this.writeCustomElements(g, writer);
		this.isRootTag = false;
	}
	writeCustomElements(geom, writer) {
		if (geom === null) return null;
		if (!this.isRootTag) return null;
		if (this.customElements === null) return null;
		for (var i = 0; i < this.customElements.length; i++) {
			writer.write(this.customElements[i]);
			writer.write("\n");
		}
	}
	writeLineString(ls, writer, level) {
		this.startLine(level, writer);
		this.startGeomTag(GMLConstants.GML_LINESTRING, ls, writer);
		this.write(ls.getCoordinates(), writer, level + 1);
		this.startLine(level, writer);
		this.endGeomTag(GMLConstants.GML_LINESTRING, writer);
	}
	setMaxCoordinatesPerLine(num) {
		if (num < 1) throw new IndexOutOfBoundsException("Invalid coordinate count per line, must be > 0");
		this.maxCoordinatesPerLine = num;
	}
	setSrsName(srsName) {
		this.srsName = srsName;
	}
	writeMultiLineString(mls, writer, level) {
		this.startLine(level, writer);
		this.startGeomTag(GMLConstants.GML_MULTI_LINESTRING, mls, writer);
		for (var t = 0; t < mls.getNumGeometries(); t++) {
			this.startLine(level + 1, writer);
			this.startGeomTag(GMLConstants.GML_LINESTRING_MEMBER, null, writer);
			this.writeLineString(mls.getGeometryN(t), writer, level + 2);
			this.startLine(level + 1, writer);
			this.endGeomTag(GMLConstants.GML_LINESTRING_MEMBER, writer);
		}
		this.startLine(level, writer);
		this.endGeomTag(GMLConstants.GML_MULTI_LINESTRING, writer);
	}
	writeLinearRing(lr, writer, level) {
		this.startLine(level, writer);
		this.startGeomTag(GMLConstants.GML_LINEARRING, lr, writer);
		this.write(lr.getCoordinates(), writer, level + 1);
		this.startLine(level, writer);
		this.endGeomTag(GMLConstants.GML_LINEARRING, writer);
	}
	setStartingIndentIndex(indent) {
		if (indent < 0) indent = 0;
		this.startingIndentIndex = indent;
	}
	setNamespace(emitNamespace) {
		this.emitNamespace = emitNamespace;
	}
	endGeomTag(geometryName, writer) {
		writer.write("</" + this.prefix());
		writer.write(geometryName);
		writer.write(">\n");
	}
	setPrefix(prefix) {
		this.prefix = prefix;
	}
	writePolygon(p, writer, level) {
		this.startLine(level, writer);
		this.startGeomTag(GMLConstants.GML_POLYGON, p, writer);
		this.startLine(level + 1, writer);
		this.startGeomTag(GMLConstants.GML_OUTER_BOUNDARY_IS, null, writer);
		this.writeLinearRing(p.getExteriorRing(), writer, level + 2);
		this.startLine(level + 1, writer);
		this.endGeomTag(GMLConstants.GML_OUTER_BOUNDARY_IS, writer);
		for (var t = 0; t < p.getNumInteriorRing(); t++) {
			this.startLine(level + 1, writer);
			this.startGeomTag(GMLConstants.GML_INNER_BOUNDARY_IS, null, writer);
			this.writeLinearRing(p.getInteriorRingN(t), writer, level + 2);
			this.startLine(level + 1, writer);
			this.endGeomTag(GMLConstants.GML_INNER_BOUNDARY_IS, writer);
		}
		this.startLine(level, writer);
		this.endGeomTag(GMLConstants.GML_POLYGON, writer);
	}
	write(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geom] = args;
						var writer = new StringWriter();
						try {
							this.write(geom, writer);
						} catch (ex) {
							if (ex instanceof IOException) {
								Assert.shouldNeverReachHere();
							} else throw ex;
						} finally {}
						return writer.toString();
					})(...args);
				case 2:
					return ((...args) => {
						let [geom, writer] = args;
						this.write(geom, writer, this.startingIndentIndex);
					})(...args);
				case 3:
					if (Number.isInteger(args[2]) && (args[0] instanceof Geometry && args[1] instanceof Writer)) {
						return ((...args) => {
							let [geom, writer, level] = args;
							this.isRootTag = true;
							if (geom instanceof Point) {
								this.writePoint(geom, writer, level);
							} else if (geom instanceof LineString) {
								this.writeLineString(geom, writer, level);
							} else if (geom instanceof Polygon) {
								this.writePolygon(geom, writer, level);
							} else if (geom instanceof MultiPoint) {
								this.writeMultiPoint(geom, writer, level);
							} else if (geom instanceof MultiLineString) {
								this.writeMultiLineString(geom, writer, level);
							} else if (geom instanceof MultiPolygon) {
								this.writeMultiPolygon(geom, writer, level);
							} else if (geom instanceof GeometryCollection) {
								this.writeGeometryCollection(geom, writer, this.startingIndentIndex);
							} else {
								throw new IllegalArgumentException("Unhandled geometry type: " + geom.getGeometryType());
							}
							writer.flush();
						})(...args);
					} else if (Number.isInteger(args[2]) && (args[0] instanceof Array && args[1] instanceof Writer)) {
						return ((...args) => {
							let [coords, writer, level] = args;
							this.startLine(level, writer);
							this.startGeomTag(GMLConstants.GML_COORDINATES, null, writer);
							var dim = 2;
							if (coords.length > 0) {
								if (!Double.isNaN(coords[0].z)) dim = 3;
							}
							var isNewLine = true;
							for (var i = 0; i < coords.length; i++) {
								if (isNewLine) {
									this.startLine(level + 1, writer);
									isNewLine = false;
								}
								if (dim === 2) {
									writer.write("" + coords[i].x);
									writer.write(GMLWriter.coordinateSeparator);
									writer.write("" + coords[i].y);
								} else if (dim === 3) {
									writer.write("" + coords[i].x);
									writer.write(GMLWriter.coordinateSeparator);
									writer.write("" + coords[i].y);
									writer.write(GMLWriter.coordinateSeparator);
									writer.write("" + coords[i].z);
								}
								writer.write(GMLWriter.tupleSeparator);
								if ((i + 1) % this.maxCoordinatesPerLine === 0 && i < coords.length - 1) {
									writer.write("\n");
									isNewLine = true;
								}
							}
							if (!isNewLine) writer.write("\n");
							this.startLine(level, writer);
							this.endGeomTag(GMLConstants.GML_COORDINATES, writer);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return GMLWriter;
	}
}

