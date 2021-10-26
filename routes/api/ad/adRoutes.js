/*
 * All routes for ads are defined here
 */

const express = require("express");
const router = express.Router();
const ads = require("../../../db");
const laptop = require("../../../db");
const { protectAPI } = require("../../../middlewares");

router.post("/", protectAPI, async (req, res) => {
  try {
    const {
      brand_name,
      screen_size,
      condition,
      memory,
      price,
      storage_size,
      storage_type,
      title,
      description,
    } = req.body;

    for (let val of Object.values(req.body)) {
      if (!val) {
        throw new Error("Please fill all fields");
      }
    }

    laptopQuery = `INSERT INTO laptops (brand_name, screen_size, condition, memory, price, storage_size, storage_type)
    VALUES ( $1, $2, $3, $4, $5, $6, $7) RETURNING id`;

    laptopParams = [
      brand_name,
      screen_size,
      condition,
      memory,
      price,
      storage_size,
      storage_type,
    ];

    const res1 = await laptop.query(laptopQuery, laptopParams);

    const adQuery = `INSERT INTO ads (laptop_id, user_id, title, description, created_at, updated_at)
    VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING id`;

    const userId = req.session.userID;
    const created_at = new Date();
    const updated_at = new Date();
    console.log(res1);

    const adParams = [
      res1.rows[0].id,
      userId,
      title,
      description,
      created_at,
      updated_at,
    ];

    const response = await ads.query(adQuery, adParams);

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      response: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    // query all the ads
    // default no filter
    // sort by created_at DESC
    // sort by created_at ASC
    // sort by price DESC
    // sory by price ASC
    // filters [screen_size, memory_size, brand_name, storage_size, storage_type, condition, price ]
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      success: false,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // we will make sure that only the user who created the ads can delete his own ads
    if (res.rows[0].user_id !== req.session.userID) {
      throw new Error("You are not allowed.");
    }
    const deleteAdQuery = `DELETE FROM ads WHERE ads.id = $1`;

    const deleteAdPapams = [id];

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

router.put("/:id", async (req, res) => {
  try {
    // we will make sure that only the user who created the ads can update his own ads
    // return if successful
    // throw error if not successful
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    //  we will return a single ad with the id of params
    // we auqery db where id = params.id
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
