const message = {
  type: 'test'
}

const messageBody = {
  Type: 'Notification',
  MessageId: '3a6e761b-6abb-5b34-94f8-27808c5bced9',
  TopicArn: 'arn:aws:sns:region:qid:qname',
  Message: JSON.stringify(message),
  Timestamp: '2017-05-21T19:04:00.554Z',
  SignatureVersion: '1',
  Signature: 'Y9dyuyotfott1dO0NOEQmApWVvhiuI1JWTdL2cd7yeFuh8b8LNHkTpNlOi2MK2H+WMQQD6A1iTYekstHhAI8KVnpZX0Gr9XpfQaAOWFu2zH2ol8nqyWDX4r8YOiop+4VLT+60yFKHm7noHpJ4sCgjTiTTiO9bQs/zYtr918VuCxDtS3P7qDYCBI8wEtWKo8O2tN0WU8uy2es+LQZT+9ZUZ5OiTwgA51IlKrsAnOgMeq/BhVBeHS4fEom0odkMgMa5HXOdWLcLp603jBoSQPI86ZOJrKzT4ANXCvKL/vFT/iYoY1ZeLQQ6VDXVoPXumv/gBShhy+9xkMJa+3uMxngoA==',
  SigningCertURL: 'https://sns.us-west-2.amazonaws.com/SimpleNotificationService-b95095beb82e8f6a046b3aafc7f4149a.pem',
  UnsubscribeURL: 'https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:228463753594:BHHS_Franchise_YoData_Queue:7b299777-20d2-491f-9f4c-48a5b092c30a',
};

const messages = [ {
  Attributes: null,
  Body: JSON.stringify(messageBody),
  MD5OfBody: '15157aea13416c55636032a78f89c9f6',
  MD5OfMessageAttributes: null,
  MessageAttributes: null,
  MessageId: '6ecded52-1151-45e9-a06c-4a802ade3071',
  ReceiptHandle: 'AQEB/Hsq51Egq4/HIuU4F7XSTZxJapQeqz0Dbjhn5zIg2WS9TA3HaSqH9pvOp1UswNhO3LUfl2dX4Kab+F730Ffphp93vjVQ8cOh+bcNzFejJo6UVb2QxuFoWCaoVJZyflT5UrPSLyfuUb+QkzHzk//KQ4E0KE2BUZ5iUkuf1i1RPutb5GsUKfA32Q12wkni5M3i2WXNeGrbGbpDdiqghrrLOx8rFrGc1OahFvJ23qe81fxA6Ej5hOsDcNwIajj9k+0yx41KBjwhVXaBBaEH2K3uA1l5F84iYcGYwYhBxc4nn8MI3vMeOeoyNo0SnY/knVaDrksLk4JNfN7D/BloZLTmys0i2j/TKyww8jvYyEnr7tbYjuCRxB9HgltxFjxC6T6zdU+HlKSPqTft5qBfN4S/Yw==',
} ]

export const mockGetResponse = {
  ReceiveMessageResponse: {
    ReceiveMessageResult: {
      messages: messages,
    },
    ResponseMetadata: {
      RequestId: 'eb2cab84-8582-54ae-a9b0-fa3b7fdcf76e',
    },
  },
}

export default mockGetResponse
