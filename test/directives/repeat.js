exports.compile = function(input) {
  var parts = input.split(' in ');
  var source = parts[parts.length - 1];
  return {
    source: source,
    target: parts[0],
    path: parts[1].split('.')
  };
};

exports.state = function(config, state) {
  var source = config.source;
  return state.set(source, state.getIn(config.path));
};

exports.children = function(config, state, children) {
  var items = state.get(config.source);
  var arr = [];
  if (!items) return arr;

  var target = config.target;
  var childValue;
  var i, c, child;

  var path = ['state', target];

  for (i = 0; i < items.length; i++) {
    function update() {return items[i]};
    for (c = 0; c < children.length; c++) {
      child = children[c];
      if (!child) continue;
      child = child.updateIn(path, update);
      arr.push(child);
    }
  }
  return arr;
};
