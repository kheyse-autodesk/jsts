import ShapeReader from './ShapeReader';
import FontRenderContext from 'java/awt/font/FontRenderContext';
import ArrayList from 'java/util/ArrayList';
import Font from 'java/awt/Font';
export default class FontGlyphReader {
	get interfaces_() {
		return [];
	}
	static get FONT_SERIF() {
		return "Serif";
	}
	static get FONT_SANSERIF() {
		return "SansSerif";
	}
	static get FONT_SANSSERIF() {
		return "SansSerif";
	}
	static get FONT_MONOSPACED() {
		return "Monospaced";
	}
	static get FLATNESS_FACTOR() {
		return 400;
	}
	static read(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 3:
					return ((...args) => {
						let [text, font, geomFact] = args;
						var flatness = font.getSize() / FontGlyphReader.FLATNESS_FACTOR;
						return FontGlyphReader.read(text, font, flatness, geomFact);
					})(...args);
				case 4:
					if (typeof args[0] === "string") {
						return ((...args) => {
							let [text, font, flatness, geomFact] = args;
							var chs = text.toCharArray();
							var fontContext = new FontRenderContext(null, false, true);
							var gv = font.createGlyphVector(fontContext, chs);
							var polys = new ArrayList();
							for (var i = 0; i < gv.getNumGlyphs(); i++) {
								var geom = ShapeReader.read(gv.getGlyphOutline(i), flatness, geomFact);
								for (var j = 0; j < geom.getNumGeometries(); j++) {
									polys.add(geom.getGeometryN(j));
								}
							}
							return geomFact.buildGeometry(polys);
						})(...args);
					} else if (typeof args[0] === "string") {
						return ((...args) => {
							let [text, fontName, pointSize, geomFact] = args;
							return FontGlyphReader.read(text, new Font(fontName, Font.PLAIN, pointSize), geomFact);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return FontGlyphReader;
	}
}

