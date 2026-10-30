const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    certificate_url: String,
    issued_date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Certificate", CertificateSchema);

