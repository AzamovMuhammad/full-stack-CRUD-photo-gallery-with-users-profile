const pool = require("../config/db");

exports.allUserImg = async (req, res) => {
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

    if (result.rows.length != 0) {
      const photos = result.rows.map((photo) => {
        return {
          ...photo,
          url:
            "https://full-stack-crud-photo-gallery-with-users.onrender.com/" +
            photo.filepath,
        };
      });
      return res.json(photos);
    } else {
      return res.json({ message: "serverda hatolik" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
};
