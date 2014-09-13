
exports.iterations = 100;

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
        'data-repeat': 'user in users'
      },
      children: [
        {
          tag: 'div',
          props: {
            'data-repeat': 'user in users'
          },
          children: [
            {
              tag: 'div',
              props: {
                'data-repeat': 'user in users'
              },
              children: [
                {
                  tag: 'div',
                  props: {
                    'data-repeat': 'user in users'
                  },
                  children: [
                    {
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
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

exports.output = buildOutput(0);

function buildOutput(i, name) {
  if (i === 6) return {
    tag: 'div',
    props: {},
    children: name
  };

  return {
    tag: 'div',
    props: {},
    children: [
      buildOutput((i || 0) + 1, 'Cameron'),
      buildOutput((i || 0) + 1, 'Brannon'),
      buildOutput((i || 0) + 1, 'Mike')
    ]
  };
}
