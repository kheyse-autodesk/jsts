import WKTWriter from './io/WKTWriter';
import GeometryFactory from './geom/GeometryFactory';
import System from 'java/lang/System';
import WKTReader from './io/WKTReader';
import PrecisionModel from './geom/PrecisionModel';
export default class Test {
	get interfaces_() {
		return [];
	}
	static main(args) {
		var reader = new WKTReader();
		var writer = new WKTWriter();
		var po1 = reader.read("POLYGON((160 330, 60 260, 20 150, 60 40, 190 20, 270 130, 260 250, 160 330), (140 240, 80 190, 90 100, 160 70, 210 130, 210 210, 140 240))");
		var po2 = reader.read("POLYGON((300 330, 190 270, 150 170, 150 110, 250 30, 380 50, 380 250, 300 330), (290 240, 240 200, 240 110, 290 80, 330 170, 290 240))");
		var pm = new PrecisionModel(1.0);
		var gf = new GeometryFactory(pm);
		po1 = gf.createGeometry(po1);
		po2 = gf.createGeometry(po2);
		var intersection = po1.intersection(po2);
		System.out.println(intersection);
	}
	getClass() {
		return Test;
	}
}

