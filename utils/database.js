const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://hanta911:eGDTgOhiaQU1Wm36@node-cluster.lsrn2ml.mongodb.net/?retryWrites=true&w=majority&appName=Node-Cluster";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const mongoConnect = (callBack) => {
    client
    .connect()
    .then(client => {
        callBack(client)
    })
    .catch(err => console.log(err))
}




module.exports= mongoConnect;
