// Mongodb database client
const { MongoClient } = require('mongodb');

class DBClient {
  constructor(host, port, database) {
    this.host = host || process.env.DB_HOST || 'localhost';
    this.port = port || process.env.DB_PORT || 27017;
    this.database = database || process.env.DB_DATABASE || 'files_manager';

    this.uri = `mongodb://${this.host}:${this.port}`;
    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to the MongoDB client
    this.client.connect()
      .then(() => {
        console.log('Connected to MongoDB');
        this.db = this.client.db(database);
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB', err);
      });
  }

  isAlive() {
    return this.client.isConnected(); // Check if the client is connected
  }

  async nbUsers() {
    try {
      const users_collection = this.db.collection('users');
      return await users_collection.countDocuments();
    } catch(err) {
      console.error('Error counting users:', err);
    }
  }

  async nbFiles() {
    try {
      const files_collection = this.db.collection('files');
      return await files_collection.countDocuments();
    } catch(err) {
      console.error('Error counting files:', err);
    }
  }
}

const dbClient = new DBClient;
module.exports = dbClient;
