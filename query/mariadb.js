const { getMariaDBConn } = require('../connections');


module.exports = {
  'QUERY 1 - MariaDB': async function() {
    const conn = await getMariaDBConn();

    try {
      await conn.query(`
        SELECT DISTINCT business.business_name, business.business_addr
        FROM business
        JOIN businesshour ON businesshour.id_business = business.id
        WHERE
          (businesshour.day_name = 'Saturday'
            OR businesshour.day_name = 'Sunday')
          AND businesshour.time_closed >= '18:00';
      `);
    } catch (err) {
      console.error(err);
    }
  },

  'QUERY 2 - MariaDB': async function() {
    const conn = await getMariaDBConn();

    try {
      await conn.query(`
        SELECT user.username
        FROM user
        JOIN friendship
          ON friendship.id_user1 = user.id
          OR friendship.id_user2 = user.id
        GROUP BY
          user.username
        HAVING
          COUNT(user.username) > 20;
      `);
    } catch (err) {
      console.error(err);
    }
  },

  'QUERY 3 - MariaDB': async function() {
    const conn = await getMariaDBConn();

    try {
      await conn.query(`
        SELECT business.business_name, tip.tip_text
        FROM business
        JOIN tip ON tip.id_business = business.id
        WHERE
          tip.compliment_count > 3;
      `);
    } catch (err) {
      console.error(err);
    }
  },

  'QUERY 4 - MariaDB': async function() {
    const conn = await getMariaDBConn();

    try {
      await conn.query(`
        SELECT business.business_name, tip.tip_text
        FROM business
        JOIN tip ON tip.id_business = business.id
        WHERE
          tip.tip_text LIKE "%best%";
      `);
    } catch (err) {
      console.error(err);
    }
  }
};
