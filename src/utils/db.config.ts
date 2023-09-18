import { MongoClient, MongoClientOptions } from 'mongodb'

const options: MongoClientOptions = {}

const client = new MongoClient(process.env.MONGODB_URI!, options)
const mongoPromise = client.connect()

export default mongoPromise
