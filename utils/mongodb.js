import { MongoClient } from 'mongodb'

const { MONGODB_URI, MONGO_DB } = process.env
if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
if (!MONGO_DB) throw new Error('Please define the MONGO_DB environment variable inside .env.local')

let cached = global.mongo;
if (!cached) cached = global.mongo = {}

export async function connectToDatabase() {
    if (cached.conn) return cached.conn
    if (!cached.promise) {
        const conn = {}
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
        cached.promise = MongoClient.connect(MONGODB_URI, opts)
            .then((client) => {
                conn.client = client
                return client.db(MONGO_DB)
            })
            .then((db) => {
                console.log('Database Connected')
                conn.db = db
                cached.conn = conn
            })
            .catch((err) => {
                console.error('MongoDB connection error:', err)
                cached.promise = null;
                throw err
            })
    }
    await cached.promise
    return cached.conn
}
