const mongoose = require("mongoose");
const { t: typy } = require("typy");

const PublicKeySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quota: {
    type: String,
    default: 200,
    equired: true,
  },
  token: {
    type: String,
    required: true,
  },
  platform: {
    type: Number,
    default: 0,
  },
});

PublicKeySchema.set("timestamps", true);

const PublicKeyModel = mongoose.model("PublicKey", PublicKeySchema);

module.exports = PublicKeyModel;
