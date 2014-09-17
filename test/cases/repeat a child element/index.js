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
  props: {__pending: false},
  children: [
    {
      tag: 'div',
      props: {__pending: false},
      children: 'Cameron'
    },
    {
      tag: 'div',
      props: {__pending: false},
      children: 'Brannon'
    },
    {
      tag: 'div',
      props: {__pending: false},
      children: 'Mike'
    }
  ]
};
