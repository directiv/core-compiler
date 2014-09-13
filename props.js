module.exports = Props;

/**
 * Create a props structure
 *
 * since this is key value its ok if its mutable
 */

function Props() {
  this._value = {};
}

Props.prototype.set = function(key, value) {
  this._value[key] = value;
  return this;
};
