/*
 * All routes for Pages are defined here
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages");
});

router.get("/login", (req, res) => {
  // start the cookie session

  res.render("pages/login");
});

router.get("/signup", (req, res) => {
  // start the cookie session

  res.render("pages/signup");
});

router.get("/feed", (req, res) => {
  res.render("pages/feed");
});

router.get("/createad", (req, res) => {
  res.render("pages/createAd");
});

router.get("/message", (req, res) => {
  res.render("pages/message");
});

router.get("/favorite", (req, res) => {
  res.render("pages/favorite");
});

router.get("/logout", (req, res) => {
  // remove the cookie session

  res.redirect("/");
});

router.get("*", (req, res) => {
  res.render("pages/404");
});

module.exports = router;
