// Add these validation utilities at the top
const validate = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  name: (name) => {
    return name && name.length >= 2 && name.length <= 50;
  },
  
  password: (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
};

/* ***************************
 * Server-side validation middleware
 * ************************** */
accountController.validateUpdate = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = [];
  
  // Validate first name
  if (!validate.name(account_firstname)) {
    errors.push('First name must be between 2 and 50 characters.');
  }
  
  // Validate last name
  if (!validate.name(account_lastname)) {
    errors.push('Last name must be between 2 and 50 characters.');
  }
  
  // Validate email
  if (!validate.email(account_email)) {
    errors.push('Please enter a valid email address.');
  }
  
  if (errors.length > 0) {
    let nav = await utilities.getNav();
    req.flash("error", errors.join(' '));
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors: errors
    });
  }
  
  // Check if email already exists (excluding current user)
  const account_id = req.body.account_id || res.locals.accountData?.account_id;
  const emailExists = await accountModel.checkEmailExists(account_email, account_id);
  
  if (emailExists) {
    let nav = await utilities.getNav();
    req.flash("error", "Email already exists. Please use a different email.");
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors: ["Email already exists."]
    });
  }
  
  next();
};

accountController.validatePassword = async (req, res, next) => {
  const { account_new_password, account_confirm_password } = req.body;
  const errors = [];
  
  // Validate new password
  if (!validate.password(account_new_password)) {
    errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
  }
  
  // Check if passwords match
  if (account_new_password !== account_confirm_password) {
    errors.push('Passwords do not match.');
  }
  
  if (errors.length > 0) {
    let nav = await utilities.getNav();
    req.flash("error", errors.join(' '));
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors
    });
  }
  
  next();
};

/* ***************************
 * Process account update
 * ************************** */
accountController.processUpdate = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    const { 
      account_id,
      account_firstname, 
      account_lastname, 
      account_email 
    } = req.body;

    // Update account in database
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Update JWT token with new information
      const token = jwt.sign(
        { 
          account_id: account_id,
          account_type: res.locals.accountData.account_type,
          account_email: account_email,
          account_firstname: account_firstname,
          account_lastname: account_lastname
        },
        process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );

      // Update cookie
      res.cookie("jwt", token, { 
        httpOnly: true, 
        maxAge: 3600000,
        secure: process.env.NODE_ENV === 'production'
      });

      // Update res.locals for immediate header update
      res.locals.accountData = {
        ...res.locals.accountData,
        account_firstname,
        account_lastname,
        account_email
      };

      // Get updated account data
      const updatedAccount = await accountModel.getAccountById(account_id);
      
      req.flash("notice", "Your account has been updated successfully.");
      return res.render("account/account-management", {
        title: "Account Management",
        nav,
        accountData: updatedAccount,
        errors: null
      });
    } else {
      req.flash("error", "Sorry, the update failed.");
      return res.render("account/update-account", {
        title: "Update Account",
        nav,
        accountData: req.body,
        errors: ["Update failed."]
      });
    }
  } catch (error) {
    console.error("processUpdate error:", error);
    req.flash("error", "Sorry, the update failed.");
    return res.render("account/update-account", {
      title: "Update Account",
      nav: await utilities.getNav(),
      errors: ["An error occurred."]
    });
  }
};

/* ***************************
 * Process password change
 * ************************** */
accountController.processPasswordChange = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    const account_id = req.body.account_id;
    const { 
      account_password, 
      account_new_password 
    } = req.body;

    // Get current account data
    const accountData = await accountModel.getAccountById(account_id);
    
    // Check current password
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    if (!passwordMatch) {
      req.flash("error", "Current password is incorrect.");
      return res.render("account/update-account", {
        title: "Update Account",
        nav,
        errors: ["Current password is incorrect."]
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(account_new_password, 10);
    
    // Update password in database
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Your password has been updated successfully.");
      
      // Get updated account data
      const updatedAccount = await accountModel.getAccountById(account_id);
      
      return res.render("account/account-management", {
        title: "Account Management",
        nav,
        accountData: updatedAccount,
        errors: null
      });
    } else {
      req.flash("error", "Sorry, password update failed.");
      return res.render("account/update-account", {
        title: "Update Account",
        nav,
        errors: ["Password update failed."]
      });
    }
  } catch (error) {
    console.error("processPasswordChange error:", error);
    req.flash("error", "Sorry, password update failed.");
    return res.render("account/update-account", {
      title: "Update Account",
      nav: await utilities.getNav(),
      errors: ["An error occurred."]
    });
  }
};
