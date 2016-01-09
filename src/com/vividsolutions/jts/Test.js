import WKTWriter from './io/WKTWriter';
import System from 'java/lang/System';
import WKTReader from './io/WKTReader';
export default class Test {
	get interfaces_() {
		return [];
	}
	static main(args) {
		var reader = new WKTReader();
		var writer = new WKTWriter();
		var a = reader.read("POLYGON((1 1, 1 5, 5 5, 5 1, 1 1))");
		var b = reader.read("POLYGON((0 0, 0 2, 2 2, 2 0, 0 0))");
		var union = a.union(b);
		System.out.println(writer.write(union));
	}
	getClass() {
		return Test;
	}
}

