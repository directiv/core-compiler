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
      children: 'Cameron',
      __pending: false
    },
    {
      tag: 'div',
      props: {},
      children: 'pizza',
      __pending: false
    },
    {
      tag: 'div',
      props: {},
      children: 'Brannon',
      __pending: false
    },
    {
      tag: 'div',
      props: {},
      children: 'yarn',
      __pending: false
    },
    {
      tag: 'div',
      props: {},
      children: 'Mike',
      __pending: false
    },
    {
      tag: 'div',
      props: {},
      children: 'curry',
      __pending: false
    }
  ],
  __pending: false
};
