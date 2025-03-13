const { json } = require("express");
const pool = require("../config/db");


// getting user's photos
exports.imgsUser = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await pool.query(`select * from images Where userId = $1`, [
      id,
    ]);
    if (result.rows.length != 0) {
      const photos = result.rows.map(photo => {
        return {...photo, url: 'https://full-stack-crud-photo-gallery-with-users-2va3.onrender.com//' + photo.filepath}
      })
      return res.json(photos);
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
    const { userid } = req.body;
    const filepath = req.file.path;
    const result = await pool.query(
      `INSERT INTO images (filepath, userid) VALUES ($1, $2) returning*`,
      [filepath, userid]
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
};
