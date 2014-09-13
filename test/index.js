var compile = require('../');
var should = require('should');
var benchmark = require('directiv-test-benchmark');

describe('core-compile', function() {
  var directives = {
    'data-bind': {
      compile: function(input) {
        return input.split('.');
      },
      state: function(config, state) {
        var target = config[1];
        return state.set(target, state.get(config[0])[target]);
      },
      children: function(config, state, children) {
        return state.get(config[1]) || '';
      },
      tag: function(config, state, tag) {
        return 'span';
      }
    },
    'data-repeat': {
      compile: function(input) {
        return input.split(' in ');
      },
      state: function(config, state) {
        return state.set(config[1], [{name: 'Cameron'},{name: 'Brannon'},{name: 'Mike'}]);
      },
      children: function(config, state, children) {
        var items = state.get(config[1]);
        var arr = [];
        if (!items) return arr;

        var target = config[0];
        var childValue;
        var i, c, child;

        var commit = {
            state: {
              $merge: {}
            }
        };
        var $merge = commit.state.$merge;

        for (i = 0; i < items.length; i++) {
          $merge[target] = items[i];
          for (c = 0; c < children.length; c++) {
            child = children[c];
            if (child) arr.push(child.set(commit));
          }
        }
        return arr;
      }
    }
  };

  var components = {
    div: function(props, children) {
      return {
        tag: 'div',
        props: props,
        children: children
      };
    },
    span: function(props, children) {
      return {
        tag: 'span',
        props: props,
        children: children
      };
    }
  };

  var injector = {
    directive: function(name) {
      return directives[name];
    },
    components: function(name) {
      return components[name];
    }
  };

  it('should work', function() {
    var ast = {
      type: 'tag',
      name: 'div',
      props: {
        'data-repeat': 'user in users'
      },
      children: [
        {
          type: 'tag',
          name: 'div',
          props: {
            'data-bind': 'user.name'
          }
        }
      ]
    };
    var render = compile(ast, injector);
    var out = render();
    out.should.eql({
      tag: 'div',
      props: {},
      children: [
        {
          tag: 'span',
          props: {},
          children: 'Cameron'
        },
        {
          tag: 'span',
          props: {},
          children: 'Brannon'
        },
        {
          tag: 'span',
          props: {},
          children: 'Mike'
        }
      ]
    });
  });

  describe('benchmarks', function() {
    describe('simple', function() {
      var ast = {
        type: 'tag',
        name: 'div',
        props: {
          'data-repeat': 'user in users'
        },
        children: [
          {
            type: 'tag',
            name: 'div',
            props: {
              'data-bind': 'user.name'
            }
          }
        ]
      };
      var render = compile(ast, injector);
      benchmark(30000, 1, function() {
        render();
      });
    });
  });
});
