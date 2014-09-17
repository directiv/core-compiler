var children = [
  {
    tag: 'span',
    props: {__pending: false},
    children: [
      'Hello'
    ]
  },
  {
    tag: 'span',
    props: {__pending: false},
    children: [
      'World'
    ]
  }
];

exports.input = {
  tag: 'div',
  props: {
    'data-children': ''
  },
  children: children
};

exports.output = children;
