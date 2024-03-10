const mongoose = require("mongoose");
module.exports = () => {
   mongoose.connect(process.env.DATABASE).then((con) => {
    console.log("DB connection successful!");
  });
};
