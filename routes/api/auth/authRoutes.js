/*
 * All routes for authentications are defined here
 */

const express = require("express");
const router = express.Router();
const user = require("../../../db");
const bcrypt = require("bcrypt");
const { format } = require("morgan");
const laptop = require("../../../db");
const ads = require("../../../db");
router.post("/createAd", async (req, res) => {
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
        throw new Error('Please fill all fields')
      }
    }

  
    laptopQuery = `INSERT INTO laptops (brand_name, screen_size, condition, memory, price, storage_size, storage_type)
    VALUES ( $1, $2, $3, $4, $5, $6, $7) RETURNING id`

    laptopParams = [brand_name, screen_size, condition, memory, price, storage_size, storage_type]


    const res1 = await laptop.query(laptopQuery, laptopParams);

    const adQuery = `INSERT INTO ads (laptop_id, user_id, title, description, created_at, updated_at)
    VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING id`;

    const userId = req.session.userID
    const created_at = new Date();
    const updated_at = new Date();
    console.log(res1);

    const adParams = [res1.rows[0].id, userId, title, description, created_at, updated_at];

    const response = await ads.query(adQuery, adParams)

    return res.status(200).json({
      saccess: true,
      response,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      saccess: false,
      response: err.message,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, contact_phone } = req.body;

    const hashPassword = bcrypt.hashSync(password, 12);

    const query = `INSERT INTO users (name, email, password, contact_phone)
    VALUES ( $1, $2, $3, $4 ) RETURNING id`;

    const params = [name, email, hashPassword, contact_phone];

    for (let param of params) {
      if (!param) {
        throw new Error('Please fill all fields')
      }
    }

    const response = await user.query(query, params);

    // start the session
    req.session.userID = response.rows[0].id;

    return res.status(200).json({
      saccess: true,
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

router.post("/login", async (req, res) => {
  try {
    // get the body from request
    const { email, password } = req.body;

    // query
    const query = `SELECT * FROM users WHERE email = $1`;

    const param = [email];

    // put the returned value in response
    // if this returns an error returns an error
    // the catch function will be called
    const response = await user.query(query, param);

    // check if password match
    const isPasswordMatch = await bcrypt.compare(
      password,
      response.rows[0].password
    );

    if (!isPasswordMatch) {
      throw Error("Password does not matched!");
    }

    // start the session
    req.session.userID = response.rows[0].id;

    // then return response
    return res.status(200).json({
      success: true,
      response: response.rows[0],
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      success: false,
      response: err.message,
    });
  }
});

// router.post("/login", (req, res) => {
//   // get the body from request
//   const { email, password } = req.body;

//   // query
//   const query = `SELECT * FROM users WHERE email = $1`;

//   const param = [email];

//   // return user query
//   return user
//     .query(query, param)
//     .then((data) => {
//       console.log(data.rows[0]);

//       // this is the response from db
//       const response = data.rows[0];

//       // check the password if it matches
//       bcrypt.compare(password, response.password).then(function (result) {
//         // if it returns a falsy
//         if (!result) {
//           return res.status(400).json({
//             success: false,
//             response: "Password does not matched!",
//           });
//         }

//         // if success
//         // start the session
//         req.session.userID = user.id;

//         // then return
//         return res.status(200).json({
//           success: true,
//           response,
//         });
//       });
//     })
//     .catch((err) => console.log(err));
// });

module.exports = router;
