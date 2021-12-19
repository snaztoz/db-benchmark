const mariadb = require('mariadb');
const { MongoClient } = require("mongodb");
const { createClient } = require('redis');


const connections = {
  mariadb: null,
  mongodb: null,
  redis: null,
}

async function getMariaDBConn() {
  if (!connections.mariadb) {
    connections.mariadb = await mariadb.createConnection({
      host: process.env.MARIADB_HOST,
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_DATABASE,
    });
  }

  return connections.mariadb;
}

async  function getMongoDBConn() {
  if (!connections.mongodb) {
    connections.mongodb = new MongoClient(process.env.MONGODB_URI);
    await connections.mongodb.connect();
  }

  return connections.mongodb;
}

async  function getRedisConn() {
  if (!connections.redis) {
    connections.redis = createClient();
    connections.redis.on('error', (err) => console.error('Redis Client Error', err));
    await connections.redis.connect();
  }

  return connections.redis;
}


module.exports = {
  getMariaDBConn,
  getMongoDBConn,
  getRedisConn,
}
