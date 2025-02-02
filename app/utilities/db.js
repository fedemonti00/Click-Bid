const { MongoClient } = require("mongodb");
const MONGODB_URI = "mongodb://mongosrv";
const DB_NAME = "auction_house";
let cachedDB;

module.exports = {
  connectToDatabase: async () => {
      if(cachedDB) {
          console.log("Retrieving the existing connection");
          return cachedDB;
      }
      try {
          console.log("Creating a new connection...");
          const client = await MongoClient.connect(MONGODB_URI);
          const db = client.db(DB_NAME);
          cachedDB = db;
          return db;
      } catch(error) {
          console.log("ERROR: unable to establish a new connection.");
          console.log(error);
          throw error;
      }
  },
};