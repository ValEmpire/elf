/*
 * All routes for Pages are defined here
 */

const { application } = require("express");
const express = require("express");
const router = express.Router();
const {
  protectRoute,
  authPageRoute,
  publicRoute,
} = require("../../middlewares");

// PROTECTED PAGES
router.get("/dashboard", protectRoute, (req, res) => {
  const user = req.user;

  res.render("pages/dashboard", {
    user,
  });
});

router.get("/dashboard/:id", protectRoute, (req, res) => {
  const user = req.user;
  const ad_id = req.params.id;

  res.render("pages/sellerAd", {
    user,
    ad_id,
  });
});

router.get("/createad", protectRoute, (req, res) => {
  const user = req.user;

  res.render("pages/createAd", {
    user,
  });
});

router.get("/message", protectRoute, (req, res) => {
  const user = req.user;

  res.render("pages/message", {
    user,
  });
});

router.get("/favorite", protectRoute, (req, res) => {
  const user = req.user;

  res.render("pages/favorite", {
    user,
  });
});

router.get("/upload_images", protectRoute, (req, res) => {
  const user = req.user;

  res.render("pages/upload_images", {
    user,
  });
});

// PUBLIC PAGES
router.get("/", publicRoute, (req, res) => {
  const user = req.user;

  res.render("pages", {
    user,
  });
});

router.get("/feed", publicRoute, (req, res) => {
  const user = req.user;
  res.render("pages/feed", {
    user,
  });
});


router.get("/feed/:id", publicRoute, (req, res) => {
  const user = req.user;

  const ad_id = req.params.id;

  res.render("pages/ad", {
    ad_id,
    user,
  });
});

 // about page
 router.get('/about', publicRoute, (req, res) => {
  const user = req.user;
  res.render('pages/about' , {
    user,
 });
});

// AUTHENTICATED PAGES
router.get("/login", authPageRoute, (req, res) => {
  const user = req.user;

  res.render("pages/login", {
    user,
  });
});

router.get("/signup", authPageRoute, (req, res) => {
  const user = req.user;

  res.render("pages/signup", {
    user,
  });
});

router.get("/logout", (req, res) => {
  // remove the cookie session
  req.session = null;

  console.log(`cookie, ${req.session}`);

  res.redirect("/login");
});

// router.get("*", (req, res) => {
//   res.render("pages/404");
// });

module.exports = router;
