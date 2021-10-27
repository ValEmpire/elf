/*
 * All routes for ads are defined here
 */

const express = require("express");
const router = express.Router();
const ads = require("../../../db");
const laptop = require("../../../db");
const { protectAPI } = require("../../../middlewares");
const {
  memorySizes,
  brands,
  storageTypes,
  conditions,
  storageSizeVal,
  screenSizeVal,
  priceVal,
  orderByVal,
  status,
} = require("../../../data");

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

    laptopQuery = `INSERT INTO laptops (brand_name, screen_size, condition, memory, price, storage_size, storage_type)
    VALUES ( $1, $2, $3, $4, $5, $6, $7) RETURNING id`;

    laptopParams = [
      brands[brand_name],
      screen_size,
      conditions[condition],
      memorySizes[memory],
      price,
      storage_size,
      storageTypes[storage_type],
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
  // the value of req.query is the index of real data imported from data/index.js
  // means we accept the index not the real value of the req.query
  // then match the index in the real data from data/index.js

  try {
    // these are the expected property of req.query
    const columns = [
      "memory",
      "brand_name",
      "storage_type",
      "condition",
      "storage_size",
      "screen_size",
      "price",
      "order_by",
    ];

    // Initial string query
    const queryString = `SELECT ads.*, laptop_images.url AS ad_image_url, laptops.* FROM ads
      LEFT OUTER JOIN laptops ON laptops.id = ads.laptop_id
      LEFT OUTER JOIN laptop_images ON ads.laptop_image_id = laptop_images.id
      WHERE ads.status = $1
    `;

    // this function generates a query with a param
    // accepts queryString
    const generateQuery = (query) => {
      // initial params of 0. this is the value of ads.status
      const params = [status[0]];

      const insertToQueryString = (data, table, col) => {
        params.push(data);

        query += ` AND ${table}.${col} = $${params.length}`;
      };

      const insertToQueryStringBetweenFrom = (data, table, col) => {
        params.push(data);

        query += `AND ${table}.${col} BETWEEN $${params.length}`;
      };

      const insertToQueryStringBetweenTo = (data) => {
        params.push(data);

        query += ` AND $${params.length}`;
      };

      for (let i = 0; i < columns.length; i++) {
        // these are the properties of the object req.query
        const filters = req.query;

        // we will use columns value as these are the values that we are expecting to have
        const key = columns[i];

        // get the value of filters with property key
        // put it in index as this is the value of the req.query.prop
        const index = filters[key];

        // if the filters[key] is not undefined
        if (index) {
          // the key is always the same as the column name of table
          const column = key;

          switch (column) {
            case "memory":
              insertToQueryString(memorySizes[index], "laptops", column);
              break;
            case "brand_name":
              insertToQueryString(brands[index], "laptops", column);
              break;
            case "storage_type":
              insertToQueryString(storageTypes[index], "laptops", column);
              break;
            case "condition":
              insertToQueryString(conditions[index], "laptops", column);
              break;
            case "storage_size":
              insertToQueryStringBetweenFrom(
                storageSizeVal[index][0],
                "laptops",
                column
              );

              insertToQueryStringBetweenTo(storageSizeVal[index][1]);
              break;
            case "screen_size":
              insertToQueryStringBetweenFrom(
                screenSizeVal[index][0],
                "laptops",
                column
              );

              insertToQueryStringBetweenTo(screenSizeVal[index][1]);
              break;
            case "price":
              insertToQueryStringBetweenFrom(
                priceVal[index][0],
                "laptops",
                column
              );

              insertToQueryStringBetweenTo(priceVal[index][1]);
              break;

            // we will concat the orderby at the end of the query string
            case "order_by":
              params.push(orderByVal[index]);

              query += ` ORDER BY $${params.length}`;
              break;

            default:
              break;
          }
        }
      }

      return { query, params };
    };

    // generate query
    const adQuery = generateQuery(queryString);

    console.log(adQuery);

    // query the database
    const queryAds = await ads.query(adQuery.query, adQuery.params);

    return res.status(200).json({
      success: true,
      response: queryAds.rows,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      success: false,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // we will make sure that only the user who created the ads can delete his own ads
    // return if successful
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
