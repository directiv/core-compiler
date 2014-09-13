var children = [
  {
    tag: 'span',
    props: {},
    children: [
      'Hello'
    ],
    __pending: false
  },
  {
    tag: 'span',
    props: {},
    children: [
      'World'
    ],
    __pending: false
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
