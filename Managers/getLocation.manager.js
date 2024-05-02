const asyncHandler = require("express-async-handler");
const appError = require("../Helpers/appError");
const axios = require("axios");
module.exports = asyncHandler(async (lat, lon, next) => {
  const url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=658c70e9df33d292789867vrca19035`;
  
  const response = await axios.get(url);
  const { data } = response;

  if (!data || data.error) {
    next(new appError(data ? data.error : "Unable to geocode", 500));
    return;
  }

  const fullAddress = data.display_name;
  const city = data.address.city;
  const state = data.address.state;
  const country = data.address.country;
  const location = { fullAddress, city, state, country };
  return location;
});
