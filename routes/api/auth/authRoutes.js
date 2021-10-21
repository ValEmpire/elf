/*
 * All routes for authentications are defined here
 */

const express = require("express");
const router = express.Router();
const user = require("../../../db");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {});

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
    req.session.userID = user.id;

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
