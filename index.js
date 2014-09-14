/**
 * Module dependencies
 */

var reduce = require('directiv-core-reduce');
var Props = require('./props');
var ImmutableMap = require('immutable').Map;
var debug = require('debug')('directiv:core:compiler');

var NODE_ENV = process.env.NODE_ENV;

/**
 * Compile an AST to a render function
 *
 * @param {Object|Array} ast
 * @param {Injector} injector
 * @return {Object}
 */

module.exports = function(ast, injector) {
  if (!Array.isArray(ast)) return compileNode(ast, injector);
  return ast.map(function compileNodes(node) {
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

function compileNode(ast, injector, cache) {
  debug('compiling', ast);

  if (typeof ast === 'string') return function render() {return ast;};

  cache = cache || createCache();

  var directivesReduce = compileProps(ast.props, injector);
  var childrenReduce = compileChildren(ast.children || [], injector, cache);

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
    if (tag === false) {
      var elStr = '';
      elStr.__pending = el.__pending;
      return elStr;
    }

    var children = el.children;
    if (typeof children !== 'undefined') {
      children = el.children = evalChildren(children);
      el.__pending = el.__pending || !!children.__pending;
    }

    // merge this node's children into the parent's
    if (el.childrenOnly) return children || [];

    // clear the injector cache in development
    if (NODE_ENV !== 'production') {
      clearCache(cache);
    }

    return injector(tag)(el);
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
  cache.deps = {};
  return cache;
}

/**
 * Evaluate the children
 *
 * @param {Array} children
 */

function evalChildren(children) {
  if (!Array.isArray(children)) {
    children.__pending = false;
    return children;
  }
  var cs = [];
  var child, value, state, tmpl, res, i, l;
  for (i = 0, l = children.length; i < l; i++) {
    child = children[i];
    res = child.get('_tmpl')(child.get('state'));
    // if the result is an array merge it with our own children
    if (Array.isArray(res)) cs = Array.prototype.push.apply(cs, res);
    else cs.push(res);
  }

  cs.__pending = false;

  var pending;
  for (i = 0, l = cs.length; i < l; i++) {
    pending = cs[i].__pending;
    if (!pending) continue;
    cs.__pending = true;
    break;
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
    var state = init || new ImmutableMap();
    var isPending = false;
    var pending = [];
    var statuses = [];
    var state2 = state.withMutations(function(s) {
      directives(function(_, d) {
        var key = d.key;
        var directive = cache.deps[key];
        if (!directive) cache.deps[key] = directive = injector(key);
        var genState = directive.state;
        var newState = genState ? genState(d.conf, s) : s;

        if (newState === false) {
          isPending = true;
          return pending.push(key);
        }

        var genStatus = directive.status;
        if (!genStatus) return;
        var status = genStatus(d.conf, s);
        statuses.push(status);

        var genPending = directive.pending;
        if (!genPending) return;
        var dIsPending = genPending(d.conf, s);
        if (!dIsPending) return;
        isPending = true;
        pending.push(key);
      });
    });
    state2.__statuses = {
      __pendingItems: pending,
      __statuses: statuses,
      __pending: isPending
    };
    return state2;
  };
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

  function computeChildren(state) {
    return directives(function(cs, d) {
      if (!cs) return cs;

      var getChildren = cache.deps[d.key].children;
      if (!getChildren) return cs;

      return getChildren(d.conf, state, cs);
    }, inherit(children, state));
  }

  function computeTag(state) {
    var t = directives(function(tag, d) {
      var getTag = cache.deps[d.key].tag;
      if (!getTag) return tag;
      return getTag(d.conf, state, tag);
    }, tag);
    if (t !== false) t = 'el-' + t;
    return t;
  }

  function computeProps(state) {
    return directives(function(props, d) {
      var getProps = cache.deps[d.key].props;
      if (!getProps) return props;
      return getProps(d.conf, state, props);
    }, new Props())._value;
  }

  return function computeElementProperties(state) {
    var childrenOnly = directives.childrenOnly;
    var statuses = state.__statuses;
    return {
      children: computeChildren(state),
      tag: childrenOnly ? true: computeTag(state),
      props: childrenOnly ? {} : computeProps(state),
      $state: state,
      childrenOnly: childrenOnly,
      __pending: statuses.__pending,
      __pendingItems: statuses.__pendingItems,
      __statuses: statuses.__statuses
    };
  };
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
  var compiledProps = [];
  var directive, compile;

  for (var k in props) {
    directive = injector(k);
    if (!directive) continue;
    compile = directive.compile;
    compiledProps.push({
      conf: compile ? compile(props[k]) : null,
      key: k,
      priority: directive.priority || 0
    });
  }
  debug('props compiled', compiledProps);

  // precompute if the directives render their own tags
  var directives = reduce(sortProps(compiledProps));
  directives.childrenOnly = directives(function(childrenOnly, d) {
    return childrenOnly || injector(d.key).childrenOnly;
  }, false);

  return directives;
}

/**
 * Sort properties based on priority
 *
 * @param {Array} props
 * @return {Array}
 */

function sortProps(props) {
  return props.sort(function(a, b) {
    var p1 = a.priority, p2 = b.priority;
    if (p1 === p2) return 0;
    return p1 > p2 ? -1 : 1;
  });
}

/**
 * Create a reducer from the listed children
 *
 * @param {Array} children
 * @param {Injector} injector
 * @return {ReduceFunction}
 */

function compileChildren(children, injector, cache) {
  if (typeof children === 'string') children = [children];
  var length = children.length;
  var acc = new Array(length);
  var child;
  for (var i = 0; i < length; i++) {
    child = compileNode(children[i], injector, cache);
    acc[i] = new ImmutableMap({_tmpl: child});
  }
  debug('children compiled', acc);

  return reduce(acc);
}
