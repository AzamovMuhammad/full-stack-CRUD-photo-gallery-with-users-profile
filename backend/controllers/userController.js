const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

exports.getInfo = async (req, res) => {
  try {
    const userExists = await pool.query(
      "select * from users"
    )
    res.json(userExists)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
}

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

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

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

    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 limit 1",
      [username]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Incorrect username or password" });
    }

    const user = result.rows[0]
    const isValidPasword = await bcrypt.compare(password, user.password)

    if (!isValidPasword) {
      return res
        .status(404)
        .json({ message: "Incorrect username or password" });
    }

    // Token generation
    const token = jwt.sign(
    {
      userId: user.id,
      username: user.username
    },
    "MEN SENGA BIR GAP AYTAMAN, HECH KIM BILMASIN",
    {expiresIn: '10m'}
  )
  
    res.json({user, token});
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
};
