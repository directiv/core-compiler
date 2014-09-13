/**
 * Module dependencies
 */

var CoreMap = require('directiv-core-map');
var reduce = require('directiv-core-reduce');
var debug = require('debug')('directiv:core:transform');

/**
 * Compile an AST to a render function
 *
 * @param {Object|Array} ast
 * @param {Injector} injector
 * @return {Object}
 */

module.exports = function(ast, injector) {
  if (!Array.isArray(ast)) return compileNode(ast, injector);
  return ast.map(function(node) {
    return compileNode(node, injector);
  });
};

/**
 * Compile a node in an AST
 *
 * @param {Object} ast
 * @param {Injector} injector
 * @return {RenderFunction}
 */

function compileNode(ast, injector) {
  debug('compiling', ast);

  var directivesI = compileProps(ast.props, injector);
  var childrenI = compileChildren(ast.children || [], injector);

  var cache = createCache();

  var computeState = genComputeState(directivesI, injector, cache);
  var computeProperties = genComputeProperties(directivesI, childrenI, injector, cache, ast.name);

  return function render(initialState) {
    debug('generating state');

    // get the current state from the directives
    var state = computeState(initialState);

    // call the directives to fetch tag, props, children
    var el = computeProperties(state);

    // TODO support not rendering a node
    // TODO support only rendering a node's children

    var children = el.children;
    if (children) evalChildren(el.children);

    // TODO only do this in development
    // clear the injector cache
    clearCache(cache);

    var element = injector.components(el.tag);
    return element(el.props, children);
  };
}

/**
 * Creates a new cache to store injected values
 *
 * @return {Object}
 */

function createCache() {
  return clearCache({});
}

/**
 * Clear the injected cache
 *
 * @param {Object}
 * @return {Object}
 */

function clearCache(cache) {
  cache.directives = {};
  return cache;
}

/**
 * Evaluate the children
 *
 * @param {Array} children
 */

function evalChildren(children) {
  if (!Array.isArray(children)) return;
  var child, value, state, tmpl;
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];
    value = child._value;
    state = value.state;
    tmpl = value._tmpl;
    children[i] = tmpl(new CoreMap(state));
  }
}

/**
 * Generate a compute state function
 *
 * @param {ReduceFunction} directivesI
 * @param {Injector} injector
 * @param {Object} cache
 * @return {Function}
 */

function genComputeState(directivesI, injector, cache) {
  return function (init) {
    return directivesI(function(state, config, key) {
      var directive = cache.directives[key];
      if (!directive) cache.directives[key] = directive = injector.directive(key);
      var newState = directive.state.call(injector, config, state);

      // TODO check and see if the newState has a 'pending' flag
      if (newState !== false) state = newState;

      return state;
    }, init || new CoreMap());
  }
}

/**
 * Generate a compute properties function
 *
 * @param {ReduceFunction} directivesI
 * @param {ReduceFunction} childrenI
 * @param {Injector} injector
 * @param {Object} cache
 * @param {String} tag
 * @return {Function}
 */

function genComputeProperties(directivesI, childrenI, injector, cache, tag) {
  return function (state) {
    var el = directivesI(function(el, config, key) {
      var d = cache.directives[key];
      var getTag = d.tag;
      var getProps = d.getProps;

      if (getTag) el.tag = getTag.call(injector, config, state, el.tag);
      if (getProps) el.props = getProps.call(injector, config, state, el.props);

      var children = el.children;
      if (!children) return el;

      var getChildren = cache.directives[key].children;
      if (!getChildren) return el;

      el.children = getChildren.call(injector, config, state, children);
      return el;
    }, {
      children: inherit(childrenI, state._value),
      tag: tag,
      props: new CoreMap(),
      state: state._value
    });
    el.props = el.props._value;
    return el;
  }
}

/**
 * Pass state down to children
 *
 * @param {ReduceFunction} childrenI
 * @param {Object} parent
 * @return {Array}
 */

function inherit(childrenI, parent) {
  return childrenI(function(children, child, i) {
    children[i] = child.set('state', parent);
    return children;
  }, []);
}

/**
 * Create a reducer from the properties listed
 *
 * @param {Object} props
 * @param {Injector} injector
 * @param {ReduceFunction}
 */

function compileProps(props, injector) {
  var compiledProps = {};
  var directive;
  for (var k in props) {
    directive = injector.directive(k);
    if (!directive) continue;
    compiledProps[k] = directive.compile(props[k]);
  }
  debug('props compiled', compiledProps);
  return reduce(compiledProps);
}

/**
 * Create a reducer from the listed children
 *
 * @param {Array} children
 * @param {Injector} injector
 * @return {ReduceFunction}
 */

function compileChildren(children, injector) {
  var length = children.length;
  var acc = new Array(length);
  var child;
  for (var i = 0; i < length; i++) {
    child = compileNode(children[i], injector);
    acc[i] = new CoreMap({_tmpl: child});
  }
  debug('children compiled', acc);
  return reduce(acc, true);
}
