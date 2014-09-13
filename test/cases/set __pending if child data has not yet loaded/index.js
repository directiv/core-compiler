exports.input = {
  tag: 'div',
  props: {},
  children: [
    {
      tag: 'div',
      props: {},
      children: [
        {
          tag: 'div',
          props: {
           'data-pending-data': ''
          }
        }
      ]
    },
    {
      tag: 'div',
      props: {},
      children: [
        {
          tag: 'div',
          props: {}
        }
      ]
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
      children: [
        {
          tag: 'div',
          props: {},
          children: [],
          __pending: true
        }
      ],
      __pending: true
    },
    {
      tag: 'div',
      props: {},
      children: [
        {
          tag: 'div',
          props: {},
          children: [],
          __pending: false
        }
      ],
      __pending: false
    }
  ],
  __pending: true
};
