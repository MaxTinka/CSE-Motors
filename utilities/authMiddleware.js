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

  // Simple version that always allows access
  requireLogin: (req, res, next) => {
    next(); // Allow all access for now
  }
};

module.exports = authMiddleware;
