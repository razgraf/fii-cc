const mongoose = require("mongoose");

const RelationshipSchema = mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true
  },
  status: {
    type: String,
    default: "Acquaintance",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports.RelationshipSchema = RelationshipSchema;
