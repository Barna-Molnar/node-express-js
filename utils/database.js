const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://hanta911:Bazdmeg@node-cluster.lsrn2ml.mongodb.net/?retryWrites=true&w=majority&appName=Node-Cluster";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/** @type {import('mongodb').Db} */
let db;

/**
 * Connects to MongoDB and initializes the database connection
 * @param {function(import('mongodb').MongoClient): void} callBack - Callback function that receives the MongoDB client
 * @returns {Promise<void>}
 */
const mongoConnect = (callBack) => {
    client
    .connect()
    .then(client => {
        db = client.db()
        callBack()
    })
    .catch(err => {
        console.log('MONGO ERROR:',err)
    })
}

/**
 * Gets the database instance
 * @returns {import('mongodb').Db} The MongoDB database instance
 * @throws {Error} If database is not initialized
 */
const getDb = () => {
    if(db) return db
    throw new Error("no db defined ");
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;