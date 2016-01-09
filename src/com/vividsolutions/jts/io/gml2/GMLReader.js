import SAXParserFactory from 'javax/xml/parsers/SAXParserFactory';
import StringReader from 'java/io/StringReader';
import GeometryFactory from '../../geom/GeometryFactory';
import InputSource from 'org/xml/sax/InputSource';
import GMLHandler from './GMLHandler';
import Reader from 'java/io/Reader';
export default class GMLReader {
	get interfaces_() {
		return [];
	}
	read(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					if (args[0] instanceof Reader && args[1] instanceof GeometryFactory) {
						return ((...args) => {
							let [reader, geometryFactory] = args;
							var fact = SAXParserFactory.newInstance();
							fact.setNamespaceAware(false);
							fact.setValidating(false);
							var parser = fact.newSAXParser();
							if (geometryFactory === null) geometryFactory = new GeometryFactory();
							var gh = new GMLHandler(geometryFactory, null);
							parser.parse(new InputSource(reader), gh);
							return gh.getGeometry();
						})(...args);
					} else if (typeof args[0] === "string" && args[1] instanceof GeometryFactory) {
						return ((...args) => {
							let [gml, geometryFactory] = args;
							return this.read(new StringReader(gml), geometryFactory);
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	getClass() {
		return GMLReader;
	}
}

