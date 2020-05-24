const mongoose = require("mongoose");
const { t: typy } = require("typy");

const FractalSchema = mongoose.Schema({
  uuid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  definition: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hash: {
    type: String,
  },
  reference: {
    type: String,
  },
  access: {
    type: Number,
    default: 1,
  },
});

FractalSchema.set("timestamps", true);

const FractalModel = mongoose.model("Fractal", FractalSchema);

module.exports = FractalModel;
