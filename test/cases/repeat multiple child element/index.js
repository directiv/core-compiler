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
      children: 'pizza'
    },
    {
      tag: 'div',
      props: {},
      children: 'Brannon'
    },
    {
      tag: 'div',
      props: {},
      children: 'yarn'
    },
    {
      tag: 'div',
      props: {},
      children: 'Mike'
    },
    {
      tag: 'div',
      props: {},
      children: 'curry'
    }
  ]
};
