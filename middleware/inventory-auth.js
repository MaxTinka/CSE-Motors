const jwt = require("jsonwebtoken");
require("dotenv").config();

const inventoryAuth = {
  // Middleware to check if user is Employee or Admin
  requireEmployeeOrAdmin: (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
      req.flash("error", "Please log in to access inventory management.");
      return res.redirect("/account/login");
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "your-secret-key");
      
      if (decoded.account_type !== 'Employee' && decoded.account_type !== 'Admin') {
        req.flash("error", "You do not have permission to access inventory management.");
        return res.status(403).render("account/login", {
          title: "Access Denied",
          errors: ["Insufficient permissions."]
        });
      }
      
      res.locals.accountData = decoded;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      res.clearCookie("jwt");
      req.flash("error", "Your session has expired. Please log in again.");
      return res.redirect("/account/login");
    }
  },

  // Check if user can modify inventory (Admin only for delete, Employee/Admin for edit)
  canModifyInventory: (action) => {
    return (req, res, next) => {
      const token = req.cookies.jwt;
      
      if (!token) {
        return res.status(401).json({ error: "Authentication required" });
      }

      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "your-secret-key");
        
        if (action === 'delete' && decoded.account_type !== 'Admin') {
          return res.status(403).json({ error: "Admin privileges required for deletion" });
        }
        
        if ((action === 'edit' || action === 'update') && 
            decoded.account_type !== 'Employee' && decoded.account_type !== 'Admin') {
          return res.status(403).json({ error: "Employee or Admin privileges required" });
        }
        
        next();
      } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
      }
    };
  }
};

module.exports = inventoryAuth;
