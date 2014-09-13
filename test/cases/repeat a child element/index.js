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
      children: 'Cameron',
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
      children: 'Mike',
      __pending: false
    }
  ],
  __pending: false
};
