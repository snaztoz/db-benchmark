const { ObjectId } = require('mongodb');

const { getMongoDBConn, getRedisConn } = require('../connections');


module.exports = {
  'QUERY 1 - MongoRedis': async function() {},
  'QUERY 2 - MongoRedis': async function() {},
  'QUERY 3 - MongoRedis': async function() {},

  'QUERY 4 - MongoRedis': async function() {
    const rconn = await getRedisConn();
    const tipIds = await rconn
        .SMEMBERS('tip:kw:best')
        .then(ids => ids.map(id => ObjectId(id)));

    const mconn = await getMongoDBConn();
    const tip = mconn.db('yelp').collection('tip');

    const res = await tip
      .aggregate([
        { $match: { _id: { $in: tipIds}}},

        {
          $lookup: {
            from: 'business',
            localField: 'business_id',
            foreignField: '_id',
            pipeline: [
              { $project: { name: 1}}
            ],
            as: 'business'
          }
        },

        { $unwind: { path: '$business'}},

        {
          $project: {
            _id: 0,
            business: 1,
            text: 1,
          }
        }
      ]);

    await res.forEach(() => null);
  },
};
