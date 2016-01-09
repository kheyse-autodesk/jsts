var ArrayList = require('./ArrayList');
var MapInterface = require('./Map');


/**
 * @see http://download.oracle.com/javase/6/docs/api/java/util/HashMap.html
 *
 * @extends {javascript.util.Map}
 * @constructor
 * @export
 */
var HashMap = function() {
  /**
   * @type {Object}
   * @private
  */
  this.map_ = new Map();
};
HashMap.prototype = new MapInterface();


/**
 * @override
 */
HashMap.prototype.get = function(key) {
  return this.map_.get(key) || null;
};


/**
 * @override
 */
HashMap.prototype.put = function(key, value) {
  this.map_.set(key, value);
  return value;
};


/**
 * @override
 */
HashMap.prototype.values = function() {
  const arrayList = new ArrayList()
  Array.from(this.map_.values()).forEach(value => arrayList.add(value))
  return arrayList
};


/**
 * @override
 */
HashMap.prototype.size = function() {
  return this.map_.size();
};

module.exports = HashMap;
