/*
 * All routes for favorites are defined here
 */

const express = require("express");
const router = express.Router();
const laptop_images = require("../../../db");
const { protectAPI } = require("../../../middlewares");
const user_favorites = require("../../../db");

// Add laptop images
router.post("/", protectAPI, async (req, res) => {
  // INSERT INTO user_favorites
  try {
    const { adId } = req.body;

    // query user favorites where user_id is same as req.session.userID join ads on ads.id = user_favorites.ad_id;
    const favorQuery = `SELECT * FROM user_favorites
  WHERE user_favorites.user_id = $1`;
    const params = [req.session.userID];
    const response = await user_favorites.query(favorQuery, params);
    // if the rows[0] is true then delete it
    if (!response.rows[0]) {
      // if false insert it
      const newFavoritQuery = `INSERT INTO user_favorites (ad_id, user_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4)`;
      const created_at = new Date();
      const updated_at = new Date();
      const NewFavorParams = [adId.ad_id, user_id, created_at, updated_at];
      await user_favorites.query(newFavoritQuery, NewFavorParams);
    }
    const deleteQuery = `DELETE FROM user_favorites 
    WHERE user_id = $1`;
    const deleteParams = [res.row[0]];
    await user_favorites.query(deleteQuery, deleteParams);
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

module.exports = router;
