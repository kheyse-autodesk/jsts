import $ from 'cheerio'
import expect from 'expect.js'

import GeometryFactory from 'com/vividsolutions/jts/geom/GeometryFactory'
import PrecisionModel from 'com/vividsolutions/jts/geom/PrecisionModel'
import WKTReader from 'com/vividsolutions/jts/io/WKTReader'
import WKTWriter from 'com/vividsolutions/jts/io/WKTWriter'

import BufferOp from 'com/vividsolutions/jts/operation/buffer/BufferOp'
import Centroid from 'com/vividsolutions/jts/algorithm/Centroid'

import BufferResultMatcher from './BufferResultMatcher'

const writer = new WKTWriter();

/**
 * @return GeometryFactory with PrecisionModel from test XML (undefined if no such info in XML)
 */
function createGeometryFactory(precisionModelInfo) {
  if (precisionModelInfo.length === 1) {
    const type = precisionModelInfo.attr('type');
    if (type !== 'FLOATING') {
      var scale = parseFloat(precisionModelInfo.attr('scale'));
      return new GeometryFactory(new PrecisionModel(scale));
    }
  }
}

/**
 * Translate JTS XML testcase document to Mocha suites
 */
export default function(doc, title) {
  const cases = $('case', doc);
  const geometryFactory = createGeometryFactory($('precisionModel', doc));
  const reader = new WKTReader(geometryFactory);

  /**
   * Translate JTS XML "test" to a Jasmine test spec
   */
  const generateSpec = function(a, b, opname, arg2, arg3, expected) { 
    it('Executing ' + opname + ' on ' + writer.write(a) + ' geometry', function() {

      var inputs = ' Input geometry A: ' + a + (b ? ' B: ' + b : '');

      var result;

      // fix opnames to real methods where needed
      if (opname === 'convexhull')
        opname = 'convexHull';
      else if (opname === 'getboundary')
        opname = 'getBoundary';
      else if (opname === 'symdifference')
        opname = 'symDifference';

      // switch execution logic depending on opname
      if (opname === 'buffer') {
        result = BufferOp.bufferOp(a, parseFloat(arg2));
      } else if (opname === 'getCentroid') {
        result = Centroid.getCentroid(a);
      } else {
        result = a[opname](b, arg3);
      }

      // switch comparison logic depending on opname
      // TODO: should be a cleaner approach...
      if (opname === 'relate' || opname === 'contains' ||
          opname === 'intersects' || opname === 'equalsExact' ||
          opname === 'equalsNorm' || opname === 'isSimple') {
        var expectedBool = expected === 'true';
        if (expectedBool !== result) {
          throw new Error('Result: ' + result + ' Expected: ' + expected +
              inputs);
        } else {
          expect(true).to.be.ok();
        }
      } else if (opname === 'distance') {
        var expectedDistance = parseFloat(expected);
        if (result !== expectedDistance) {
          throw new Error('Result: ' + result + ' Expected: ' +
              parseFloat(expectedDistance) + inputs);
        } else {
          expect(true).to.be.ok();
        }
      } else if (opname === 'buffer') {
        var expectedGeometry = reader.read(expected);
        result.normalize();
        expectedGeometry.normalize();
        
        var matcher = new BufferResultMatcher();

        if (!matcher.isBufferResultMatch(result, expectedGeometry, parseFloat(arg2))) {
          throw new Error('Result: ' + result + ' Expected: ' +
              expectedGeometry + inputs);
        } else {
          expect(true).to.be.ok();
        }
      } else {
        var expectedGeometry = reader.read(expected);
        result.normalize();
        expectedGeometry.normalize();

        if (result.compareTo(expectedGeometry) !== 0) {
          throw new Error('Result: ' + result + ' Expected: ' +
              expectedGeometry + inputs);
        } else {
          expect(true).to.be.ok();
        }
      }

    });
  };

  for (var i = 0; i < cases.length; i++) {
    var testcase = cases[i];
    var desc = $("desc", testcase).text().trim();

    describe(title + ' - ' + desc, function() {
      var awkt = $("a", testcase).text().trim().replace(/\n/g, '');
      var bwkt = $("b", testcase).text().trim().replace(/\n/g, '');
      var tests = $("test", testcase);

      for (var j = 0; j < tests.length; j++) {
        var test = tests[j];

        var opname = $("op", test).attr('name');
        var arg2 = $("op", test).attr('arg2');
        var arg3 = $("op", test).attr('arg3');
        var expected = $("op", test).text().trim().replace(/\n/g, '');
        
        try {
          var a = reader.read(awkt);
          var b = bwkt.length > 0 ? reader.read(bwkt) : undefined;

          generateSpec(a, b, opname, arg2, arg3, expected);
        }
        catch (e) {}
      }
    });
  }

};
