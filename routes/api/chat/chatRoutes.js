/*** All roures for chat ****/

const { protectAPI } = require("../../../middlewares");
const express = require("express");
const { user } = require("pg/lib/defaults");
const router = express.Router();

const chat_members = require("../../../db");
const messages = require("../../../db");
const chats = require("../../../db");


// get all messages for single user by user.id

router.get("/messages", async (req, res) => {
  try{
    // const {}= req.body;

    const chatQuery = `SELECT chats.*, messages.* FROM chats
    JOIN chat_members ON chat_members.chat_id = chats.id
    JOIN messages ON messages.chat_id = chats.id
    WHERE chat_members.user_id = $1`
    
    const userId = req.session.userID
    const params = [userId]


    const response = await user.query(chatQuery, params);

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      response: err.message,
    });
  }
});

module.exports = router;
