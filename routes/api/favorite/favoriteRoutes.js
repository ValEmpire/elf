/*
 * All routes for favorites are defined here
 */

const express = require("express");
const router = express.Router();
const { protectAPI } = require("../../../middlewares");
const user_favorites = require("../../../db");

// Add laptop images
router.post("/", protectAPI, async (req, res) => {
  // INSERT INTO user_favorites
  try {
    const { adId } = req.body;

    console.log(req.body)
    // query user favorites where user_id is same as req.session.userID join ads on ads.id = user_favorites.ad_id;

    const favorQuery = `SELECT ads.* FROM ads
    JOIN user_favorites ON ads.id = user_favorites.ad_id
    WHERE user_favorites.user_id = $1 AND ads.id = $2`;

    const user = req.session.userID

    const params = [user, adId];

    const response = await user_favorites.query(favorQuery, params);

    // if the rows[0] is true then delete it
    if (response.rows.length === 0) {
      // if false insert it
      const newFavoritQuery = `INSERT INTO user_favorites (ad_id, user_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4)`;

      const created_at = new Date();

      const updated_at = new Date();

      const NewFavorParams = [adId, user, created_at, updated_at];

      await user_favorites.query(newFavoritQuery, NewFavorParams);

      return res.status(200).json({
        success: true,
      });
    }

    // ERROR HERE
    const deleteQuery = `DELETE FROM user_favorites 
    WHERE user_id = $1
    AND ad_id = $2`;

    const deleteParams = [user, adId];

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

router.get("/", protectAPI, async (req, res) => {
  try {

    // query here



    return res.status(200).json({
      success: true,
      response,
    });

  } catch (err) {
    console.log(err)

    return res.status(400).json({
      success: false,
      response: err.message
    })
  }
})

module.exports = router;
