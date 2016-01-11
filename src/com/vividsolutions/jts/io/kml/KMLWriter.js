import StringBuffer from 'java/lang/StringBuffer';
import LineString from '../../geom/LineString';
import Geometry from '../../geom/Geometry';
import Coordinate from '../../geom/Coordinate';
import IllegalArgumentException from 'java/lang/IllegalArgumentException';
import Writer from 'java/io/Writer';
import Point from '../../geom/Point';
import Polygon from '../../geom/Polygon';
import DecimalFormat from 'java/text/DecimalFormat';
import StringUtil from '../../util/StringUtil';
import LinearRing from '../../geom/LinearRing';
import Double from 'java/lang/Double';
import DecimalFormatSymbols from 'java/text/DecimalFormatSymbols';
import GeometryCollection from '../../geom/GeometryCollection';
export default class KMLWriter {
	constructor(...args) {
		(() => {
			this.INDENT_SIZE = 2;
			this.linePrefix = null;
			this.maxCoordinatesPerLine = 5;
			this.zVal = Double.NaN;
			this.extrude = false;
			this.tesselate = null;
			this.altitudeMode = null;
			this.numberFormatter = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get ALTITUDE_MODE_CLAMPTOGROUND() {
		return "clampToGround ";
	}
	static get ALTITUDE_MODE_RELATIVETOGROUND() {
		return "relativeToGround  ";
	}
	static get ALTITUDE_MODE_ABSOLUTE() {
		return "absolute";
	}
	static get COORDINATE_SEPARATOR() {
		return ",";
	}
	static get TUPLE_SEPARATOR() {
		return " ";
	}
	static createFormatter(precision) {
		var symbols = new DecimalFormatSymbols();
		symbols.setDecimalSeparator('.');
		var format = new DecimalFormat("0." + StringUtil.chars('#', precision), symbols);
		format.setDecimalSeparatorAlwaysShown(false);
		return format;
	}
	static writeGeometry(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [geometry, z] = args;
						var writer = new KMLWriter();
						writer.setZ(z);
						return writer.write(geometry);
					})(...args);
				case 5:
					return ((...args) => {
						let [geometry, z, precision, extrude, altitudeMode] = args;
						var writer = new KMLWriter();
						writer.setZ(z);
						writer.setPrecision(precision);
						writer.setExtrude(extrude);
						writer.setAltitudeMode(altitudeMode);
						return writer.write(geometry);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	writeGeometryCollection(gc, attributes, level, buf) {
		this.startLine("<MultiGeometry>\n", level, buf);
		for (var t = 0; t < gc.getNumGeometries(); t++) {
			this.writeGeometry(gc.getGeometryN(t), level + 1, buf);
		}
		this.startLine("</MultiGeometry>\n", level, buf);
	}
	setMaximumCoordinatesPerLine(maxCoordinatesPerLine) {
		if (maxCoordinatesPerLine <= 0) {
			maxCoordinatesPerLine = 1;
			return null;
		}
		this.maxCoordinatesPerLine = maxCoordinatesPerLine;
	}
	writePoint(p, attributes, level, buf) {
		this.startLine(this.geometryTag("Point", attributes) + "\n", level, buf);
		this.writeModifiers(level, buf);
		this.write([p.getCoordinate()], level + 1, buf);
		this.startLine("</Point>\n", level, buf);
	}
	startLine(text, level, buf) {
		if (this.linePrefix !== null) buf.append(this.linePrefix);
		buf.append(StringUtil.spaces(this.INDENT_SIZE * level));
		buf.append(text);
	}
	geometryTag(geometryName, attributes) {
		var buf = new StringBuffer();
		buf.append("<");
		buf.append(geometryName);
		if (attributes !== null && attributes.length > 0) {
			buf.append(" ");
			buf.append(attributes);
		}
		buf.append(">");
		return buf.toString();
	}
	writeGeometry(g, level, buf) {
		var attributes = "";
		if (g instanceof Point) {
			this.writePoint(g, attributes, level, buf);
		} else if (g instanceof LinearRing) {
			this.writeLinearRing(g, attributes, true, level, buf);
		} else if (g instanceof LineString) {
			this.writeLineString(g, attributes, level, buf);
		} else if (g instanceof Polygon) {
			this.writePolygon(g, attributes, level, buf);
		} else if (g instanceof GeometryCollection) {
			this.writeGeometryCollection(g, attributes, level, buf);
		} else throw new IllegalArgumentException("Geometry type not supported: " + g.getGeometryType());
	}
	setPrecision(precision) {
		if (precision >= 0) this.numberFormatter = KMLWriter.createFormatter(precision);
	}
	setLinePrefix(linePrefix) {
		this.linePrefix = linePrefix;
	}
	setExtrude(extrude) {
		this.extrude = extrude;
	}
	writeModifiers(level, buf) {
		if (this.extrude) {
			this.startLine("<extrude>1</extrude>\n", level, buf);
		}
		if (this.tesselate) {
			this.startLine("<tesselate>1</tesselate>\n", level, buf);
		}
		if (this.altitudeMode !== null) {
			this.startLine("<altitudeMode>" + this.altitudeMode + "</altitudeMode>\n", level, buf);
		}
	}
	writeLineString(ls, attributes, level, buf) {
		this.startLine(this.geometryTag("LineString", attributes) + "\n", level, buf);
		this.writeModifiers(level, buf);
		this.write(ls.getCoordinates(), level + 1, buf);
		this.startLine("</LineString>\n", level, buf);
	}
	setZ(zVal) {
		this.zVal = zVal;
	}
	writeLinearRing(lr, attributes, writeModifiers, level, buf) {
		this.startLine(this.geometryTag("LinearRing", attributes) + "\n", level, buf);
		if (writeModifiers) this.writeModifiers(level, buf);
		this.write(lr.getCoordinates(), level + 1, buf);
		this.startLine("</LinearRing>\n", level, buf);
	}
	setAltitudeMode(altitudeMode) {
		this.altitudeMode = altitudeMode;
	}
	setTesselate(tesselate) {
		this.tesselate = tesselate;
	}
	writePolygon(p, attributes, level, buf) {
		this.startLine(this.geometryTag("Polygon", attributes) + "\n", level, buf);
		this.writeModifiers(level, buf);
		this.startLine("  <outerBoundaryIs>\n", level, buf);
		this.writeLinearRing(p.getExteriorRing(), null, false, level + 1, buf);
		this.startLine("  </outerBoundaryIs>\n", level, buf);
		for (var t = 0; t < p.getNumInteriorRing(); t++) {
			this.startLine("  <innerBoundaryIs>\n", level, buf);
			this.writeLinearRing(p.getInteriorRingN(t), null, false, level + 1, buf);
			this.startLine("  </innerBoundaryIs>\n", level, buf);
		}
		this.startLine("</Polygon>\n", level, buf);
	}
	write(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geom] = args;
						var buf = new StringBuffer();
						this.write(geom, buf);
						return buf.toString();
					})(...args);
				case 2:
					if (args[0] instanceof Coordinate && args[1] instanceof StringBuffer) {
						return ((...args) => {
							let [p, buf] = args;
							this.write(p.x, buf);
							buf.append(KMLWriter.COORDINATE_SEPARATOR);
							this.write(p.y, buf);
							var z = p.z;
							if (!Double.isNaN(this.zVal)) z = this.zVal;
							if (!Double.isNaN(z)) {
								buf.append(KMLWriter.COORDINATE_SEPARATOR);
								this.write(z, buf);
							}
						})(...args);
					} else if (args[0] instanceof Geometry && args[1] instanceof StringBuffer) {
						return ((...args) => {
							let [geometry, buf] = args;
							this.writeGeometry(geometry, 0, buf);
						})(...args);
					} else if (args[0] instanceof Geometry && args[1] instanceof Writer) {
						return ((...args) => {
							let [geometry, writer] = args;
							writer.write(this.write(geometry));
						})(...args);
					} else if (typeof args[0] === "number" && args[1] instanceof StringBuffer) {
						return ((...args) => {
							let [num, buf] = args;
							if (this.numberFormatter !== null) buf.append(this.numberFormatter.format(num)); else buf.append(num);
						})(...args);
					}
				case 3:
					return ((...args) => {
						let [coords, level, buf] = args;
						this.startLine("<coordinates>", level, buf);
						var isNewLine = false;
						for (var i = 0; i < coords.length; i++) {
							if (i > 0) {
								buf.append(KMLWriter.TUPLE_SEPARATOR);
							}
							if (isNewLine) {
								this.startLine("  ", level, buf);
								isNewLine = false;
							}
							this.write(coords[i], buf);
							if ((i + 1) % this.maxCoordinatesPerLine === 0 && i < coords.length - 1) {
								buf.append("\n");
								isNewLine = true;
							}
						}
						buf.append("</coordinates>\n");
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return KMLWriter;
	}
}

