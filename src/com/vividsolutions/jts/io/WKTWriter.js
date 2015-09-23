function WKTWriter(...args) {
	this.outputDimension = 2;
	this.formatter = null;
	this.isFormatted = false;
	this.useFormatting = false;
	this.level = 0;
	this.coordsPerLine = -1;
	this.indentTabStr = "  ";
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [outputDimension] = args;
				this.outputDimension = outputDimension;
				if (outputDimension < 2 || outputDimension > 3) throw new IllegalArgumentException("Invalid output dimension (must be 2 or 3)");
			})(...args);
		case 0:
			return ((...args) => {
				let [] = args;
			})(...args);
	}
}
module.exports = WKTWriter
var LineString = require('com/vividsolutions/jts/geom/LineString');
var Point = require('com/vividsolutions/jts/geom/Point');
var Polygon = require('com/vividsolutions/jts/geom/Polygon');
var DecimalFormat = require('java/text/DecimalFormat');
var MultiPoint = require('com/vividsolutions/jts/geom/MultiPoint');
var LinearRing = require('com/vividsolutions/jts/geom/LinearRing');
var Double = require('java/lang/Double');
var StringWriter = require('java/io/StringWriter');
var DecimalFormatSymbols = require('java/text/DecimalFormatSymbols');
var MultiPolygon = require('com/vividsolutions/jts/geom/MultiPolygon');
var GeometryCollection = require('com/vividsolutions/jts/geom/GeometryCollection');
var Assert = require('com/vividsolutions/jts/util/Assert');
var IOException = require('java/io/IOException');
var MultiLineString = require('com/vividsolutions/jts/geom/MultiLineString');
WKTWriter.prototype.appendPointText = function (coordinate, level, writer, precisionModel) {
	if (coordinate === null) {
		writer.write("EMPTY");
	} else {
		writer.write("(");
		this.appendCoordinate(coordinate, writer);
		writer.write(")");
	}
};
WKTWriter.prototype.appendLinearRingTaggedText = function (linearRing, level, writer) {
	writer.write("LINEARRING ");
	this.appendLineStringText(linearRing, level, false, writer);
};
WKTWriter.prototype.appendMultiPointTaggedText = function (multipoint, level, writer) {
	writer.write("MULTIPOINT ");
	this.appendMultiPointText(multipoint, level, writer);
};
WKTWriter.prototype.appendMultiPolygonText = function (multiPolygon, level, writer) {
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
};
WKTWriter.prototype.appendMultiPointText = function (multiPoint, level, writer) {
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
};
WKTWriter.prototype.appendMultiLineStringTaggedText = function (multiLineString, level, writer) {
	writer.write("MULTILINESTRING ");
	this.appendMultiLineStringText(multiLineString, level, false, writer);
};
WKTWriter.prototype.indent = function (level, writer) {
	if (!this.useFormatting || level <= 0) return null;
	writer.write("\n");
	for (var i = 0; i < level; i++) {
		writer.write(this.indentTabStr);
	}
};
WKTWriter.prototype.indentCoords = function (coordIndex, level, writer) {
	if (this.coordsPerLine <= 0 || coordIndex % this.coordsPerLine !== 0) return null;
	this.indent(level, writer);
};
WKTWriter.prototype.appendGeometryCollectionText = function (geometryCollection, level, writer) {
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
};
WKTWriter.prototype.appendGeometryTaggedText = function (geometry, level, writer) {
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
};
WKTWriter.prototype.appendPointTaggedText = function (coordinate, level, writer, precisionModel) {
	writer.write("POINT ");
	this.appendPointText(coordinate, level, writer, precisionModel);
};
WKTWriter.prototype.setTab = function (size) {
	if (size <= 0) throw new IllegalArgumentException("Tab count must be positive");
	this.indentTabStr = WKTWriter.stringOfChar(' ', size);
};
WKTWriter.prototype.appendCoordinate = function (...args) {
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
WKTWriter.prototype.appendMultiPolygonTaggedText = function (multiPolygon, level, writer) {
	writer.write("MULTIPOLYGON ");
	this.appendMultiPolygonText(multiPolygon, level, writer);
};
WKTWriter.prototype.writeNumber = function (d) {
	return this.formatter.format(d);
};
WKTWriter.prototype.appendPolygonText = function (polygon, level, indentFirst, writer) {
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
};
WKTWriter.prototype.appendGeometryCollectionTaggedText = function (geometryCollection, level, writer) {
	writer.write("GEOMETRYCOLLECTION ");
	this.appendGeometryCollectionText(geometryCollection, level, writer);
};
WKTWriter.prototype.setMaxCoordinatesPerLine = function (coordsPerLine) {
	this.coordsPerLine = coordsPerLine;
};
WKTWriter.prototype.appendLineStringText = function (lineString, level, doIndent, writer) {
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
};
WKTWriter.prototype.appendPolygonTaggedText = function (polygon, level, writer) {
	writer.write("POLYGON ");
	this.appendPolygonText(polygon, level, false, writer);
};
WKTWriter.prototype.writeFormatted = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geometry, writer] = args;
				this.writeFormatted(geometry, true, writer);
			})(...args);
		case 1:
			return ((...args) => {
				let [geometry] = args;
				var sw = new StringWriter();
				try {
					this.writeFormatted(geometry, true, sw);
				} catch (e) {
					if (e instanceof IOException) {
						Assert.shouldNeverReachHere();
					}
				} finally {}
				return sw.toString();
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
WKTWriter.prototype.appendMultiLineStringText = function (multiLineString, level, indentFirst, writer) {
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
};
WKTWriter.prototype.setFormatted = function (isFormatted) {
	this.isFormatted = isFormatted;
};
WKTWriter.prototype.appendLineStringTaggedText = function (lineString, level, writer) {
	writer.write("LINESTRING ");
	this.appendLineStringText(lineString, level, false, writer);
};
WKTWriter.prototype.write = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [geometry, writer] = args;
				this.writeFormatted(geometry, false, writer);
			})(...args);
		case 1:
			return ((...args) => {
				let [geometry] = args;
				var sw = new StringWriter();
				try {
					this.writeFormatted(geometry, this.isFormatted, sw);
				} catch (e) {
					if (e instanceof IOException) {
						Assert.shouldNeverReachHere();
					}
				} finally {}
				return sw.toString();
			})(...args);
	}
};
WKTWriter.prototype.appendSequenceText = function (seq, level, doIndent, writer) {
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
};
WKTWriter.stringOfChar = function (ch, count) {
	var buf = new StringBuffer();
	for (var i = 0; i < count; i++) {
		buf.append(ch);
	}
	return buf.toString();
};
WKTWriter.createFormatter = function (precisionModel) {
	var decimalPlaces = precisionModel.getMaximumSignificantDigits();
	var symbols = new DecimalFormatSymbols();
	symbols.setDecimalSeparator('.');
	var fmtString = "0" + (decimalPlaces > 0 ? "." : "") + WKTWriter.stringOfChar('#', decimalPlaces);
	return new DecimalFormat(fmtString, symbols);
};
WKTWriter.toLineString = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [p0, p1] = args;
				return "LINESTRING ( " + p0.x + " " + p0.y + ", " + p1.x + " " + p1.y + " )";
			})(...args);
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
	}
};
WKTWriter.toPoint = function (p0) {
	return "POINT ( " + p0.x + " " + p0.y + " )";
};
WKTWriter.INDENT = 2;

