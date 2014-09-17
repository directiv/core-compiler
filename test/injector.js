
var dir = require('fs').readdirSync;

var modules = dir(__dirname + '/directives').reduce(function(ds, name) {
  name = name.replace('.js', '');
  ds['data-' + name] = require(__dirname + '/directives/' + name);
  return ds;
}, {});

module.exports = function() {

  modules['el-div'] = function(el) {
    injector.count++;
    return {
      tag: 'div',
      props: el.props,
      children: el.children
    };
  };

  modules['el-span'] = function(el) {
    injector.count++;
    return {
      tag: 'span',
      props: el.props,
      children: el.children
    };
  };

  function injector(name) {
    return modules[name];
  }
  injector.count = 0;

  return injector;
};
