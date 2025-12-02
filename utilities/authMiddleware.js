const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = {
  checkLogin: (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
      // User is not logged in
      res.locals.loggedin = false;
      res.locals.accountData = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "your-secret-key");
      res.locals.loggedin = true;
      res.locals.accountData = decoded;
      next();
    } catch (error) {
      // Token is invalid
      res.clearCookie("jwt");
      res.locals.loggedin = false;
      res.locals.accountData = null;
      next();
    }
  },

  requireLogin: (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
      req.flash("notice", "Please log in to access this page.");
      return res.redirect("/account/login");
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "your-secret-key");
      res.locals.accountData = decoded;
      next();
    } catch (error) {
      res.clearCookie("jwt");
      req.flash("notice", "Your session has expired. Please log in again.");
      return res.redirect("/account/login");
    }
  }
};

module.exports = authMiddleware;
