exports.state = {
  users: [
    {name: 'Cameron'},
    {name: 'Brannon'},
    {name: 'Mike'}
  ]
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
  props: {},
  children: [
    {
      tag: 'div',
      props: {},
      children: 'Cameron'
    },
    {
      tag: 'div',
      props: {},
      children: 'Brannon'
    },
    {
      tag: 'div',
      props: {},
      children: 'Mike'
    }
  ]
};
