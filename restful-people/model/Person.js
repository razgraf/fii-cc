const mongoose = require("mongoose");
const { t: typy } = require("typy");

const { RelationshipSchema } = require("./Relationship");

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
  },
  relationships: {
    type: [RelationshipSchema],
    default: []
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

  static async connect({ id1, id2, status }) {
    if (typy(id1).isFalsy) throw new Error("Missing parameters.");
    if (typy(id2).isFalsy) throw new Error("Missing parameters.");

    if (id1 === id2) throw new Error("Cannot have self-relationship.");

    const p1 = await this.findIfExists({ id: id1 });
    if (typy(p1).isFalsy) throw new Error("Missing person (1).");
    const p2 = await this.findIfExists({ id: id2 });
    if (typy(p2).isFalsy) throw new Error("Missing person (2).");

    const validator1 = typy(p1, "relationships").safeArray.some(
      rel =>
        typy(rel, "status").safeString === typy(status).safeString &&
        rel.personId === id2
    );

    const validator2 = typy(p2, "relationships").safeArray.some(
      rel =>
        typy(rel, "status").safeString === typy(status).safeString &&
        rel.personId === id1
    );

    if (typy(validator1).isTruthy && typy(validator2).isTruthy) return false;

    if (typy(validator1).isFalsy)
      await Model.updateMany(
        { _id: id1 },
        { $push: { relationships: { personId: id2, status } } }
      );

    if (typy(validator2).isFalsy)
      await Model.updateMany(
        { _id: id2 },
        { $push: { relationships: { personId: id1, status } } }
      );

    return [p1, p2];
  }

  static async disconnect({ id1, id2, status, force = false }) {
    if (typy(id1).isFalsy) throw new Error("Missing parameters.");
    if (typy(id2).isFalsy) throw new Error("Missing parameters.");

    if (id1 === id2)
      throw new Error("Cannot have or disconnect self-relationship.");

    const p1 = await this.findIfExists({ id: id1 });
    if (typy(p1).isFalsy) throw new Error("Missing person (1).");
    const p2 = await this.findIfExists({ id: id2 });
    if (typy(p2).isFalsy) throw new Error("Missing person (2).");

    if (typy(force).isTruthy) {
      const validator1 = typy(p1, "relationships").safeArray.some(
        rel => rel.personId == id2
      );
      const validator2 = typy(p2, "relationships").safeArray.some(
        rel => rel.personId == id1
      );
      if (typy(validator1).isFalsy && typy(validator2).isFalsy) return false;

      if (typy(validator1).isTruthy)
        await Model.updateMany(
          { _id: id1 },
          { $pull: { relationships: { personId: id2 } } }
        );

      if (typy(validator2).isTruthy)
        await Model.updateMany(
          { _id: id2 },
          { $pull: { relationships: { personId: id1 } } }
        );
      return [p1, p2];
    } else {
      const validator1 = typy(p1, "relationships").safeArray.some(
        rel =>
          typy(rel, "status").safeString === typy(status).safeString &&
          rel.personId == id2
      );
      const validator2 = typy(p2, "relationships").safeArray.some(
        rel =>
          typy(rel, "status").safeString === typy(status).safeString &&
          rel.personId == id1
      );
      if (typy(validator1).isFalsy && typy(validator2).isFalsy) return false;

      if (typy(validator1).isTruthy)
        await Model.updateMany(
          { _id: id1 },
          { $pull: { relationships: { status, personId: id2 } } }
        );

      if (typy(validator2).isTruthy)
        await Model.updateMany(
          { _id: id2 },
          { $pull: { relationships: { status, personId: id1 } } }
        );

      return [p1, p2];
    }
  }
}

module.exports.Person = Person;
module.exports.PersonSchema = PersonSchema;
