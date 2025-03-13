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
  connectionString: "postgresql://azamov:7cG8dGS72HUFWW4sVzfKUqVkGVoylpYu@dpg-cv9j6cin91rc738pm9ig-a.oregon-postgres.render.com/yupiter_zq2r",
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

module.exports = pool;