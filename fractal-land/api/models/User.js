const mongoose = require("mongoose");
const { t: typy } = require("typy");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.set("timestamps", true);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
