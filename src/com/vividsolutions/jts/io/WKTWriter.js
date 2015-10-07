import LineString from '../geom/LineString';
import Point from '../geom/Point';
import Polygon from '../geom/Polygon';
import DecimalFormat from 'java/text/DecimalFormat';
import MultiPoint from '../geom/MultiPoint';
import LinearRing from '../geom/LinearRing';
import Double from 'java/lang/Double';
import StringWriter from 'java/io/StringWriter';
import DecimalFormatSymbols from 'java/text/DecimalFormatSymbols';
import MultiPolygon from '../geom/MultiPolygon';
import GeometryCollection from '../geom/GeometryCollection';
import Assert from '../util/Assert';
import IOException from 'java/io/IOException';
import MultiLineString from '../geom/MultiLineString';
export default class WKTWriter {
	constructor(...args) {
		(() => {
			this.outputDimension = 2;
			this.formatter = null;
			this.isFormatted = false;
			this.useFormatting = false;
			this.level = 0;
			this.coordsPerLine = -1;
			this.indentTabStr = "  ";
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
					})(...args);
				case 1:
					return ((...args) => {
						let [outputDimension] = args;
						this.outputDimension = outputDimension;
						if (outputDimension < 2 || outputDimension > 3) throw new IllegalArgumentException("Invalid output dimension (must be 2 or 3)");
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get INDENT() {
		return 2;
	}
	static stringOfChar(ch, count) {
		var buf = new StringBuffer();
		for (var i = 0; i < count; i++) {
			buf.append(ch);
		}
		return buf.toString();
	}
	static createFormatter(precisionModel) {
		var decimalPlaces = precisionModel.getMaximumSignificantDigits();
		var symbols = new DecimalFormatSymbols();
		symbols.setDecimalSeparator('.');
		var fmtString = "0" + (decimalPlaces > 0 ? "." : "") + WKTWriter.stringOfChar('#', decimalPlaces);
		return new DecimalFormat(fmtString, symbols);
	}
	static toLineString(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [seq] = args;
						var buf = new StringBuffer();
						buf.append("LINESTRING ");
						if (seq.size() === 0) buf.append(" EMPTY"); else {
							buf.append("(");
							for (var i = 0; i < seq.size(); i++) {
								if (i > 0) buf.append(", ");
								buf.append(seq.getX(i) + " " + seq.getY(i));
							}
							buf.append(")");
						}
						return buf.toString();
					})(...args);
				case 2:
					return ((...args) => {
						let [p0, p1] = args;
						return "LINESTRING ( " + p0.x + " " + p0.y + ", " + p1.x + " " + p1.y + " )";
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	static toPoint(p0) {
		return "POINT ( " + p0.x + " " + p0.y + " )";
	}
	appendPointText(coordinate, level, writer, precisionModel) {
		if (coordinate === null) {
			writer.write("EMPTY");
		} else {
			writer.write("(");
			this.appendCoordinate(coordinate, writer);
			writer.write(")");
		}
	}
	appendLinearRingTaggedText(linearRing, level, writer) {
		writer.write("LINEARRING ");
		this.appendLineStringText(linearRing, level, false, writer);
	}
	appendMultiPointTaggedText(multipoint, level, writer) {
		writer.write("MULTIPOINT ");
		this.appendMultiPointText(multipoint, level, writer);
	}
	appendMultiPolygonText(multiPolygon, level, writer) {
		if (multiPolygon.isEmpty()) {
			writer.write("EMPTY");
		} else {
			var level2 = level;
			var doIndent = false;
			writer.write("(");
			for (var i = 0; i < multiPolygon.getNumGeometries(); i++) {
				if (i > 0) {
					writer.write(", ");
					level2 = level + 1;
					doIndent = true;
				}
				this.appendPolygonText(multiPolygon.getGeometryN(i), level2, doIndent, writer);
			}
			writer.write(")");
		}
	}
	appendMultiPointText(multiPoint, level, writer) {
		if (multiPoint.isEmpty()) {
			writer.write("EMPTY");
		} else {
			writer.write("(");
			for (var i = 0; i < multiPoint.getNumGeometries(); i++) {
				if (i > 0) {
					writer.write(", ");
					this.indentCoords(i, level + 1, writer);
				}
				writer.write("(");
				this.appendCoordinate(multiPoint.getGeometryN(i).getCoordinate(), writer);
				writer.write(")");
			}
			writer.write(")");
		}
	}
	appendMultiLineStringTaggedText(multiLineString, level, writer) {
		writer.write("MULTILINESTRING ");
		this.appendMultiLineStringText(multiLineString, level, false, writer);
	}
	indent(level, writer) {
		if (!this.useFormatting || level <= 0) return null;
		writer.write("\n");
		for (var i = 0; i < level; i++) {
			writer.write(this.indentTabStr);
		}
	}
	indentCoords(coordIndex, level, writer) {
		if (this.coordsPerLine <= 0 || coordIndex % this.coordsPerLine !== 0) return null;
		this.indent(level, writer);
	}
	appendGeometryCollectionText(geometryCollection, level, writer) {
		if (geometryCollection.isEmpty()) {
			writer.write("EMPTY");
		} else {
			var level2 = level;
			writer.write("(");
			for (var i = 0; i < geometryCollection.getNumGeometries(); i++) {
				if (i > 0) {
					writer.write(", ");
					level2 = level + 1;
				}
				this.appendGeometryTaggedText(geometryCollection.getGeometryN(i), level2, writer);
			}
			writer.write(")");
		}
	}
	appendGeometryTaggedText(geometry, level, writer) {
		this.indent(level, writer);
		if (geometry instanceof Point) {
			var point = geometry;
			this.appendPointTaggedText(point.getCoordinate(), level, writer, point.getPrecisionModel());
		} else if (geometry instanceof LinearRing) {
			this.appendLinearRingTaggedText(geometry, level, writer);
		} else if (geometry instanceof LineString) {
			this.appendLineStringTaggedText(geometry, level, writer);
		} else if (geometry instanceof Polygon) {
			this.appendPolygonTaggedText(geometry, level, writer);
		} else if (geometry instanceof MultiPoint) {
			this.appendMultiPointTaggedText(geometry, level, writer);
		} else if (geometry instanceof MultiLineString) {
			this.appendMultiLineStringTaggedText(geometry, level, writer);
		} else if (geometry instanceof MultiPolygon) {
			this.appendMultiPolygonTaggedText(geometry, level, writer);
		} else if (geometry instanceof GeometryCollection) {
			this.appendGeometryCollectionTaggedText(geometry, level, writer);
		} else {
			Assert.shouldNeverReachHere("Unsupported Geometry implementation:" + geometry.getClass());
		}
	}
	appendPointTaggedText(coordinate, level, writer, precisionModel) {
		writer.write("POINT ");
		this.appendPointText(coordinate, level, writer, precisionModel);
	}
	setTab(size) {
		if (size <= 0) throw new IllegalArgumentException("Tab count must be positive");
		this.indentTabStr = WKTWriter.stringOfChar(' ', size);
	}
	appendCoordinate(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [coordinate, writer] = args;
						writer.write(this.writeNumber(coordinate.x) + " " + this.writeNumber(coordinate.y));
						if (this.outputDimension >= 3 && !Double.isNaN(coordinate.z)) {
							writer.write(" ");
							writer.write(this.writeNumber(coordinate.z));
						}
					})(...args);
				case 3:
					return ((...args) => {
						let [seq, i, writer] = args;
						writer.write(this.writeNumber(seq.getX(i)) + " " + this.writeNumber(seq.getY(i)));
						if (this.outputDimension >= 3 && seq.getDimension() >= 3) {
							var z = seq.getOrdinate(i, 3);
							if (!Double.isNaN(z)) {
								writer.write(" ");
								writer.write(this.writeNumber(z));
							}
						}
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	appendMultiPolygonTaggedText(multiPolygon, level, writer) {
		writer.write("MULTIPOLYGON ");
		this.appendMultiPolygonText(multiPolygon, level, writer);
	}
	writeNumber(d) {
		return this.formatter.format(d);
	}
	appendPolygonText(polygon, level, indentFirst, writer) {
		if (polygon.isEmpty()) {
			writer.write("EMPTY");
		} else {
			if (indentFirst) this.indent(level, writer);
			writer.write("(");
			this.appendLineStringText(polygon.getExteriorRing(), level, false, writer);
			for (var i = 0; i < polygon.getNumInteriorRing(); i++) {
				writer.write(", ");
				this.appendLineStringText(polygon.getInteriorRingN(i), level + 1, true, writer);
			}
			writer.write(")");
		}
	}
	appendGeometryCollectionTaggedText(geometryCollection, level, writer) {
		writer.write("GEOMETRYCOLLECTION ");
		this.appendGeometryCollectionText(geometryCollection, level, writer);
	}
	setMaxCoordinatesPerLine(coordsPerLine) {
		this.coordsPerLine = coordsPerLine;
	}
	appendLineStringText(lineString, level, doIndent, writer) {
		if (lineString.isEmpty()) {
			writer.write("EMPTY");
		} else {
			if (doIndent) this.indent(level, writer);
			writer.write("(");
			for (var i = 0; i < lineString.getNumPoints(); i++) {
				if (i > 0) {
					writer.write(", ");
					if (this.coordsPerLine > 0 && i % this.coordsPerLine === 0) {
						this.indent(level + 1, writer);
					}
				}
				this.appendCoordinate(lineString.getCoordinateN(i), writer);
			}
			writer.write(")");
		}
	}
	appendPolygonTaggedText(polygon, level, writer) {
		writer.write("POLYGON ");
		this.appendPolygonText(polygon, level, false, writer);
	}
	writeFormatted(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geometry] = args;
						var sw = new StringWriter();
						try {
							this.writeFormatted(geometry, true, sw);
						} catch (ex) {
							if (ex instanceof IOException) {
								Assert.shouldNeverReachHere();
							} else throw ex;
						} finally {}
						return sw.toString();
					})(...args);
				case 2:
					return ((...args) => {
						let [geometry, writer] = args;
						this.writeFormatted(geometry, true, writer);
					})(...args);
				case 3:
					return ((...args) => {
						let [geometry, useFormatting, writer] = args;
						this.useFormatting = useFormatting;
						this.formatter = WKTWriter.createFormatter(geometry.getPrecisionModel());
						this.appendGeometryTaggedText(geometry, 0, writer);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	appendMultiLineStringText(multiLineString, level, indentFirst, writer) {
		if (multiLineString.isEmpty()) {
			writer.write("EMPTY");
		} else {
			var level2 = level;
			var doIndent = indentFirst;
			writer.write("(");
			for (var i = 0; i < multiLineString.getNumGeometries(); i++) {
				if (i > 0) {
					writer.write(", ");
					level2 = level + 1;
					doIndent = true;
				}
				this.appendLineStringText(multiLineString.getGeometryN(i), level2, doIndent, writer);
			}
			writer.write(")");
		}
	}
	setFormatted(isFormatted) {
		this.isFormatted = isFormatted;
	}
	appendLineStringTaggedText(lineString, level, writer) {
		writer.write("LINESTRING ");
		this.appendLineStringText(lineString, level, false, writer);
	}
	write(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geometry] = args;
						var sw = new StringWriter();
						try {
							this.writeFormatted(geometry, this.isFormatted, sw);
						} catch (ex) {
							if (ex instanceof IOException) {
								Assert.shouldNeverReachHere();
							} else throw ex;
						} finally {}
						return sw.toString();
					})(...args);
				case 2:
					return ((...args) => {
						let [geometry, writer] = args;
						this.writeFormatted(geometry, false, writer);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	appendSequenceText(seq, level, doIndent, writer) {
		if (seq.size() === 0) {
			writer.write("EMPTY");
		} else {
			if (doIndent) this.indent(level, writer);
			writer.write("(");
			for (var i = 0; i < seq.size(); i++) {
				if (i > 0) {
					writer.write(", ");
					if (this.coordsPerLine > 0 && i % this.coordsPerLine === 0) {
						this.indent(level + 1, writer);
					}
				}
				this.appendCoordinate(seq, i, writer);
			}
			writer.write(")");
		}
	}
	getClass() {
		return WKTWriter;
	}
}

