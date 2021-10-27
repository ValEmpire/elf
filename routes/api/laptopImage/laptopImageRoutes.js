/*
 * All routes for laptop_images are defined here
 */

const express = require("express");
const router = express.Router();
const laptop_images = require("../../../db");
const { protectAPI } = require("../../../middlewares");

// Add laptop images
router.post("/", protectAPI, async (req, res) => {
  // INSERT INTO laptop_images, url, laptop_id
  try {
    const { urls, adId } = req.body;

    const adsQuery = `SELECT ads.user_id, laptops.id as laptop_id
    FROM ads
    JOIN laptops ON laptops.id = ads.laptop_id
    JOIN laptop_images ON laptops.id = laptop_images.laptop_id
    WHERE ads.id = $1 `;

    const adParams = [adId];

    for (let param of Object.keys(req.body)) {
      if (!param) {
        throw new Error("Please fill all fields");
      }
    }

    const response = await laptop_images.query(adsQuery, adParams);
    if (response.rows[0].user_id !== req.session.userID) {
      throw new Error("You not aloud.");
    }

    for (let url of urls) {
      const query = `INSERT INTO laptop_images (laptop_id, url, created_at, updated_at)
      VALUES ($1, $2, $3, $4)`;

      const created_at = new Date();
      const updated_at = new Date();

      const params = [response.rows[0].laptop_id, url, created_at, updated_at];

      await laptop_images.query(query, params);
    }

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      response: err.message,
    });
  }
});

router.delete("/:id", protectAPI, async (req, res) => {
  try {
    const { id } = req.params;
    const adsQuery = `SELECT ads.user_id, laptops.id as laptop_id
    FROM ads
    JOIN laptops ON laptops.id = ads.laptop_id
    JOIN laptop_images ON laptops.id = laptop_images.laptop_id
    WHERE ads.id = $1 `;

    const adParams = [id];

    const response = await laptop_images.query(adsQuery, adParams);
    if (response.rows[0].user_id !== req.session.userID) {
      throw new Error("You are not allowed.");
    }
    const DeleteImageQuery = `DELETE FROM laptop_images WHERE id = $1`;

    const params = [id];

    await laptop_images.query(DeleteImageQuery, params);

    return res.status(200).json({
      success: true,
    });

    // we will make sure that only the user who created the laptops can delete his own laptop_images
    // return if successful
    // throw error if not successful
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      response: err.message,
    });
  }
});

module.exports = router;
