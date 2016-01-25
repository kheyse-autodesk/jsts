
import WKTReader from './com/vividsolutions/jts/io/WKTReader'
import GeometryFactory from './com/vividsolutions/jts/geom/GeometryFactory'
import PrecisionModel from './com/vividsolutions/jts/geom/PrecisionModel'
import GeometryMixin from './com/vividsolutions/jts/geom/GeometryMixin'

String.prototype.equals = function(other) {
  return this === other
}

const factory = new GeometryFactory(new PrecisionModel(1.0))
var reader = new WKTReader(factory)

/*
var p1 = reader.read('POINT(1 1)')
var mp1 = reader.read('MULTIPOINT((1 1), (1 2))')
var l1 = reader.read('LINESTRING(1 1, 1 2)')
var r1 = reader.read('LINEARRING(1 1, 1 2, 3 3, 1 1)')
var a1 = reader.read('POLYGON(0 0, 1 2, 3 3, 0 0)')
var a2 = reader.read('POLYGON(1 1, 1 3, 4 4, 1 1)')
*/

/*
var intersects = RelateOp.intersects(p1,a1)
console.log(intersects)

var buffer = BufferOp.bufferOp(l1, 10)
console.log(writer.write(buffer))

var intersection = OverlayOp.intersection(l1, a1)
console.log(writer.write(intersection))
*/

/*
var a = reader.read('LINESTRING(240 190, 120 120)')
var b = reader.read('POLYGON((110 240, 50 80, 240 70, 110 240))')
var intersection = OverlayOp.intersection(a, b)
console.log(writer.write(intersection))
*/
// expected: LINESTRING(177 153, 120 120)

//var union = OverlayOp.union(a1, a2)
// console.log(writer.write(union))

const p1 = reader.read('POLYGON((160 330, 60 260, 20 150, 60 40, 190 20, 270 130, 260 250, 160 330), (140 240, 80 190, 90 100, 160 70, 210 130, 210 210, 140 240))')
const p2 = reader.read('POLYGON((300 330, 190 270, 150 170, 150 110, 250 30, 380 50, 380 250, 300 330), (290 240, 240 200, 240 110, 290 80, 330 170, 290 240))')
const intersection = p1.intersection(p2)
console.log(p1)
console.log('intersection: ' + intersection)
