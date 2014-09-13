/**
 * Module dependencies
 */

var CoreMap = require('directiv-core-map');
var reduce = require('directiv-core-reduce');
var debug = require('debug')('directiv:core:compiler');

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

  if (typeof ast === 'string') return function render() {return ast;}

  var directivesReduce = compileProps(ast.props, injector);
  var childrenReduce = compileChildren(ast.children || [], injector);

  var cache = createCache();

  var computeState = genComputeState(directivesReduce, injector, cache);
  var computeProperties = genComputeProperties(directivesReduce, childrenReduce, injector, cache, ast.tag || 'div');

  return function render(initialState) {
    debug('generating state');

    // get the current state from the directives
    var state = computeState(initialState);

    // call the directives to fetch tag, props, children
    var el = computeProperties(state);

    // don't render this element
    var tag = el.tag;
    if (tag === false) return '';

    var children = el.children;
    if (children) children = evalChildren(el.children);

    // merge this node's children into the parent's
    if (el.childrenOnly) return children || [];

    // clear the injector cache in development
    if (process.env === 'development') {
      clearCache(cache);
    }

    var element = injector.components(tag);
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
  if (!Array.isArray(children)) return children;
  var cs = [];
  var child, value, state, tmpl, res;
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];
    value = child._value;
    state = value.state;
    tmpl = value._tmpl;
    res = tmpl(new CoreMap(state));
    // if the result is an array merge it with our own children
    if (Array.isArray(res)) cs = Array.prototype.push.apply(cs, res);
    else cs.push(res);
  }
  return cs;
}

/**
 * Generate a compute state function
 *
 * @param {ReduceFunction} directives
 * @param {Injector} injector
 * @param {Object} cache
 * @return {Function}
 */

function genComputeState(directives, injector, cache) {
  return function (init) {
    return directives(function(state, config, key) {
      var directive = cache.directives[key];
      if (!directive) cache.directives[key] = directive = injector.directive(key);
      var genState = directive.state;
      var newState = genState ? genState.call(injector, config, state) : state;

      // TODO check and see if the newState has a 'pending' flag
      if (newState !== false) state = newState;

      return state;
    }, init || new CoreMap());
  }
}

/**
 * Generate a compute properties function
 *
 * @param {ReduceFunction} directives
 * @param {ReduceFunction} children
 * @param {Injector} injector
 * @param {Object} cache
 * @param {String} tag
 * @return {Function}
 */

function genComputeProperties(directives, children, injector, cache, tag) {
  return function (state) {
    var el = directives(function(el, config, key) {
      var d = cache.directives[key];

      var childrenOnly = false;
      // dunno if i like this name
      if (d.childrenOnly) childrenOnly = el.childrenOnly = true;

      if (!childrenOnly) {
        var getTag = d.tag;
        var getProps = d.props;
        if (getTag) el.tag = getTag.call(injector, config, state, el.tag);
        if (getProps) el.props = getProps.call(injector, config, state, el.props);
      }

      var children = el.children;
      if (!children) return el;

      var getChildren = cache.directives[key].children;
      if (!getChildren) return el;

      el.children = getChildren.call(injector, config, state, children);
      return el;
    }, {
      children: inherit(children, state._value),
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
  var directive, compile;
  for (var k in props) {
    directive = injector.directive(k);
    if (!directive) continue;
    compile = directive.compile;
    compiledProps[k] = compile ? compile(props[k]) : null;
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
  if (typeof children === 'string') children = [children];
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
