exports.compile = function(input) {
  var parts = input.split('.');
  return {
    path: input,
    target: parts[parts.length - 1]
  };
};

exports.state = function(config, state) {
  var parts = config.parts;
  var target = config.target;
  return state.set(target, state.get(config.path));
};

exports.children = function(config, state, children) {
  return state.get(config.target) || '';
};
