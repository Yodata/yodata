
require = require('esm')(module)

const aws_exports =  {
    'graphqlEndpoint': 'https://5felgrtnarg6nharqckkmrktk4.appsync-api.us-west-2.amazonaws.com/graphql',
    'region': 'us-west-2',
    'authenticationType': 'AMAZON_COGNITO_USER_POOLS',
    'apiKey': 'da2-hjszivrah5aazc2k3z2cjiys74'
}


global.WebSocket = require('ws')
global.window = global.window || {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    WebSocket: global.WebSocket,
    ArrayBuffer: global.ArrayBuffer,
    addEventListener: function () { },
    navigator: { onLine: true }
}
global.localStorage = {
    store: {},
    getItem: function (key) {
        return this.store[key]
    },
    setItem: function (key, value) {
        this.store[key] = value
    },
    removeItem: function (key) {
        delete this.store[key]
    }
}
require('es6-promise').polyfill()
require('isomorphic-fetch')


// Require AppSync module
const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE
const AWSAppSyncClient = require('aws-appsync').default

const url = aws_exports.graphqlEndpoint
const region = aws_exports.region
const type = AUTH_TYPE.AMAZON_COGNITO_USER_POOLS

// If you want to use API key-based auth
const apiKey = aws_exports.apiKey
const credentials = {
    apiKey
}

// Import gql helper and craft a GraphQL query
const gql = require('graphql-tag')
const query = gql(`
query AllUsers {
allUsers {
    __typename
    id
    title
    content
    author
    version
}
}`)

// Set up a subscription query
const subquery = gql(`
subscription NewPostSub {
newPost {
    __typename
    id
    title
    author
    version
}
}`)

// Set up Apollo client
const client = new AWSAppSyncClient({
    url: url,
    region: region,
    auth: {
        type: type,
        credentials: credentials,
    }
})

client.hydrated().then(function (client) {
    //Now run a query
    client.query({ query: query })
    //client.query({ query: query, fetchPolicy: 'network-only' })   //Uncomment for AWS Lambda
        .then(function logData(data) {
            console.log('results of query: ', data)
        })
        .catch(console.error)

    //Now subscribe to results
    const observable = client.subscribe({ query: subquery })

    const realtimeResults = function realtimeResults(data) {
        console.log('realtime data: ', data)
    }

    observable.subscribe({
        next: realtimeResults,
        complete: console.log,
        error: console.log,
    })
})
