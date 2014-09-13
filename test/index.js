var compile = require('../');
var should = require('should');
var dir = require('fs').readdirSync;
var write = require('fs').writeFileSync;
var benchmark = require('directiv-test-benchmark');
var CoreMap = require('immutable').Map;
var injector = require('./injector');

/**
 * Initialization
 */

var root = __dirname;

var cases = dir(root + '/cases').map(function(name) {
  var ast = require(root + '/cases/' + name);
  return {
    name: name,
    input: ast.input,
    output: JSON.parse(JSON.stringify(ast.output)),
    state: new CoreMap(ast.state),
    iterations: ast.iterations || 1000
  };
});

describe('core-compile', function() {

  describe('cases', function() {
    cases.forEach(function(test) {
      it('should ' + test.name, function() {
        var render = compile(test.input, injector());
        var actual = render(test.state);
        try {
          actual.should.eql(test.output);
        } catch (e) {
          var name = test.name;
          write(name + '-actual.json', JSON.stringify(actual, null, ' '));
          write(name + '-expected.json', JSON.stringify(test.output, null, ' '));
          throw new Error(name + ' failed. Look at "' + name + '-actual.json" for the output.');
        };
      });
    });
  });

  benchmark.enabled(function() {
    describe('benchmarks', function() {
      cases.forEach(function(test) {
        var inj = injector();
        var render = compile(test.input, inj).bind(null, test.state);
        render();
        var count = inj.count;

        describe('should ' + test.name + ' (' + count + ' elements)', function() {
          benchmark(test.iterations, 1, render);
        });
      });
    });
  });
});
