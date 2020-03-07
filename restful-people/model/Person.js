const mongoose = require("mongoose");
const { t: typy } = require("typy");

const PersonSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  isAlive: {
    type: Boolean,
    default: true
  }
});

const Model = mongoose.model("Person", PersonSchema);

class Person {
  static create({ firstName, lastName, age, isAlive }) {
    const item = new Model({
      firstName,
      lastName,
      age,
      isAlive
    });

    return item.save();
  }

  static find({ id }) {
    if (typy(id).isFalsy) {
      return Model.find();
    } else {
      return Model.findById(id);
    }
  }

  static async findIfExists({ id }) {
    let person = null;
    if (typy(id).isFalsy) return null;
    try {
      person = await Person.find({ id });
    } catch (error) {
      return null;
    }
    return person;
  }

  static remove({ id }) {
    if (typy(id).isFalsy) throw new Error("Missing parameters.");
    return Model.remove({ _id: id });
  }

  static edit(body) {
    const { id } = body;
    if (typy(id).isFalsy) throw new Error("Missing parameters.");
    delete body.id;
    return Model.findOneAndUpdate(
      { _id: id },
      { ...body },
      { new: true, useFindAndModify: false }
    );
  }

  static kill({ id }) {
    if (typy(id).isFalsy) throw new Error("Missing parameters.");
    return Model.findOneAndUpdate(
      { _id: id },
      { isAlive: false },
      { new: true, useFindAndModify: false }
    );
  }
}

module.exports = Person;
