const containerSchema = {
  location: {
    type: 'string'
  },
  from: {
    type: 'string'
  },
  next: {
    type: 'string'
  },
  additionalProperties: {
    type: 'object',
    properties: {
      next: {
        type: 'string'
      },
      contains: {
        type: 'array',
        items: {
          type: 'object'
        }
      }
    }
  }
}

module.exports = containerSchema
