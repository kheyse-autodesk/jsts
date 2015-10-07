import StringReader from 'java/io/StringReader';
import GeometryFactory from '../geom/GeometryFactory';
import Coordinate from '../geom/Coordinate';
import Double from 'java/lang/Double';
import ParseException from './ParseException';
import StreamTokenizer from 'java/io/StreamTokenizer';
import ArrayList from 'java/util/ArrayList';
import Assert from '../util/Assert';
import IOException from 'java/io/IOException';
import Reader from 'java/io/Reader';
export default class WKTReader {
	constructor(...args) {
		(() => {
			this.geometryFactory = null;
			this.precisionModel = null;
			this.tokenizer = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						overloads.call(this, new GeometryFactory());
					})(...args);
				case 1:
					return ((...args) => {
						let [geometryFactory] = args;
						this.geometryFactory = geometryFactory;
						this.precisionModel = geometryFactory.getPrecisionModel();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get EMPTY() {
		return "EMPTY";
	}
	static get COMMA() {
		return ",";
	}
	static get L_PAREN() {
		return "(";
	}
	static get R_PAREN() {
		return ")";
	}
	static get NAN_SYMBOL() {
		return "NaN";
	}
	static get ALLOW_OLD_JTS_MULTIPOINT_SYNTAX() {
		return true;
	}
	read(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Reader) {
						return ((...args) => {
							let [reader] = args;
							this.tokenizer = new StreamTokenizer(reader);
							this.tokenizer.resetSyntax();
							this.tokenizer.wordChars('a', 'z');
							this.tokenizer.wordChars('A', 'Z');
							this.tokenizer.wordChars(128 + 32, 255);
							this.tokenizer.wordChars('0', '9');
							this.tokenizer.wordChars('-', '-');
							this.tokenizer.wordChars('+', '+');
							this.tokenizer.wordChars('.', '.');
							this.tokenizer.whitespaceChars(0, ' ');
							this.tokenizer.commentChar('#');
							try {
								return this.readGeometryTaggedText();
							} catch (e) {
								if (e instanceof IOException) {
									throw new ParseException(e.toString());
								} else throw e;
							} finally {}
						})(...args);
					} else if (typeof args[0] === "string") {
						return ((...args) => {
							let [wellKnownText] = args;
							var reader = new StringReader(wellKnownText);
							try {
								return this.read(reader);
							} finally {
								reader.close();
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	parseErrorExpected(expected) {
		if (this.tokenizer.ttype === StreamTokenizer.TT_NUMBER) Assert.shouldNeverReachHere("Unexpected NUMBER token");
		if (this.tokenizer.ttype === StreamTokenizer.TT_EOL) Assert.shouldNeverReachHere("Unexpected EOL token");
		var tokenStr = this.tokenString();
		this.parseErrorWithLine("Expected " + expected + " but found " + tokenStr);
	}
	getCoordinates() {
		var nextToken = this.getNextEmptyOrOpener();
		if (nextToken.equals(WKTReader.EMPTY)) {
			return [];
		}
		var coordinates = new ArrayList();
		coordinates.add(this.getPreciseCoordinate());
		nextToken = this.getNextCloserOrComma();
		while (nextToken.equals(WKTReader.COMMA)) {
			coordinates.add(this.getPreciseCoordinate());
			nextToken = this.getNextCloserOrComma();
		}
		var array = new Array(coordinates.size());
		return coordinates.toArray(array);
	}
	readLinearRingText() {
		return this.geometryFactory.createLinearRing(this.getCoordinates());
	}
	isNumberNext() {
		var type = this.tokenizer.nextToken();
		this.tokenizer.pushBack();
		return type === StreamTokenizer.TT_WORD;
	}
	readLineStringText() {
		return this.geometryFactory.createLineString(this.getCoordinates());
	}
	lookaheadWord() {
		var nextWord = this.getNextWord();
		this.tokenizer.pushBack();
		return nextWord;
	}
	getNextCloserOrComma() {
		var nextWord = this.getNextWord();
		if (nextWord.equals(WKTReader.COMMA) || nextWord.equals(WKTReader.R_PAREN)) {
			return nextWord;
		}
		this.parseErrorExpected(WKTReader.COMMA + " or " + WKTReader.R_PAREN);
		return null;
	}
	toPoints(coordinates) {
		var points = new ArrayList();
		for (var i = 0; i < coordinates.length; i++) {
			points.add(this.geometryFactory.createPoint(coordinates[i]));
		}
		return points.toArray([]);
	}
	readMultiPointText() {
		var nextToken = this.getNextEmptyOrOpener();
		if (nextToken.equals(WKTReader.EMPTY)) {
			return this.geometryFactory.createMultiPoint(new Array(0));
		}
		if (WKTReader.ALLOW_OLD_JTS_MULTIPOINT_SYNTAX) {
			var nextWord = this.lookaheadWord();
			if (nextWord !== WKTReader.L_PAREN) {
				return this.geometryFactory.createMultiPoint(this.toPoints(this.getCoordinatesNoLeftParen()));
			}
		}
		var points = new ArrayList();
		var point = this.readPointText();
		points.add(point);
		nextToken = this.getNextCloserOrComma();
		while (nextToken.equals(WKTReader.COMMA)) {
			point = this.readPointText();
			points.add(point);
			nextToken = this.getNextCloserOrComma();
		}
		var array = new Array(points.size());
		return this.geometryFactory.createMultiPoint(points.toArray(array));
	}
	readMultiPolygonText() {
		var nextToken = this.getNextEmptyOrOpener();
		if (nextToken.equals(WKTReader.EMPTY)) {
			return this.geometryFactory.createMultiPolygon([]);
		}
		var polygons = new ArrayList();
		var polygon = this.readPolygonText();
		polygons.add(polygon);
		nextToken = this.getNextCloserOrComma();
		while (nextToken.equals(WKTReader.COMMA)) {
			polygon = this.readPolygonText();
			polygons.add(polygon);
			nextToken = this.getNextCloserOrComma();
		}
		var array = new Array(polygons.size());
		return this.geometryFactory.createMultiPolygon(polygons.toArray(array));
	}
	getCoordinatesNoLeftParen() {
		var nextToken = null;
		var coordinates = new ArrayList();
		coordinates.add(this.getPreciseCoordinate());
		nextToken = this.getNextCloserOrComma();
		while (nextToken.equals(WKTReader.COMMA)) {
			coordinates.add(this.getPreciseCoordinate());
			nextToken = this.getNextCloserOrComma();
		}
		var array = new Array(coordinates.size());
		return coordinates.toArray(array);
	}
	readMultiLineStringText() {
		var nextToken = this.getNextEmptyOrOpener();
		if (nextToken.equals(WKTReader.EMPTY)) {
			return this.geometryFactory.createMultiLineString([]);
		}
		var lineStrings = new ArrayList();
		var lineString = this.readLineStringText();
		lineStrings.add(lineString);
		nextToken = this.getNextCloserOrComma();
		while (nextToken.equals(WKTReader.COMMA)) {
			lineString = this.readLineStringText();
			lineStrings.add(lineString);
			nextToken = this.getNextCloserOrComma();
		}
		var array = new Array(lineStrings.size());
		return this.geometryFactory.createMultiLineString(lineStrings.toArray(array));
	}
	getNextWord() {
		var type = this.tokenizer.nextToken();
		switch (type) {
			case StreamTokenizer.TT_WORD:
				var word = this.tokenizer.sval;
				if (word.equalsIgnoreCase(WKTReader.EMPTY)) return WKTReader.EMPTY;
				return word;
			case '(':
				return WKTReader.L_PAREN;
			case ')':
				return WKTReader.R_PAREN;
			case ',':
				return WKTReader.COMMA;
		}
		this.parseErrorExpected("word");
		return null;
	}
	tokenString() {
		switch (this.tokenizer.ttype) {
			case StreamTokenizer.TT_NUMBER:
				return "<NUMBER>";
			case StreamTokenizer.TT_EOL:
				return "End-of-Line";
			case StreamTokenizer.TT_EOF:
				return "End-of-Stream";
			case StreamTokenizer.TT_WORD:
				return "'" + this.tokenizer.sval + "'";
		}
		return "'" + this.tokenizer.ttype + "'";
	}
	getNextNumber() {
		var type = this.tokenizer.nextToken();
		switch (type) {
			case StreamTokenizer.TT_WORD:
				{
					if (this.tokenizer.sval.equalsIgnoreCase(WKTReader.NAN_SYMBOL)) {
						return Double.NaN;
					} else {
						try {
							return Double.parseDouble(this.tokenizer.sval);
						} catch (ex) {
							if (ex instanceof NumberFormatException) {
								this.parseErrorWithLine("Invalid number: " + this.tokenizer.sval);
							} else throw ex;
						} finally {}
					}
				}
		}
		this.parseErrorExpected("number");
		return 0.0;
	}
	readGeometryCollectionText() {
		var nextToken = this.getNextEmptyOrOpener();
		if (nextToken.equals(WKTReader.EMPTY)) {
			return this.geometryFactory.createGeometryCollection([]);
		}
		var geometries = new ArrayList();
		var geometry = this.readGeometryTaggedText();
		geometries.add(geometry);
		nextToken = this.getNextCloserOrComma();
		while (nextToken.equals(WKTReader.COMMA)) {
			geometry = this.readGeometryTaggedText();
			geometries.add(geometry);
			nextToken = this.getNextCloserOrComma();
		}
		var array = new Array(geometries.size());
		return this.geometryFactory.createGeometryCollection(geometries.toArray(array));
	}
	parseErrorWithLine(msg) {
		throw new ParseException(msg + " (line " + this.tokenizer.lineno() + ")");
	}
	readPointText() {
		var nextToken = this.getNextEmptyOrOpener();
		if (nextToken.equals(WKTReader.EMPTY)) {
			return this.geometryFactory.createPoint(null);
		}
		var point = this.geometryFactory.createPoint(this.getPreciseCoordinate());
		this.getNextCloser();
		return point;
	}
	readGeometryTaggedText() {
		var type = null;
		try {
			type = this.getNextWord();
		} catch (e) {
			if (e instanceof IOException) {
				return null;
			} else if (e instanceof ParseException) {
				return null;
			} else throw e;
		} finally {}
		if (type.equalsIgnoreCase("POINT")) {
			return this.readPointText();
		} else if (type.equalsIgnoreCase("LINESTRING")) {
			return this.readLineStringText();
		} else if (type.equalsIgnoreCase("LINEARRING")) {
			return this.readLinearRingText();
		} else if (type.equalsIgnoreCase("POLYGON")) {
			return this.readPolygonText();
		} else if (type.equalsIgnoreCase("MULTIPOINT")) {
			return this.readMultiPointText();
		} else if (type.equalsIgnoreCase("MULTILINESTRING")) {
			return this.readMultiLineStringText();
		} else if (type.equalsIgnoreCase("MULTIPOLYGON")) {
			return this.readMultiPolygonText();
		} else if (type.equalsIgnoreCase("GEOMETRYCOLLECTION")) {
			return this.readGeometryCollectionText();
		}
		this.parseErrorWithLine("Unknown geometry type: " + type);
		return null;
	}
	getPreciseCoordinate() {
		var coord = new Coordinate();
		coord.x = this.getNextNumber();
		coord.y = this.getNextNumber();
		if (this.isNumberNext()) {
			coord.z = this.getNextNumber();
		}
		this.precisionModel.makePrecise(coord);
		return coord;
	}
	readPolygonText() {
		var nextToken = this.getNextEmptyOrOpener();
		if (nextToken.equals(WKTReader.EMPTY)) {
			return this.geometryFactory.createPolygon(this.geometryFactory.createLinearRing([]), []);
		}
		var holes = new ArrayList();
		var shell = this.readLinearRingText();
		nextToken = this.getNextCloserOrComma();
		while (nextToken.equals(WKTReader.COMMA)) {
			var hole = this.readLinearRingText();
			holes.add(hole);
			nextToken = this.getNextCloserOrComma();
		}
		var array = new Array(holes.size());
		return this.geometryFactory.createPolygon(shell, holes.toArray(array));
	}
	getNextCloser() {
		var nextWord = this.getNextWord();
		if (nextWord.equals(WKTReader.R_PAREN)) {
			return nextWord;
		}
		this.parseErrorExpected(WKTReader.R_PAREN);
		return null;
	}
	getNextEmptyOrOpener() {
		var nextWord = this.getNextWord();
		if (nextWord.equals(WKTReader.EMPTY) || nextWord.equals(WKTReader.L_PAREN)) {
			return nextWord;
		}
		this.parseErrorExpected(WKTReader.EMPTY + " or " + WKTReader.L_PAREN);
		return null;
	}
	getClass() {
		return WKTReader;
	}
}

