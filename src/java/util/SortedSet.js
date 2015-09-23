var Set = require('./Set');


/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/SortedSet.html
 *
 * @extends {Set}
 * @constructor
 */
var SortedSet = function() {};
SortedSet.prototype = new Set();

module.exports = SortedSet;
