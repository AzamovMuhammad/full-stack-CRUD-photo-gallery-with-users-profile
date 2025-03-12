// const { Pool } = require("pg");
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "yupiter",
//   password: "1234",
//   port: 5432,
// });


// module.exports = pool;



const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://azamov:Xg0NQOSfq0KKHgSSWgN1wJl9vUyiOOnk@dpg-cv4plkl6l47c73aqcl7g-a.oregon-postgres.render.com/yupiter_1ulc",
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

module.exports = pool;