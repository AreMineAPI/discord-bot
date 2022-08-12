const mongoose = require("mongoose");
module.exports = mongoose.model(
  "pinged",
  new mongoose.Schema({
    ping: String,
  })
);
