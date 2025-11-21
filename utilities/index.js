const invModel = require("../models/inventory-model")

const utilities = {}

/* ***************************
 * Construct navigation menu
 * ************************** */
utilities.getNav = async function () {
  try {
    let data = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    
    // Check if data and data.rows exist
    if (data && data.rows) {
      data.rows.forEach((row) => {
        list += '<li>'
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          '</a>'
        list += '</li>'
      })
    }
    
    list += '</ul>'
    return list
  } catch (error) {
    console.error("getNav error: " + error)
    // Return basic navigation if there's an error
    return '<ul><li><a href="/">Home</a></li></ul>'
  }
}

/* ***************************
 * Build the classification view HTML
 * ************************** */
utilities.buildClassificationGrid = async function (data) {
  let grid = ''
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += '<li>'
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>'
      grid += '</h2>'
      grid += '<span>$' + new Intl.NumberFormat().format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***************************
 * Build vehicle detail view HTML
 * ************************** */
utilities.buildVehicleDetail = async function (data) {
  if (data) {
    return `
      <div class="vehicle-detail">
        <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}" class="vehicle-image">
        <div class="vehicle-info">
          <h2>${data.inv_make} ${data.inv_model}</h2>
          <p class="price">$${new Intl.NumberFormat().format(data.inv_price)}</p>
          <p class="mileage">${new Intl.NumberFormat().format(data.inv_miles)} miles</p>
          <p class="color">Color: ${data.inv_color}</p>
          <p class="description">${data.inv_description}</p>
        </div>
      </div>
    `
  } else {
    return '<p class="notice">Sorry, vehicle details could not be found.</p>'
  }
}

module.exports = utilities
