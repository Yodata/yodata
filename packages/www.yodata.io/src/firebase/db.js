import { db } from './config'

const extractData = snapshot => {
  let result = []
  snapshot.forEach(doc => {
    result.push(doc.data())
  })
  return result
}

export const getUsers = async () => db.collection('user').get().then(extractData)
