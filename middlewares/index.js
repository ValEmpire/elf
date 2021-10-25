const User = require("../db");

const isAuthUser = async (req, res) => {
  try {
    // get the cookie from session
    const userID = req.session["userID"];

    const query = "SELECT * FROM users WHERE id = $1";

    const params = [userID];

    // get the user from database
    const user = await User.query(query, params);

    // check if userID if its undefined return false
    if (!user.rows[0]) return undefined;

    // put the returned user from query and save it to request user object
    req.user = user.rows[0];

    return user.rows[0];
  } catch (err) {
    return err;
  }
};

// this is the function to protect our pages
const protectRoute = async (req, res, next) => {
  try {
    // check if user Is authenticated
    const user = await isAuthUser(req);

    if (user) {
      // go to next callback
      next();
      return;
    }

    // if its falsy
    res.redirect("/login");
    return;
  } catch (err) {
    console.log(err);
  }
};

const authPageRoute = async (req, res, next) => {
  // check if user Is authenticated
  // we want the authenticated user not to go this route
  try {
    const user = await isAuthUser(req);

    if (!user) {
      next();
      return;
    }

    res.redirect("/feed");
    return;
  } catch (err) {
    console.log(err);
  }
};

const publicRoute = async (req, res, next) => {
  try {
    await isAuthUser(req);

    next();
  } catch (err) {
    console.log(err);
  }
};

const protectAPI = async (req, res, next) => {
  try {
    const userID = req.session["userID"];

    if (!userID) {
      throw Error("Only authenticated users can go through this api.");
    }

    next();

  } catch (err) {
    return res.status(400).json({
      err
    });
  }
}

module.exports = { protectRoute, isAuthUser, authPageRoute, publicRoute, protectAPI };
