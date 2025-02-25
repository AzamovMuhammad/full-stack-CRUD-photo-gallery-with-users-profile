const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "yupiter",
  password: "1234",
  port: 5432,
});

app.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, username, password) VALUES ($1,$2,$3,$4) RETURNING*`,
      [firstname, lastname, username, password]
    );
    res.status(201).json({
      message: "Yangi foydalanuvchi qo'shildi.",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Username yoki parol noto‘g‘ri" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2 limit 1",
      [username, password]
    );
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }
    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
});

app.post("/imgs", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await pool.query(`select * from images Where userId = $1`, [
      id,
    ]);
    if (result.rows.length != 0) {
      return res.json(result.rows);
    } else {
      return res.json({ message: "serverda hatolik" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("serverda xatolik yuz berdi.");
  }
});

app.post("/addImg", async (req, res) => {
  try {
    const { imageurl, userid } = req.body;
    const result = await pool.query(
      `INSERT INTO images (imageurl, userid) VALUES ($1, $2) returning*`,
      [imageurl, userid]
    );
    res.status(201).json({
      message: "Yangi rasm qo'shildi.",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
});

app.post("/deleteImg", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await pool.query(`DELETE FROM images WHERE id = $1`, [id]);
    res.status(200).json({
      message: "Rasm o'chirildi",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
});

app.get("/allimg", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          users.id, 
          users.firstname, 
          users.lastname, 
          users.username, 
          images.id AS image_id, 
          images.imageURL
      FROM users
      INNER JOIN images ON users.id = images.userId
      ORDER BY users.id ASC;
    `);
    res.status(200).json({
      message: "Barcha userlar va rasmlar olindi.",
      user: result.rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
});

// 🔹 Postdagi like-lar sonini olish
app.post("/likes", async (req, res) => {
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
});

app.post("/like", async (req, res) => {
  const { user_id, images_id } = req.body;

  try {
    // Foydalanuvchi allaqachon like bosganmi?
    const likeCheck = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND images_id = $2",
      [user_id, images_id]
    );

    if (likeCheck.rowCount > 0) {
      // Agar like bosgan bo‘lsa, o‘chiramiz (Unlike)
      await pool.query("DELETE FROM likes WHERE user_id = $1 AND images_id = $2", [
        user_id,
        images_id,
      ]);
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
});




const port = 4180;
app.listen(port, () => {
  console.log(`Server ${port}-portda ishga tushdi.`);
});
