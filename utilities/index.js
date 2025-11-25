const invModel = require("../models/inventory-model")

const utilities = {}

// ... keep your existing functions ...

/* ***************************
 *  Build classification list for select input
 * ************************** */
utilities.buildClassificationList = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    
    if (data && data.rows) {
      data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (classification_id != null && row.classification_id == classification_id) {
          classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
      })
    }
    
    classificationList += "</select>"
    return classificationList
  } catch (error) {
    console.error("buildClassificationList error: " + error)
    return '<select name="classification_id" id="classificationList" required><option value="">Choose a Classification</option></select>'
  }
}

/* ***************************
 *  Error handling wrapper
 * ************************** */
utilities.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = utilities
