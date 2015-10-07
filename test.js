var Coordinate = require('com/vividsolutions/jts/geom/Coordinate')

var c1 = new Coordinate(1, 1)
var c2 = new Coordinate(1, 2)
var c3 = new Coordinate(3, 3)

var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory')
var factory = new GeometryFactory()

var p1 = factory.createPoint(c3)
var l1 = factory.createLineString([c1, c2])
var r1 = factory.createLinearRing([c1, c2, c3, c1])
var a1 = factory.createPolygon(r1)

var RelateOp = require('com/vividsolutions/jts/operation/relate/RelateOp')
var intersects = RelateOp.intersects(p1, a1)
console.log(intersects)

var GeometryFactory = require('com/vividsolutions/jts/geom/GeometryFactory')
var factory = new GeometryFactory()

var p1 = factory.createPoint(c1)

var BufferOp = require('com/vividsolutions/jts/operation/buffer/BufferOp')
var buffer = BufferOp.bufferOp(p1, 10)
console.log(buffer)


var OverlayOp = require('com/vividsolutions/jts/operation/overlay/OverlayOp')
var intersection = OverlayOp.intersection(l1, a1)
console.log(intersection)
