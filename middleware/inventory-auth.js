const jwt = require("jsonwebtoken");
require("dotenv").config();

const inventoryAuth = {
  // Middleware to check if user is Employee or Admin for inventory management
  requireEmployeeOrAdmin: (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
      req.flash("notice", "Please log in to access inventory management.");
      return res.redirect("/account/login");
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "your-secret-key");
      
      if (decoded.account_type !== 'Employee' && decoded.account_type !== 'Admin') {
        req.flash("notice", "You do not have permission to access inventory management.");
        return res.redirect("/account/");
      }
      
      res.locals.accountData = decoded;
      next();
    } catch (error) {
      res.clearCookie("jwt");
      req.flash("notice", "Your session has expired. Please log in again.");
      return res.redirect("/account/login");
    }
  }
};

module.exports = inventoryAuth;
