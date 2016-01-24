import WKTReader from './com/vividsolutions/jts/io/WKTReader'

import GeometryMixin from './com/vividsolutions/jts/geom/GeometryMixin'

var reader = new WKTReader()

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

const p = reader.read('POLYGON((40 60, 420 60, 420 320, 40 320, 40 60))')
const boundary = p.getBoundary()
const boundaryText = boundary.toString()

console.log('Boundary: ' + boundaryText)
