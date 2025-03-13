const pool = require("../config/db");

exports.myFavImg = async (req, res) => {
  const { user_id } = req.body;
  try {
    const result = await pool.query(
      `SELECT 
      likes.id, 
      likes.user_id,
      users.id,
      users.firstname, 
      users.lastname, 
      images.id AS image_id, 
      images.filepath
      FROM likes
      INNER JOIN images ON likes.images_id = images.id
      INNER JOIN users ON images.userid = users.id
      where user_id = $1`,
      [user_id]
    );
    if (result.rows.length != 0) {
      const photos = result.rows.map(photo => {
        return {...photo, url: 'https://full-stack-crud-photo-gallery-with-users.onrender.com/' + photo.filepath}
      })
      return res.json(photos);
    } else {
      return res.json({ message: "serverda hatolik" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clikedLikeByUsers = async (req, res) => {
    const { image_id } = req.body;
    try {
      const result = await pool.query(
        `SELECT 
      likes.user_id,
      users.firstname, 
      users.lastname, 
      images.id AS image_id
      FROM likes
      INNER JOIN images ON likes.images_id = images.id
      INNER JOIN users ON likes.user_id = users.id
      where images.id = $1`,
        [image_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }