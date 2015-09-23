/**
 * @param {string=} message Optional message
 * @extends {Error}
 * @constructor
 */
var OperationNotSupported = function(message) {
  this.message = message || '';
};
OperationNotSupported.prototype = new Error();


/**
 * @type {string}
 */
OperationNotSupported.prototype.name = 'OperationNotSupported';

module.exports = OperationNotSupported;
