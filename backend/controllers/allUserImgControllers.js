const pool = require('../config/db')
exports.allUserImg =  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
            users.id, 
            users.firstname, 
            users.lastname, 
            users.username, 
            images.id AS image_id, 
            images.filepath
        FROM users
        INNER JOIN images ON users.id = images.userId
        ORDER BY users.id ASC;
      `);
      const photos = result.rows.map(photo => {
        return {...photo, url: 'http://localhost:4180/' + photo.filepath}
      })
      res.status(200).json(photos);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
    }
  }