var ArrayList = require('./ArrayList');
var Map = require('./Map');


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
  this.object_ = {};
};
HashMap.prototype = new Map();


/**
 * @override
 */
HashMap.prototype.get = function(key) {
  return this.object_[key] || null;
};


/**
 * @override
 */
HashMap.prototype.put = function(key, value) {
  this.object_[key] = value;
  return value;
};


/**
 * @override
 */
HashMap.prototype.values = function() {
  var arrayList = new ArrayList();
  for (var key in this.object_) {
    if (this.object_.hasOwnProperty(key)) {
      arrayList.add(this.object_[key]);
    }
  }
  return arrayList;
};


/**
 * @override
 */
HashMap.prototype.size = function() {
  return this.values().size();
};

module.exports = HashMap;
