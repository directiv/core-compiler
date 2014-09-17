exports.iterations = 100;

var users = [];

for (var i = 0; i < 2000; i++) {
  users.push({name: '' + i});
}

exports.state = {
  users: users
};

exports.input = {
  tag: 'div',
  props: {
    'data-repeat': 'user in users'
  },
  children: [
    {
      tag: 'div',
      props: {
        'data-bind': 'user.name'
      }
    }
  ]
};

exports.output = {
  tag: 'div',
  props: {__pending: false},
  children: users.map(function(user) {
    return {
      tag: 'div',
      props: {__pending: false},
      children: user.name
    };
  })
};
