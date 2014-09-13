exports.compile = function(input) {
  return input;
};

exports.props = function(input, state, props) {
  return props.set('href', state.get(input));
};
