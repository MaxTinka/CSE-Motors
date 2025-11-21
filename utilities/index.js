const util = {};

// Build vehicle detail HTML
util.buildVehicleDetail = async function (data) {
  return `
    <div class="vehicle-detail">
      <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      <h2>${data.inv_make} ${data.inv_model}</h2>
      <p class="price">$${util.formatPrice(data.inv_price)}</p>
      <p class="mileage">${util.formatMileage(data.inv_miles)} miles</p>
      <p class="description">${data.inv_description}</p>
    </div>
  `;
};

// Format price with commas
util.formatPrice = function (price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format mileage with commas
util.formatMileage = function (miles) {
  return miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
