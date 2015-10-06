import LineString from 'com/vividsolutions/jts/geom/LineString';
import WKBConstants from 'com/vividsolutions/jts/io/WKBConstants';
import Coordinate from 'com/vividsolutions/jts/geom/Coordinate';
import Point from 'com/vividsolutions/jts/geom/Point';
import Polygon from 'com/vividsolutions/jts/geom/Polygon';
import MultiPoint from 'com/vividsolutions/jts/geom/MultiPoint';
import OutputStreamOutStream from 'com/vividsolutions/jts/io/OutputStreamOutStream';
import MultiPolygon from 'com/vividsolutions/jts/geom/MultiPolygon';
import GeometryCollection from 'com/vividsolutions/jts/geom/GeometryCollection';
import ByteOrderValues from 'com/vividsolutions/jts/io/ByteOrderValues';
import ByteArrayOutputStream from 'java/io/ByteArrayOutputStream';
import RuntimeException from 'java/lang/RuntimeException';
import Assert from 'com/vividsolutions/jts/util/Assert';
import IOException from 'java/io/IOException';
import MultiLineString from 'com/vividsolutions/jts/geom/MultiLineString';
export default class WKBWriter {
	constructor(...args) {
		(() => {
			this.outputDimension = 2;
			this.byteOrder = null;
			this.includeSRID = false;
			this.byteArrayOS = new ByteArrayOutputStream();
			this.byteArrayOutStream = new OutputStreamOutStream(this.byteArrayOS);
			this.buf = [];
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						overloads.call(this, 2, ByteOrderValues.BIG_ENDIAN);
					})(...args);
				case 1:
					return ((...args) => {
						let [outputDimension] = args;
						overloads.call(this, outputDimension, ByteOrderValues.BIG_ENDIAN);
					})(...args);
				case 2:
					if (Number.isInteger(args[0]) && typeof args[1] === "boolean") {
						return ((...args) => {
							let [outputDimension, includeSRID] = args;
							overloads.call(this, outputDimension, ByteOrderValues.BIG_ENDIAN, includeSRID);
						})(...args);
					} else if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
						return ((...args) => {
							let [outputDimension, byteOrder] = args;
							overloads.call(this, outputDimension, byteOrder, false);
						})(...args);
					}
				case 3:
					return ((...args) => {
						let [outputDimension, byteOrder, includeSRID] = args;
						this.outputDimension = outputDimension;
						this.byteOrder = byteOrder;
						this.includeSRID = includeSRID;
						if (outputDimension < 2 || outputDimension > 3) throw new IllegalArgumentException("Output dimension must be 2 or 3");
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static toHexDigit(n) {
		if (n < 0 || n > 15) throw new IllegalArgumentException("Nibble value out of range: " + n);
		if (n <= 9) return '0' + n;
		return 'A' + n - 10;
	}
	static toHex(bytes) {
		var buf = new StringBuffer();
		for (var i = 0; i < bytes.length; i++) {
			var b = bytes[i];
			buf.append(WKBWriter.toHexDigit(b >> 4 & 0x0F));
			buf.append(WKBWriter.toHexDigit(b & 0x0F));
		}
		return buf.toString();
	}
	static bytesToHex(bytes) {
		return WKBWriter.toHex(bytes);
	}
	writeGeometryCollection(geometryType, gc, os) {
		this.writeByteOrder(os);
		this.writeGeometryType(geometryType, gc, os);
		this.writeInt(gc.getNumGeometries(), os);
		for (var i = 0; i < gc.getNumGeometries(); i++) {
			this.write(gc.getGeometryN(i), os);
		}
	}
	writePoint(pt, os) {
		if (pt.getCoordinateSequence().size() === 0) throw new IllegalArgumentException("Empty Points cannot be represented in WKB");
		this.writeByteOrder(os);
		this.writeGeometryType(WKBConstants.wkbPoint, pt, os);
		this.writeCoordinateSequence(pt.getCoordinateSequence(), false, os);
	}
	writeCoordinateSequence(seq, writeSize, os) {
		if (writeSize) this.writeInt(seq.size(), os);
		for (var i = 0; i < seq.size(); i++) {
			this.writeCoordinate(seq, i, os);
		}
	}
	writeInt(intValue, os) {
		ByteOrderValues.putInt(intValue, this.buf, this.byteOrder);
		os.write(this.buf, 4);
	}
	writeGeometryType(geometryType, g, os) {
		var flag3D = this.outputDimension === 3 ? 0x80000000 : 0;
		var typeInt = geometryType | flag3D;
		typeInt |= this.includeSRID ? 0x20000000 : 0;
		this.writeInt(typeInt, os);
		if (this.includeSRID) {
			this.writeInt(g.getSRID(), os);
		}
	}
	writeLineString(line, os) {
		this.writeByteOrder(os);
		this.writeGeometryType(WKBConstants.wkbLineString, line, os);
		this.writeCoordinateSequence(line.getCoordinateSequence(), true, os);
	}
	writeByteOrder(os) {
		if (this.byteOrder === ByteOrderValues.LITTLE_ENDIAN) this.buf[0] = WKBConstants.wkbNDR; else this.buf[0] = WKBConstants.wkbXDR;
		os.write(this.buf, 1);
	}
	writeCoordinate(seq, index, os) {
		ByteOrderValues.putDouble(seq.getX(index), this.buf, this.byteOrder);
		os.write(this.buf, 8);
		ByteOrderValues.putDouble(seq.getY(index), this.buf, this.byteOrder);
		os.write(this.buf, 8);
		if (this.outputDimension >= 3) {
			var ordVal = Coordinate.NULL_ORDINATE;
			if (seq.getDimension() >= 3) ordVal = seq.getOrdinate(index, 2);
			ByteOrderValues.putDouble(ordVal, this.buf, this.byteOrder);
			os.write(this.buf, 8);
		}
	}
	writePolygon(poly, os) {
		this.writeByteOrder(os);
		this.writeGeometryType(WKBConstants.wkbPolygon, poly, os);
		this.writeInt(poly.getNumInteriorRing() + 1, os);
		this.writeCoordinateSequence(poly.getExteriorRing().getCoordinateSequence(), true, os);
		for (var i = 0; i < poly.getNumInteriorRing(); i++) {
			this.writeCoordinateSequence(poly.getInteriorRingN(i).getCoordinateSequence(), true, os);
		}
	}
	write(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [geom] = args;
						try {
							this.byteArrayOS.reset();
							this.write(geom, this.byteArrayOutStream);
						} catch (ex) {
							if (ex instanceof IOException) {
								throw new RuntimeException("Unexpected IO exception: " + ex.getMessage());
							} else throw ex;
						} finally {}
						return this.byteArrayOS.toByteArray();
					})(...args);
				case 2:
					return ((...args) => {
						let [geom, os] = args;
						if (geom instanceof Point) this.writePoint(geom, os); else if (geom instanceof LineString) this.writeLineString(geom, os); else if (geom instanceof Polygon) this.writePolygon(geom, os); else if (geom instanceof MultiPoint) this.writeGeometryCollection(WKBConstants.wkbMultiPoint, geom, os); else if (geom instanceof MultiLineString) this.writeGeometryCollection(WKBConstants.wkbMultiLineString, geom, os); else if (geom instanceof MultiPolygon) this.writeGeometryCollection(WKBConstants.wkbMultiPolygon, geom, os); else if (geom instanceof GeometryCollection) this.writeGeometryCollection(WKBConstants.wkbGeometryCollection, geom, os); else {
							Assert.shouldNeverReachHere("Unknown Geometry type");
						}
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
}

