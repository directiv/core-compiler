var children = [
  {
    tag: 'span',
    props: {},
    children: [
      'Hello'
    ]
  },
  {
    tag: 'span',
    props: {},
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
