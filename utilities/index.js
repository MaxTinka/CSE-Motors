const invModel = require("../models/inventory-model")

const utilities = {}

/* ***************************
 *  Build the navigation menu
 * ************************** */
utilities.getNav = async function () {
  try {
    let data = await invModel.getClassifications()
    if (data) {
      let list = "<ul>"
      list += '<li><a href="/" title="Home page">Home</a></li>'
      data.forEach((row) => {
        list += "<li>"
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>"
        list += "</li>"
      })
      list += "</ul>"
      return list
    } else {
      throw new Error("No classification data found")
    }
  } catch (error) {
    console.error("getNav error: " + error)
    // Return a basic navigation as fallback
    return `
      <ul>
        <li><a href="/" title="Home page">Home</a></li>
        <li><a href="/inv/" title="Inventory Management">Inventory</a></li>
      </ul>
    `
  }
}

/* ***************************
 *  Build the classification grid
 * ************************** */
utilities.buildClassificationGrid = async function(data){
  try {
    let grid
    if(data && data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  } catch (error) {
    console.error("buildClassificationGrid error: " + error)
    return '<p class="notice">Sorry, there was an error displaying vehicles.</p>'
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
utilities.buildVehicleDetail = async function(data){
  try {
    let detail
    if(data && data.length > 0){
      const vehicle = data[0]
      detail = '<div id="vehicle-detail">'
      detail += '<div class="detail-image">'
      detail += '<img src="' + vehicle.inv_image + '" alt="Image of ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '" />'
      detail += '</div>'
      detail += '<div class="detail-info">'
      detail += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
      detail += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
      detail += '<p><strong>Price:</strong> $' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
      detail += '<p><strong>Mileage:</strong> ' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</p>'
      detail += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
      detail += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
      detail += '</div>'
      detail += '</div>'
    } else {
      detail = '<p class="notice">Sorry, vehicle details could not be found.</p>'
    }
    return detail
  } catch (error) {
    console.error("buildVehicleDetail error: " + error)
    return '<p class="notice">Sorry, there was an error displaying vehicle details.</p>'
  }
}

/* ***************************
 *  Build classification list for select input
 * ************************** */
utilities.buildClassificationList = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications()
    let classificationList = '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    
    if (data) {
      data.forEach((row) => {
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
