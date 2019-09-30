import { isBrowser, getUserId } from "../services/auth"

// Wrap the app in check for window
const getUsersCollection = () => {
  if (isBrowser()) {
    const {
      Stitch,
      RemoteMongoClient
    } = require('mongodb-stitch-browser-sdk')

    const APP_ID = "duffeltag-ceqsw"
    // Initialize client if none exists
    const client = Stitch.hasAppClient(APP_ID)
      ? Stitch.getAppClient(APP_ID)
      : Stitch.initializeAppClient(APP_ID)

    const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('duffeltag')
    return db.collection('users')
  }
}

/* DATABASE OPERATIONS */

// Update key's value for current user
export const updateValue = (key, value) => {
  const query = {owner_id: getUserId()}
  const update = { "$set": { [key]: value } }

  return new Promise(resolve => {
    getUsersCollection().updateOne(query, update, { "upsert": true })
      .then(result => {
        const { matchedCount, modifiedCount } = result
        if(matchedCount && modifiedCount) {
          // console.log(`Successfully updated the item.`)
          resolve()
        }
      })
      .catch(err => console.error(`Failed to update the item: ${err}`))
  })
}

// Get key's value for current user
export const getValue = key => {
  return new Promise(resolve => {
    getUsersCollection().findOne({ "owner_id" : getUserId() })
      .then(item => {
        // console.log("Successfully found " + item[key])
        resolve(item[key])
      })
      .catch(err => console.error(`Failed to find item: ${err}`))
  })
}

// Get user document current user
export const getUserObject = id => {
  return new Promise(resolve => {
    getUsersCollection().findOne({ "owner_id" : getUserId() })
      .then(item => {
        // console.log(Object.keys(item))
        // console.log("Successfully found " + item)
        resolve(item)
      })
      .catch(err => console.error(`Failed to find item: ${err}`))
  })
}

// Find if there is a document in collection that matches query
export const isDocWhere = (key,value) => {
  return new Promise(resolve => {
    getUsersCollection().find({ [key]: value }).toArray()
      .then(items => {
        // console.log(`Successfully found ${items.length} documents.`)
        resolve(items.length!==0)
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  })
}

// Get document that matches query
export const getDocWhere = (key,value) => {
  return new Promise(resolve => {
    getUsersCollection().find({ [key]: value }).toArray()
      .then(items => {
        // console.log(`Successfully found ${items.length} documents.`)
        if (items.length > 0) {
          resolve(items)
        }
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  })
}