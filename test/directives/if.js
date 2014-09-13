exports.compile = function(input) {
  return input === 'true';
};

exports.tag = function(conf, tag) {
  return conf ? tag : false;
};
