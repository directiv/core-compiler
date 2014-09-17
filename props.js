module.exports = Props;

/**
 * Create a props structure
 *
 * since this is key value its ok if its mutable
 */

function Props(val) {
  this._value = val || {};
}

Props.prototype.set = function(key, value) {
  this._value[key] = value;
  return this;
};
