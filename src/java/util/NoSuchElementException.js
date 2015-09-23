/**
 * @param {string=} message Optional message
 * @extends {Error}
 * @constructor
 */
var NoSuchElementException = function(message) {
  this.message = message || '';
};
NoSuchElementException.prototype = new Error();


/**
 * @type {string}
 */
NoSuchElementException.prototype.name = 'NoSuchElementException';

module.exports = NoSuchElementException;
