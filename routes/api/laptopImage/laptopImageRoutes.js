/*
 * All routes for laptop_images are defined here
 */

const express = require("express");
const router = express.Router();
const laptop_images = require("../../../db");
const { protectAPI } = require("../../../middlewares");

router.post("/", protectAPI, async (req, res) => {
  try {

    // INSERT INTO laptop_images, url, laptop_id

  } catch (err) {
    console.log(err);

  }
});

router.delete('/:id', protectAPI, async (req, res) => {
  try {

    // we will make sure that only the user who created the laptops can delete his own laptop_images

    // return if successful

    // throw error if not successful

  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
