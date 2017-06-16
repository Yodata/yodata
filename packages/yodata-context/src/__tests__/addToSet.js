import addToSet from '../addToSet'

test(`merges values: a + b = [a,b]`, () => {
  let a = 1;
  let b = 2;
  expect(addToSet(a, b)).toEqual([ 1, 2 ]);
});

test(`drops duplicate values: [ a, b ] + b = [ a , b ]`, () => {
  let a = [ 1, 2 ];
  let b = [ 2, 3 ];
  let c = 1;
  expect(addToSet(a, b)).toEqual([ 1, 2, 3 ]);
  expect(addToSet(a, c)).toEqual(a);
});

test(`works with objects`, () => {
  let a = { a: 1 };
  let b = { a: 2 };
  let c = { a: 2 };
  expect(addToSet(a, b)).toEqual([ a, b ]);
  expect(addToSet(b, c)).toEqual([ b]);
  expect(addToSet([ b ], c)).toEqual([ b ])
  expect(addToSet([ a ], c)).toEqual([ a, c ])
});

test(`does not mutate objects`, () => {
  let doc = {
    value: [],
  }
  let a = {
    id: 1,
    name: 'moe',
  }
  let b = [
    {
      id: 2,
      name: 'larry',
    },
    {
      id: 3,
      name: 'curly',
    },
  ]
  doc.value = addToSet(a, b)
  expect(doc).toMatchObject({
    value: [
      {
        id: 1,
        name: 'moe',
      },
      {
        id: 2,
        name: 'larry',
      },
      {
        id: 3,
        name: 'curly',
      },
    ],
  })
  expect(a).toEqual({
    id: 1,
    name: 'moe'
  })
});
