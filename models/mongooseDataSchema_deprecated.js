const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  time: Date,
  muf_column: String,
  transmit_station: String,
  recive_station: String,
  muf_row: String,
  _id: mongoose.Schema.Types.ObjectId,
  vrange: Number,
  muf: Number,
});

module.exports = mongoose.models.Day || mongoose.model("Day", DataSchema);
