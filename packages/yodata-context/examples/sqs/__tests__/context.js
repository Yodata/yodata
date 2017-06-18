import context from '../context';
import mockMessage from '../mock.data';

test(`context unwraps and returns a parsed sqs message payload`, () => {
  expect(context.map(mockMessage)).toEqual({
    Message: {
      type: 'test'
    }
  })
});
