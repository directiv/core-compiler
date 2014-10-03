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

if (process.env.NODE_ENV === 'development') {
  Props.prototype.merge = function(obj) {
    for (var k in obj) {
      this._value[k] = obj[k];
    }
  };
}
