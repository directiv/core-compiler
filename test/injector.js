
var dir = require('fs').readdirSync;

var directives = dir(__dirname + '/directives').reduce(function(ds, name) {
  name = name.replace('.js', '');
  ds['data-' + name] = require(__dirname + '/directives/' + name);
  return ds;
}, {});

module.exports = function() {

  var components = {
    div: function(el) {
      injector.count++;
      return {
        tag: 'div',
        props: el.props,
        children: el.children,
        __pending: el.__pending
      };
    },
    span: function(el) {
      injector.count++;
      return {
        tag: 'span',
        props: el.props,
        children: el.children,
        __pending: el.__pending
      };
    }
  };

  var injector = {count: 0};

  injector.directive = function (name) {
    return directives[name];
  };
  injector.components = function(name) {
    return components[name];
  };

  return injector;
};
