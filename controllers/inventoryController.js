const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");
const pool = require("../database/");

const invController = {};

/* ***************************
 *  Get all inventory for management view
 * ************************** */
invController.getAllInventory = async function () {
  try {
    const sql = `
      SELECT i.*, c.classification_name 
      FROM inventory i 
      JOIN classification c ON i.classification_id = c.classification_id 
      ORDER BY i.inv_year DESC, i.inv_make, i.inv_model`;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("getAllInventory error:", error);
    return [];
  }
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    
    if (!classification_id || isNaN(classification_id)) {
      req.flash("error", "Invalid classification ID.");
      return res.redirect("/");
    }
    
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    
    if (!data || data.length === 0) {
      const classifications = await invModel.getClassifications();
      const classification = classifications.find(c => c.classification_id == classification_id);
      const className = classification ? classification.classification_name : "Vehicles";
      
      return res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid: '<p class="notice">No vehicles found in this classification.</p>',
      });
    }
    
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error building classification view:", error);
    req.flash("error", "Unable to load classification.");
    res.redirect("/");
  }
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId;
    
    if (!inventory_id || isNaN(inventory_id)) {
      req.flash("error", "Invalid vehicle ID.");
      return res.redirect("/");
    }
    
    const data = await invModel.getInventoryByInventoryId(inventory_id);
    
    if (!data || data.length === 0) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/");
    }
    
    const detailHTML = await utilities.buildVehicleDetail(data);
    let nav = await utilities.getNav();
    const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      detailHTML,
    });
  } catch (error) {
    console.error("Error building vehicle detail view:", error);
    req.flash("error", "Unable to load vehicle details.");
    res.redirect("/");
  }
};

/* ***************************
 *  Build management view with inventory list
 * ************************** */
invController.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    const inventoryList = await invController.getAllInventory();
    
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      inventoryList,
      errors: null,
    });
  } catch (error) {
    console.error("Error building management view:", error);
    req.flash("error", "Unable to load inventory management.");
    res.redirect("/");
  }
};

/* ***************************
 *  Build add classification view
 * ************************** */
invController.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error building add classification view:", error);
    req.flash("error", "Unable to load add classification page.");
    res.redirect("/inv/");
  }
};

/* ***************************
 *  Process add classification with validation
 * ************************** */
invController.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    
    // Validation
    if (!classification_name || classification_name.trim().length < 3) {
      let nav = await utilities.getNav();
      return res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: ["Classification name must be at least 3 characters."],
        classification_name: classification_name || ""
      });
    }
    
    const result = await invModel.addClassification(classification_name.trim());
    
    if (result) {
      let nav = await utilities.getNav();
      req.flash("success", `Classification "${classification_name}" was successfully added.`);
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect: await utilities.buildClassificationList(),
        inventoryList: await invController.getAllInventory(),
        errors: null,
      });
    } else {
      throw new Error("Failed to add classification");
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    let nav = await utilities.getNav();
    req.flash("error", "Sorry, adding classification failed. Name may already exist.");
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: ["Failed to add classification. Please try again."],
      classification_name: req.body.classification_name || ""
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invController.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
    });
  } catch (error) {
    console.error("Error building add inventory view:", error);
    req.flash("error", "Unable to load add vehicle page.");
    res.redirect("/inv/");
  }
};

/* ***************************
 *  Process add inventory with validation
 * ************************** */
invController.addInventory = async function (req, res, next) {
  try {
    const { 
      classification_id, 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color 
    } = req.body;

    // Validation
    const errors = [];
    if (!classification_id || classification_id === '') errors.push("Please select a classification.");
    if (!inv_make || inv_make.trim().length < 2) errors.push("Make is required (min 2 characters).");
    if (!inv_model || inv_model.trim().length < 2) errors.push("Model is required (min 2 characters).");
    if (!inv_year || inv_year < 1900 || inv_year > new Date().getFullYear() + 1) {
      errors.push("Please enter a valid year.");
    }
    if (!inv_price || inv_price <= 0) errors.push("Please enter a valid price.");
    
    if (errors.length > 0) {
      let nav = await utilities.getNav();
      const classificationSelect = await utilities.buildClassificationList();
      return res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationSelect,
        errors,
        ...req.body
      });
    }

    const result = await invModel.addInventory(
      classification_id,
      inv_make.trim(),
      inv_model.trim(),
      parseInt(inv_year),
      inv_description ? inv_description.trim() : '',
      inv_image ? inv_image.trim() : '/images/vehicles/no-image.jpg',
      inv_thumbnail ? inv_thumbnail.trim() : '/images/vehicles/no-image-tn.jpg',
      parseFloat(inv_price),
      inv_miles ? parseInt(inv_miles) : 0,
      inv_color ? inv_color.trim() : ''
    );
    
    if (result) {
      let nav = await utilities.getNav();
      req.flash("success", `Vehicle ${inv_year} ${inv_make} ${inv_model} was successfully added.`);
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect: await utilities.buildClassificationList(),
        inventoryList: await invController.getAllInventory(),
        errors: null,
      });
    } else {
      throw new Error("Failed to add vehicle");
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    req.flash("error", "Sorry, adding vehicle failed.");
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: ["Failed to add vehicle. Please try again."],
      ...req.body
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id);
    
    if (!classification_id || isNaN(classification_id)) {
      return res.status(400).json({ error: "Invalid classification ID" });
    }
    
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    
    if (invData && invData.length > 0) {
      return res.json(invData);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.error("Error getting inventory JSON:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/* ***************************
 *  Build edit inventory view with error handling
 * ************************** */
invController.buildEditInventory = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventory_id);
    
    if (!inventory_id || isNaN(inventory_id)) {
      req.flash("error", "Invalid vehicle ID.");
      return res.redirect("/inv/");
    }

    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInventoryId(inventory_id);
    
    if (!itemData || itemData.length === 0) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/inv/");
    }
    
    const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id);
    const itemName = `${itemData[0].inv_year} ${itemData[0].inv_make} ${itemData[0].inv_model}`;
    
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id
    });
  } catch (error) {
    console.error("Error building edit inventory view:", error);
    req.flash("error", "Unable to load edit page.");
    res.redirect("/inv/");
  }
};

/* ***************************
 *  Update Inventory Data with validation
 * ************************** */
invController.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    const { 
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = req.body;

    // Validation
    const errors = [];
    if (!inv_id || isNaN(inv_id)) errors.push("Invalid vehicle ID.");
    if (!inv_make || inv_make.trim().length < 2) errors.push("Make is required (min 2 characters).");
    if (!inv_model || inv_model.trim().length < 2) errors.push("Model is required (min 2 characters).");
    if (!inv_year || inv_year < 1900 || inv_year > new Date().getFullYear() + 1) {
      errors.push("Please enter a valid year.");
    }
    if (!inv_price || inv_price <= 0) errors.push("Please enter a valid price.");
    if (!inv_miles || inv_miles < 0) errors.push("Please enter valid mileage.");
    if (!classification_id || classification_id === '') errors.push("Please select a classification.");
    
    if (errors.length > 0) {
      const classificationSelect = await utilities.buildClassificationList(classification_id);
      return res.render("inventory/edit-inventory", {
        title: "Edit Vehicle",
        nav,
        classificationSelect,
        errors,
        ...req.body
      });
    }

    const updateResult = await invModel.updateInventory(
      parseInt(inv_id),
      inv_make.trim(),
      inv_model.trim(),
      parseInt(inv_year),
      inv_description ? inv_description.trim() : '',
      inv_image ? inv_image.trim() : '/images/vehicles/no-image.jpg',
      inv_thumbnail ? inv_thumbnail.trim() : '/images/vehicles/no-image-tn.jpg',
      parseFloat(inv_price),
      parseInt(inv_miles),
      inv_color ? inv_color.trim() : '',
      parseInt(classification_id)
    );

    if (updateResult) {
      const itemData = await invModel.getInventoryByInventoryId(inv_id);
      const itemName = `${itemData[0].inv_year} ${itemData[0].inv_make} ${itemData[0].inv_model}`;
      
      req.flash("success", `The ${itemName} was successfully updated.`);
      res.redirect("/inv/");
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id);
      const itemName = `${inv_year} ${inv_make} ${inv_model}`;
      req.flash("error", "Sorry, the update failed.");
      res.render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect,
        errors: ["Update failed. Please try again."],
        ...req.body
      });
    }
  } catch (error) {
    console.error("Error updating inventory:", error);
    req.flash("error", "An unexpected error occurred.");
    res.redirect("/inv/");
  }
};

/* ***************************
 *  Build delete inventory view with error handling
 * ************************** */
invController.buildDeleteInventory = async function (req, res, next) {
  try {
    const inventory_id = parseInt(req.params.inventory_id);
    
    if (!inventory_id || isNaN(inventory_id)) {
      req.flash("error", "Invalid vehicle ID.");
      return res.redirect("/inv/");
    }

    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInventoryId(inventory_id);
    
    if (!itemData || itemData.length === 0) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/inv/");
    }
    
    const itemName = `${itemData[0].inv_year} ${itemData[0].inv_make} ${itemData[0].inv_model}`;
    
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price,
      inv_image: itemData[0].inv_image
    });
  } catch (error) {
    console.error("Error building delete inventory view:", error);
    req.flash("error", "Unable to load delete confirmation.");
    res.redirect("/inv/");
  }
};

/* ***************************
 *  Delete Inventory Data with error handling
 * ************************** */
invController.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    
    if (!inv_id || isNaN(inv_id)) {
      req.flash("error", "Invalid vehicle ID.");
      return res.redirect("/inv/");
    }
    
    // Get vehicle info before deletion for success message
    const itemData = await invModel.getInventoryByInventoryId(inv_id);
    const itemName = itemData && itemData[0] ? 
      `${itemData[0].inv_year} ${itemData[0].inv_make} ${itemData[0].inv_model}` : 
      "Vehicle";
    
    const deleteResult = await invModel.deleteInventory(inv_id);
    
    if (deleteResult) {
      req.flash("success", `The ${itemName} was successfully deleted.`);
      res.redirect("/inv/");
    } else {
      req.flash("error", "Sorry, the delete failed. Vehicle may not exist.");
      res.redirect("/inv/delete/" + inv_id);
    }
  } catch (error) {
    console.error("Error deleting inventory:", error);
    req.flash("error", "An unexpected error occurred during deletion.");
    res.redirect("/inv/");
  }
};

module.exports = invController;
