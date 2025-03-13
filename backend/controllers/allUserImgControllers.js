exports.allUserImg = async (req, res) => {
  try {
      console.log("Fetching all images from database...");
      
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

      console.log("Query executed successfully:", result.rows);

      const photos = result.rows.map(photo => {
          return {...photo, url: 'https://full-stack-crud-photo-gallery-with-users-2va3.onrender.com//' + photo.filepath}
      });

      res.status(200).json(photos);
  } catch (error) {
      console.error("Database query error:", error);
      res.status(500).send("Girgittonimizda nomaqbul nuqson yuzaga keldi.");
  }
};
