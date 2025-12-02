const invModel = require("../models/inventory-model");

const utilities = {};

/* ***************************
 *  Build the navigation menu
 * ************************** */
utilities.getNav = async function () {
  try {
    const data = await invModel.getClassifications();
    if (data && data.length > 0) {
      let list = "<ul>";
      list += '<li><a href="/" title="Home page">Home</a></li>';
      data.forEach((row) => {
        list += "<li>";
        list += '<a href="/inv/type/' + row.classification_id + 
                '" title="See our ' + row.classification_name + 
                ' vehicles">' + row.classification_name + "</a>";
        list += "</li>";
      });
      list += "</ul>";
      return list;
    } else {
      return '<ul><li><a href="/">Home</a></li></ul>';
    }
  } catch (error) {
    console.error("getNav error:", error);
    return '<ul><li><a href="/">Home</a></li></ul>';
  }
};

/* ***************************
 *  Build classification list for select input
 * ************************** */
utilities.buildClassificationList = async function (classification_id = null) {
  try {
    const data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList">';
    classificationList += "<option value=''>Choose a Classification</option>";
    
    if (data && data.length > 0) {
      data.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"';
        if (classification_id != null && row.classification_id == classification_id) {
          classificationList += " selected ";
        }
        classificationList += ">" + row.classification_name + "</option>";
      });
    }
    
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("buildClassificationList error:", error);
    return '<select><option>No classifications available</option></select>';
  }
};

// Add other functions as needed
utilities.buildClassificationGrid = async function(data) {
  return '<p>Vehicle grid would appear here</p>';
};

utilities.buildVehicleDetail = async function(data) {
  return '<p>Vehicle details would appear here</p>';
};

utilities.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = utilities;
