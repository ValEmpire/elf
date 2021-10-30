/*
 * All routes for messages are defined here
 */

const express = require("express");
const router = express.Router();
const chat = require("../../../db");
const { protectAPI } = require("../../../middlewares");

router.post("/", protectAPI, async (req, res) => {
  try {
    // check if chatId already exists
    const { sellerId, body } = req.body;

    const userID = req.session.userID;

    const checkParams = [userID, sellerId];

    const checkString = `
      SELECT chat_id FROM chat_members
      WHERE user_id = $1
      OR user_id = $2
      GROUP BY chat_id
      HAVING count(*) > 1;
    `;

    const checkAd = await chat.query(checkString, checkParams);

    let chatId;

    const created_at = new Date();
    const updated_at = new Date();

    if (checkAd.rows.length > 0) {
      // chatId found
      chatId = checkAd.rows[0].chat_id;
    } else {
      const insertChatString = `
        INSERT INTO chats (name, created_at, updated_at)
        VALUES ($1, $2, $3)
        RETURNING id
      `;

      // Insert chat
      const insertChatParams = ["changeThis", created_at, updated_at];

      const insertChat = await chat.query(insertChatString, insertChatParams);

      chatId = insertChat.rows[0].id;

      // Insert chat_members
      // since there is two members in a chat we insert two
      const insertChatMemberString = `
        INSERT INTO chat_members (user_id, chat_id)
        VALUES ($1, $2);
      `;

      const insertChatMemberParams1 = [userID, chatId];

      const insertChatMemberParams2 = [sellerId, chatId];

      await chat.query(insertChatMemberString, insertChatMemberParams1);
      await chat.query(insertChatMemberString, insertChatMemberParams2);
    }

    //insert message
    const messageParams = [userID, chatId, body, created_at, updated_at];

    const messageString = `
      INSERT INTO messages (user_id, chat_id, body, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5);
    `;

    await chat.query(messageString, messageParams);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/", protectAPI, async (req, res) => {
  try {
    const userID = req.session.userID;

    const getChatParams = [userID];

    const getChatString = `
    SELECT chat_id, users.name FROM chat_members JOIN users ON chat_members.user_id = users.id WHERE chat_id = (SELECT chat_id FROM chats
      JOIN chat_members ON chat_members.chat_id = chats.id
      JOIN users ON chat_members.user_id = users.id WHERE users.id = 3) AND user_id <> 3;
    `;

    const chats = await chat.query(getChatString, getChatParams);

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
