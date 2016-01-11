import StringBuffer from 'java/lang/StringBuffer';
import AttributesImpl from 'org/xml/sax/helpers/AttributesImpl';
import Stack from 'java/util/Stack';
import LinkedList from 'java/util/LinkedList';
import GeometryStrategies from './GeometryStrategies';
import ContentHandler from 'org/xml/sax/ContentHandler';
import DefaultHandler from 'org/xml/sax/helpers/DefaultHandler';
export default class GMLHandler extends DefaultHandler {
	constructor(...args) {
		super();
		(() => {
			this.stack = new Stack();
			this.delegate = null;
			this.gf = null;
			this.locator = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [gf, delegate] = args;
						this.delegate = delegate;
						this.gf = gf;
						this.stack.push(new Handler(null, null));
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get Handler() {
		return Handler;
	}
	getGeometry() {
		if (this.stack.size() === 1) {
			var h = this.stack.peek();
			if (h.children.size() === 1) return h.children.get(0);
			return this.gf.createGeometryCollection(h.children.toArray(new Array(this.stack.size())));
		}
		throw new IllegalStateException("Parse did not complete as expected, there are " + this.stack.size() + " elements on the Stack");
	}
	isGeometryComplete() {
		if (this.stack.size() > 1) return false;
		var h = this.stack.peek();
		if (h.children.size() < 1) return false;
		return true;
	}
	getDocumentLocator() {
		return this.locator;
	}
	endElement(uri, localName, qName) {
		var thisAction = this.stack.pop();
		this.stack.peek().keep(thisAction.create(this.gf));
	}
	warning(e) {
		if (this.delegate !== null) this.delegate.warning(e); else super.warning(e);
	}
	characters(ch, start, length) {
		if (!this.stack.isEmpty()) this.stack.peek().addText(new String(ch, start, length));
	}
	startElement(uri, localName, qName, attributes) {
		var ps = GeometryStrategies.findStrategy(uri, localName);
		if (ps === null) {
			var qn = qName.substring(qName.indexOf(':') + 1, qName.length);
			ps = GeometryStrategies.findStrategy(null, qn);
		}
		var h = new Handler(ps, attributes);
		this.stack.push(h);
	}
	error(e) {
		if (this.delegate !== null) this.delegate.error(e); else super.error(e);
	}
	ignorableWhitespace(ch, start, length) {
		if (!this.stack.isEmpty()) this.stack.peek().addText(" ");
	}
	setDocumentLocator(locator) {
		this.locator = locator;
		if (this.delegate !== null && this.delegate instanceof ContentHandler) this.delegate.setDocumentLocator(locator);
	}
	fatalError(e) {
		if (this.delegate !== null) this.delegate.fatalError(e); else super.fatalError(e);
	}
	getClass() {
		return GMLHandler;
	}
}
class Handler {
	constructor(...args) {
		(() => {
			this.attrs = null;
			this.strategy = null;
			this.text = null;
			this.children = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [strategy, attributes] = args;
						if (attributes !== null) this.attrs = new AttributesImpl(attributes);
						this.strategy = strategy;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	addText(str) {
		if (this.text === null) this.text = new StringBuffer();
		this.text.append(str);
	}
	create(gf) {
		return this.strategy.parse(this, gf);
	}
	keep(obj) {
		if (this.children === null) this.children = new LinkedList();
		this.children.add(obj);
	}
	getClass() {
		return Handler;
	}
}

