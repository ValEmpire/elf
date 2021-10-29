/*
 * All routes for authentications are defined here
 */

const express = require("express");
const router = express.Router();

const user = require("../../../db");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, contact_phone } = req.body;

    // checking if passwords are maching
    const checkPassword = req.body.confirmPassword;
    if (password !== checkPassword) {
      throw new Error("Passwords not matched");
    }

    const hashPassword = bcrypt.hashSync(password, 12);

    const query = `INSERT INTO users (name, email, password, contact_phone)
    VALUES ( $1, $2, $3, $4 ) RETURNING id`;

    const params = [name, email, hashPassword, contact_phone];

    function validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    for (let param of params) {
      if (!param) {
        throw new Error("Please fill all fields");
      }
      if (name.length < 5) {
        throw new Error("Name sould be more then four characters");
      }
      if (!validateEmail(email)) {
        throw new Error("Email is invalid");
      }
      if (password.length <= 7) {
        throw new Error("Password should be more then 7 characters");
      }
      if (contact_phone.length !== 10) {
        throw new Error("Phone must be 10 digits long");
      }
    }

    const checkEmailQuery = `SELECT email FROM users WHERE email = $1 `;
    const param = [email];
    const checkEmailres = await user.query(checkEmailQuery, param);
    if (checkEmailres.rows.length > 0) {
      throw new Error("Email alredy exists");
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
    console.log(email, password);
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
      throw Error("Incorrect credentials");
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
