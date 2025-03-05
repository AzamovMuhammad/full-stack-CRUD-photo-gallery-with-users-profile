const pool = require('../config/db')
const bcrypt = require('bcrypt')

// sign up
exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(password, salt)

    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, username, password) VALUES ($1,$2,$3,$4) RETURNING*`,
      [firstname, lastname, username, encryptedPassword]
    );
    res.status(201).json({
      message: "Yangi foydalanuvchi qo'shildi.",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
};
// log in 
exports.login = async (req, res) => {
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
};
