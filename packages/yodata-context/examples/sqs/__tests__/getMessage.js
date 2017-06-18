import getSQSMessage from '../getMessage'
import mockGetResponse from '../mock.data';

const fn = jest.fn(getSQSMessage)
  .mockReturnValueOnce(mockGetResponse)

describe(`getSQSMessage`, () => {
  test(`get message`, async () => {
    let url = 'YOUR SQS QUEUE HTTP API URL'
    let data = await fn(url)
    expect(data).toMatchObject({
      ReceiveMessageResponse: {
        ReceiveMessageResult: {
          messages: expect.any(Array)
        }
      }
    })
  });
});
