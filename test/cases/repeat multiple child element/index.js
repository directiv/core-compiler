exports.state = {
  users: [
    {name: 'Cameron', food: 'pizza'},
    {name: 'Brannon', food: 'yarn'},
    {name: 'Mike', food: 'curry'}
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
    },
    {
      tag: 'div',
      props: {
        'data-bind': 'user.food'
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
      children: 'pizza'
    },
    {
      tag: 'div',
      props: {__pending: false},
      children: 'Brannon'
    },
    {
      tag: 'div',
      props: {__pending: false},
      children: 'yarn'
    },
    {
      tag: 'div',
      props: {__pending: false},
      children: 'Mike'
    },
    {
      tag: 'div',
      props: {__pending: false},
      children: 'curry'
    }
  ]
};
