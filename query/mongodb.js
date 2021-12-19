const { getMongoDBConn } = require('../connections');


module.exports = {
  'QUERY 1 - MongoDB': async function() {
    const conn = await getMongoDBConn();
    const business = conn.db('yelp').collection('business');

    const res = await business
      .find({
        $or: [
          {'hours.Saturday.closed': {$gte: '18:00'}},
          {'hours.Sunday.closed': {$gte: '18:00'}}
        ],
      })
      .project({
        _id: 0,
        name: 1,
        address: 1,
      });

    await res.count();
  },

  'QUERY 2 - MongoDB': async function() {
    const conn = await getMongoDBConn();
    const user = conn.db('yelp').collection('user');

    const res = await user
      .find({
        'friends.25': {$exists: true}
      });

    await res.count();
  },

  'QUERY 3 - MongoDB': async function() {
    const conn = await getMongoDBConn();
    const tip = conn.db('yelp').collection('tip');

    const res = await tip
      .aggregate([
        { $match: {compliment_count: {$gt: 3}}},

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
            business: '$business.name',
            text: 1
          }
        }
      ]);

    await res.forEach(() => null);
  },

  'QUERY 4 - MongoDB': async function() {
    const conn = await getMongoDBConn();
    const tip = conn.db('yelp').collection('tip');

    const res = await tip
      .aggregate([
        { $match: {text: {$regex: /.*best.*/i}}},

        {
          $lookup: {
            from: 'business',
            localField: 'business_id',
            foreignField: '_id',
            pipeline: [
              { $project: {name: 1}}
            ],
            as: 'business'
          }
        },

        { $unwind: { path: '$business'}},

        {
          $project: {
            _id: 0,
            business: '$business.name',
            text: 1
          }
        }
      ]);

    await res.forEach(() => null);
  },
};
