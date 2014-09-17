exports.state = {
  user: '/users/123'
};

exports.input = {
  tag: 'div',
  props: {
    'data-pending-data': ''
  }
};

exports.output = {
  tag: 'div',
  props: {__pending: true},
  children: []
};
