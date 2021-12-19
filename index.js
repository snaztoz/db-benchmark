require('dotenv').config()

const mariadbQueries = require('./query/mariadb');
const mongodbQueries = require('./query/mongodb');
const mongoRedisQueries = require('./query/mongoredis');
const { getMariaDBConn, getMongoDBConn, getRedisConn } = require('./connections');


async function measureQuery(name, query_callback) {
  console.time(name);
  await query_callback();
  console.timeEnd(name);
}

async function measureMariaDBQueries() {
  console.log('\nMeasuring MariaDB queries...');

  for (const [name, query] of Object.entries(mariadbQueries)) {
    await measureQuery(name, query);
  }

}

async function measureMongoDBQueries() {
  console.log('\nMeasuring MongoDB queries...');

  for (const [name, query] of Object.entries(mongodbQueries)) {
    await measureQuery(name, query);
  }
}

async function measureMongoRedisQueries() {
  console.log('\nMeasuring Mongo-Redis queries...');

  for (const [name, query] of Object.entries(mongoRedisQueries)) {
    await measureQuery(name, query);
  }
}


(async function() {
  await measureMariaDBQueries();
  await measureMongoDBQueries();
  await measureMongoRedisQueries();

  await getMariaDBConn().then(conn => conn.end());
  await getMongoDBConn().then(conn => conn.close());
  await getRedisConn().then(conn => conn.quit());
})()
