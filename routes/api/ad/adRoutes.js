/*
 * All routes for ads are defined here
 */

const { response } = require("express");
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

router.delete("/:id", protectAPI, async (req, res) => {
  try {
    const { id } = req.params;

    const deleteAdQuery = `DELETE FROM ads WHERE ads.id = $1 AND user_id = $2`;

    const deleteAdPapams = [id, req.session.userID];

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

router.put("/:id", protectAPI, async (req, res) => {

  try {
    const { id } = req.params; //adId

    const adLaptop = await laptop.query(`SELECT laptops.id, ads.user_id FROM laptops JOIN ads ON ads.laptop_id = laptops.id WHERE ads.id = $1`, [id]);

    if (adLaptop.rows.length === 0) throw new Error("Ad not found");

    const adLaptopId = adLaptop.rows[0].id;

    const adLaptopOwner = adLaptop.rows[0].user_id;

    const userID = req.session.userID;

    if (adLaptopOwner !== userID) throw new Error("You're only allowed to update your own ad.")

    // expected body
    // brand_name, //laptops
    // screen_size, //laptops
    // condition, //laptops
    // memory, //laptops
    // price, //laptops
    // storage_size, //laptops
    // storage_type, //laptops
    // title, //ads
    // description, //ads

    const fields = req.body;

    const adParam = [];
    const laptopParam = [];

    let adQueryString = `UPDATE ads SET`;

    let laptopQueryString = `UPDATE laptops SET`;

    for (const field in fields) {
      if (field === 'title' || field === 'description') {
        adParam.push(fields[field]);
        adQueryString += ` ${field} = $${adParam.length}`
      }
      else {
        laptopParam.push(fields[field])
        laptopQueryString += ` ${field} = $${laptopParam.length}`
      }
    }

    if (adParam.length > 0) {
      adParam.push(id);

      adQueryString += ` WHERE ads.id = $${adParam.length}`;

      console.log(adQueryString);

      await ads.query(adQueryString, adParam);
    }

    if (laptopParam.length > 0) {
      laptopParam.push(adLaptopId);

      laptopQueryString += ` WHERE laptops.id = $${laptopParam.length}`;

      console.log(laptopQueryString)

      await laptop.query(laptopQueryString, laptopParam);

    }

    return res.status(200).json({
      success: true,
    });

    // we will make sure pthat only the user who created the ads can update his own ads
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

// router.put("/:id", async (req, res) => {

//   try {
//     const { id } = req.params;
//     const {
//        title,
//       description,
//     } = req.body;

//     console.log(req.body)




//     let queryString = `UPDATE ads 
//     SET `;
//     let param = [];


//     if (title) {
//       param.push(title);
//       queryString += ` title = $1`;

//       if (description) {
//         param.push(description);
//         queryString += `, description = $2`;
//       }
//     }
//     queryString += `  
//         WHERE id = $3 RETURNING *; `;
//         param.push(id);

//     const response = await ads.query(queryString, param);


//     return res.status(200).json({
//       success: true,
//       response: response.rows,
//     });


//   } catch (err) {
//     console.log(err);
//     return res.status(400).json({
//       success: false,
//       response: err.message,
//     });
//   }
// });



// DISPLAY SINGLE ADD
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `SELECT * FROM ads 
                  WHERE id = $1`;

    const param = [id];

    const response = await ads.query(query, param);

    return res.status(200).json({
      success: true,
      response: response.rows,
    });
    //  we will return a single ad with the id of params
    // we auqery db where id = params.id
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      responce: err.message,
    });
  }
});

module.exports = router;
