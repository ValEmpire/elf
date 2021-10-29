const express = require("express");
const router = express.Router();
const ads = require("../../../db");
const { protectAPI } = require("../../../middlewares");

router.get("/", protectAPI, async (req, res) => {
  try {
    const userID = req.session.userID;

    const query = `
      SELECT ads.*, laptops.*, laptop_images.url FROM ads
      JOIN laptops ON laptops.id = ads.laptop_id
      JOIN users ON ads.user_id = users.id
      LEFT JOIN laptop_images ON laptop_images.id = ads.laptop_image_id
      WHERE ads.user_id = $1`;

    const param = [userID];

    const response = await ads.query(query, param);

    return res.status(200).json({
      success: true,
      response: response.rows,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      responce: err.message,
    });
  }
});

router.delete("/:adId", protectAPI, async (req, res) => {
  try {
    const { adId } = req.params;

    const userID = req.session.userID;

    const deleteAdQuery = `DELETE FROM ads WHERE ads.id = $1 AND user_id = $2`;

    const deleteAdPapams = [adId, userID];

    await ads.query(deleteAdQuery, deleteAdPapams);

    // return if successful
    return res.status(200).json({
      success: true,
    });

    // throw error if not successful
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
