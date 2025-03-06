const { json } = require("express");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// getting user's photos
exports.imgsUser = async (req, res) => {
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
};

// add new images for user
exports.addImgs = async (req, res) => {
  try {

    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Token berilmadi" });
    }

    jwt.verify(token, "MEN SENGA BIR GAP AYTAMAN, HECH KIM BILMASIN");

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
};

// delete users images
exports.deleteImages = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Token berilmadi" });
    }

    jwt.verify(token, "MEN SENGA BIR GAP AYTAMAN, HECH KIM BILMASIN");

    // res.json({message: "Rasm o'chdi"})
    const { id } = req.body;
    const result = await pool.query(`DELETE FROM images WHERE id = $1`, [id]);
    res.status(200).json({
      message: "Rasm o'chirildi",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(403).json({
      message: error.message
    });
    res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
};
