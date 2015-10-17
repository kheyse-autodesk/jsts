var WKTReader = require('./com/vividsolutions/jts/io/WKTReader')
var WKTWriter = require('./com/vividsolutions/jts/io/WKTWriter')
var BufferOp = require('./com/vividsolutions/jts/operation/buffer/BufferOp')
var OverlayOp = require('./com/vividsolutions/jts/operation/overlay/OverlayOp')
var RelateOp = require('./com/vividsolutions/jts/operation/relate/RelateOp')

var reader = new WKTReader()
var writer = new WKTWriter()




/*

var p1 = reader.read('POINT(1 1)')
var mp1 = reader.read('MULTIPOINT((1 1), (1 2))')
var l1 = reader.read('LINESTRING(1 1, 1 2)')
var r1 = reader.read('LINEARRING(1 1, 1 2, 3 3, 1 1)')
var a1 = reader.read('POLYGON(1 1, 1 2, 3 3, 1 1)')

var intersects = RelateOp.intersects(p1, a1)
console.log(intersects)

var buffer = BufferOp.bufferOp(l1, 10)
console.log(writer.write(buffer))

var intersection = OverlayOp.intersection(l1, a1)
console.log(writer.write(intersection))

var a = reader.read('LINESTRING(240 190, 120 120)')
var b = reader.read('POLYGON((110 240, 50 80, 240 70, 110 240))')
intersection = OverlayOp.intersection(a, b)
console.log(writer.write(intersection))
// expected: LINESTRING(177 153, 120 120)


*/

const a = reader.read('POINT (100 100)')
const expected = reader.read('POLYGON ((110 100, 109.80785280403231 98.04909677983872, 109.23879532511287 96.1731656763491, 108.31469612302546 94.44429766980397, 107.07106781186548 92.92893218813452, 105.55570233019603 91.68530387697454, 103.8268343236509 90.76120467488713, 101.95090322016128 90.19214719596769, 100 90, 98.04909677983872 90.19214719596769, 96.1731656763491 90.76120467488713, 94.44429766980397 91.68530387697454, 92.92893218813452 92.92893218813452, 91.68530387697454 94.44429766980397, 90.76120467488713 96.1731656763491, 90.19214719596769 98.04909677983872, 90 100.00000000000001, 90.19214719596769 101.9509032201613, 90.76120467488714 103.82683432365091, 91.68530387697456 105.55570233019603, 92.92893218813454 107.07106781186549, 94.44429766980399 108.31469612302547, 96.17316567634911 109.23879532511287, 98.04909677983873 109.80785280403231, 100.00000000000003 110, 101.95090322016131 109.8078528040323, 103.82683432365093 109.23879532511286, 105.55570233019606 108.31469612302544, 107.0710678118655 107.07106781186545, 108.31469612302547 105.555702330196, 109.23879532511287 103.82683432365086, 109.80785280403231 101.95090322016124, 110 100))  ')
var buffer = BufferOp.bufferOp(a, 10)
console.log(writer.write(buffer))

var area = buffer.getArea();
var diff = OverlayOp.symDifference(buffer, expected);
var areaDiff = diff.getArea();

console.log(areaDiff)
