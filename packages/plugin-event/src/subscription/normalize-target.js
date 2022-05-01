function normalizeTarget (target) {
  const input = String(target)
  if (input.includes('amazonaws.com')) {
    if (input.startsWith('https://sqs')) {
      return input.replace('https:', 'aws-sqs:')
    }
    if (input.startsWith('https://sns')) {
      return input.replace('https:', 'aws-sns:')
    }
  } else if (input.startsWith('arn:aws:lambda')) {
    const functionName = input.split(':').pop()
    return `aws-lambda://${functionName}`
  } else if (input.startsWith('http') && input.endsWith('profile/card#me')) {
    return input
  } else {
    return input
  }
}

exports.normalizeTarget = normalizeTarget
