/**
 * @param {string=} message Optional message
 * @extends {Error}
 * @constructor
 */
var EmptyStackException = function(message) {
  this.message = message || '';
};
EmptyStackException.prototype = new Error();


/**
 * @type {string}
 */
EmptyStackException.prototype.name = 'EmptyStackException';

module.exports = EmptyStackException;
