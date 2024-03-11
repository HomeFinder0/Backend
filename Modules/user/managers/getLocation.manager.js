const asyncHandler = require("express-async-handler");
const appError = require("../../../Helpers/errorHandler").appError;
const axios = require("axios");
module.exports = asyncHandler(async (lat, lon, next) => {
  const url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=658c70e9df33d292789867vrca19035`;

  const response = await axios.get(url);
  if (response.error !== undefined || !response.data) {
    return next(
      new appError(response.error.message, response.error.code || 500)
    );
  }
  const { data } = response;
  const fullAddress = data.display_name;
  const city = data.address.city;
  const state = data.address.state;
  const country = data.address.country;
  const location = { fullAddress, city, state, country };
  return location;
});
