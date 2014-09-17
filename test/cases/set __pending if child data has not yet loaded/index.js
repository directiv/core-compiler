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
  props: {__pending: true},
  children: [
    {
      tag: 'div',
      props: {__pending: true},
      children: [
        {
          tag: 'div',
          props: {__pending: true},
          children: []
        }
      ]
    },
    {
      tag: 'div',
      props: {__pending: false},
      children: [
        {
          tag: 'div',
          props: {__pending: false},
          children: []
        }
      ]
    }
  ]
};
