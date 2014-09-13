exports.compile = function(input) {
  var parts = input.split('.');
  return {
    path: parts.slice(1),
    first: parts[0],
    target: parts[parts.length - 1]
  };
};

exports.state = function(config, state) {
  var path = config.path;
  var target = config.target;
  var val = state.get(config.first);
  return state.set(target, get(path, path.length, 0, val));
};

exports.children = function(config, state, children) {
  return state.get(config.target) || '';
};

function get(path, max, i, parent) {
  var val = parent[path[i]];
  if (max - 1 === i) return val;
  if (val) return get(path, max, i + 1, val);
  return undefined;
}
