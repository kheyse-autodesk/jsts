var WKTReader = require('./com/vividsolutions/jts/io/WKTReader')
var WKTWriter = require('./com/vividsolutions/jts/io/WKTWriter')
var BufferOp = require('./com/vividsolutions/jts/operation/buffer/BufferOp')
var OverlayOp = require('./com/vividsolutions/jts/operation/overlay/OverlayOp')
var RelateOp = require('./com/vividsolutions/jts/operation/relate/RelateOp')

var reader = new WKTReader()
var writer = new WKTWriter()

var p1 = reader.read('POINT(1 1)')
var l1 = reader.read('LINESTRING(1 1, 1 2)')
var r1 = reader.read('LINEARRING(1 1, 1 2, 3 3, 1 1)')
var a1 = reader.read('POLYGON(1 1, 1 2, 3 3, 1 1)')

/*
var intersects = RelateOp.intersects(p1, a1)
console.log(intersects)
*/

var buffer = BufferOp.bufferOp(l1, 10)
console.log(writer.write(buffer))

/*
var intersection = OverlayOp.intersection(l1, a1)
console.log(intersection)
*/

var a = reader.read('LINESTRING(240 190, 120 120)')
var b = reader.read('POLYGON((110 240, 50 80, 240 70, 110 240))')
var intersection = OverlayOp.intersection(a, b)
console.log(writer.write(intersection))
// expected: LINESTRING(177 153, 120 120)

