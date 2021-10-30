const { response } = require("express");
const express = require("express");
const router = express.Router();
const ads = require("../../../db");
const laptop = require("../../../db");
const { protectAPI } = require("../../../middlewares");

// Only admin can update ad
router.put("/featured/:id", protectAPI, async (req, res) => {
  try {
    const adId = req.params.id
    const userID = req.session.userID

    const query = `SELECT is_admin FROM users 
                    WHERE id = $1`

    const param = [userID]

    const response = await query(query, param)

    if (response.rows.is_admin === false) {
      throw new Error("You do not have administrator rights")
    }

    const queryString = `UPDATE ads 
        SET is_featured = $1,
        updated_at = $2
        WHERE ads.id = $3;`

    const updated_at = new Date();

    const params = [true, updated_at, adId]
    

    const updatedResponse = await ads.query(queryString, params)

    return res.status(200).json({
      success: true,
      updatedResponse,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      updatedResponse: err.message,
    });
  }
});


// GET all featured
router.get("/", async (req, res) => {
  try {
    const query = `SELECT laptops.*, ads.*, laptop_images.* FROM ads
  JOIN laptops ON ads.laptop_id = laptops.id
  JOIN laptop_images ON ads.laptop_image_id = laptop_images.id
  WHERE ads.is_featured = TRUE`;

    const response = await ads.query(query);

    return res.status(200).json({
      success: true,
      response: response.rows,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      success: false,
      response: err.message,
    });
  }
});

module.exports = router;
