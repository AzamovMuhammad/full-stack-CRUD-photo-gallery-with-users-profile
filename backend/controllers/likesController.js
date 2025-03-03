const pool = require("../config/db");
exports.likesCount = async (req, res) => {
  const { images_id } = req.body;
  try {
    const likeCount = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE images_id = $1",
      [images_id]
    );
    res.json({ like_count: likeCount.rows[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likeCond =  async (req, res) => {
    const { user_id, images_id } = req.body;
  
    try {
      // Foydalanuvchi allaqachon like bosganmi?
      const likeCheck = await pool.query(
        "SELECT * FROM likes WHERE user_id = $1 AND images_id = $2",
        [user_id, images_id]
      );
  
      if (likeCheck.rowCount > 0) {
        // Agar like bosgan bo‘lsa, o‘chiramiz (Unlike)
        await pool.query(
          "DELETE FROM likes WHERE user_id = $1 AND images_id = $2",
          [user_id, images_id]
        );
        res.json({ message: "Unlike qildingiz", liked: false });
      } else {
        // Agar like bosmagan bo‘lsa, qo‘shamiz
        await pool.query(
          "INSERT INTO likes (user_id, images_id) VALUES ($1, $2)",
          [user_id, images_id]
        );
        res.json({ message: "Like bosildi", liked: true });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
