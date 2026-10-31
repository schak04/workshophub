const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    registration_date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Registration", RegistrationSchema);
