exports.state = {
  user: '/users/123'
};

exports.input = {
  tag: 'div',
  props: {
    'data-href': 'user'
  }
};

exports.output = {
  tag: 'div',
  props: {
    href: '/users/123'
  },
  children: []
};
