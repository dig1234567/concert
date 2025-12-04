const mongoose = require("mongoose");
const bcryptr = require("bcrypt");
const { Schema } = mongoose;

const seatSchema = new mongoose.Schema({
  zone: String,
  row: Number,
  seat: Number,
  seatCode: String, // A-1-1
  isBooked: { type: Boolean, default: false },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

module.exports = mongoose.model("Seat", seatSchema);
