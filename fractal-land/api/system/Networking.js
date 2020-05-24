const { t: typy } = require("typy");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

const UserModel = require("../models/User");
const PublicKeyModel = require("../models/PublicKey");
const FractalModel = require("../models/Fractal");

class Networking {
  static async initialize() {
    return mongoose.connect(
      process.env.S_MONGO_CONN,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("Connected to Mongo DB.")
    );
  }

  static async getFractalFromDB({ id, uuid }) {
    await Networking.initialize();

    if (id) {
      const fractal = await FractalModel.findOne({ _id: id });
      if (fractal) {
        return Networking.fromMongoObject(fractal);
      }
      return fractal;
    }

    if (uuid) {
      const fractal = await FractalModel.findOne({ uuid });
      if (fractal) {
        return Networking.fromMongoObject(fractal);
      }
      return fractal;
    }

    console.warn("Missing data. Cannot find fractal without identifiers.");

    return null;
  }

  static async insertFractalIntoDB({
    name = "Fractal",
    definition,
    hash,
    userId,
    access,
    reference = null,
  }) {
    await Networking.initialize();

    const item = new FractalModel({
      uuid: uuidv4(),
      name,
      definition,
      user: new ObjectId(userId),
      hash,
      reference,
    });

    await item.save();

    if (!item) return null;

    const element = await Networking.getFractalFromDB({ id: item._id });
    return element;
  }

  static async insertUserIntoDB({ username, email, password: hashedPassword }) {
    await Networking.initialize();

    const item = new UserModel({
      uuid: uuidv4(),
      username,
      email,
      password: hashedPassword,
    });

    await item.save();

    if (!item) return null;

    const element = await Networking.getUserFromDB({ id: item._id });
    return element;
  }

  static async getUserFromDB({ id, uuid, email, username }) {
    await Networking.initialize();

    if (typy(id).isTruthy) {
      const user = await UserModel.findOne({ _id: id });
      if (user) return Networking.fromMongoObject(user);
      return user;
    }

    if (typy(uuid).isTruthy) {
      const user = await UserModel.findOne({ uuid });
      if (user) return Networking.fromMongoObject(user);
      return user;
    }

    if (typy(email).isTruthy) {
      const user = await UserModel.findOne({ email });
      if (user) return Networking.fromMongoObject(user);
      return user;
    }

    if (typy(username).isTruthy) {
      const user = await UserModel.findOne({ username });
      if (user) return Networking.fromMongoObject(user);
      return user;
    }
    return null;
  }

  static async insertKeyIntoDB({ token, userId, platform = 0 }) {
    await Networking.initialize();

    const item = new PublicKeyModel({
      token,
      user: new ObjectId(userId),
      platform: platform === 1 ? 1 : 0,
    });

    await item.save();

    if (!item) return null;

    const element = await Networking.getKeyFromDB({ id: item._id });
    return element;
  }

  static async getKeyFromDB({ id }) {
    await Networking.initialize();

    const key = await PublicKeyModel.findOne({ _id: id });
    if (key) {
      return Networking.fromMongoObject(key);
    }
    return key;
  }

  static async getLibraryKeyFromDB({ userId, token }) {
    await Networking.initialize();

    const key = await PublicKeyModel.findOne({
      user: new ObjectId(userId),
      token,
    });
    if (key) return Networking.fromMongoObject(key);
    return key;
  }

  static async spendKeyQuotaIntoDB({ id }) {
    await Networking.initialize();

    const key = await Networking.getKeyFromDB({ id });
    if (!key) return null;

    const element = await PublicKeyModel.findOneAndUpdate(
      { _id: id },
      { quota: key.quota - 1 },
      { new: true }
    );

    if (!element) return null;
    return Networking.fromMongoObject(element);
  }

  static async getKeyListFromDB({ userId }) {
    await Networking.initialize();

    const keys = await PublicKeyModel.find({
      user: new ObjectId(userId),
      platform: 0,
    });
    if (!keys) return [];
    return keys.map((key) => Networking.fromMongoObject(key));
  }

  static async matchUserKeyFromDB({ userUuid, token }) {
    await Networking.initialize();

    const user = await UserModel.findOne({ uuid: userUuid });
    if (!user) return false;

    const keys = await PublicKeyModel.find({
      user: new ObjectId(user._id),
      token,
    });

    if (keys) return true;
    return false;
  }

  static async getUserHistoryFromDB({ id }) {
    await Networking.initialize();

    const list = await FractalModel.find({
      user: new ObjectId(user._id),
    }).sort("createdAt", -1);

    if (!list) return [];
    return list.map((item) => Networking.fromMongoObject(item));
  }

  static async getFractalListFromDB({ userId, limit, offset }) {
    await Networking.initialize();

    const user = await UserModel.findOne({ _ud: userId });
    if (!user) return false;

    const list = await FractalModel.find({
      $or: [
        {
          user: new ObjectId(user._id),
          access: {
            $gt: 0,
          },
        },
        {
          access: {
            $gt: 1,
          },
        },
      ],
    }).sort("createdAt", -1);

    if (!list) return [];
    return list.map((item) => ({
      ...Networking.fromMongoObject(item),
      username: user.username,
    }));
  }

  static async setFractalPublishIntoDB({ id }) {
    await Networking.initialize();

    const element = await FractalModel.findOneAndUpdate(
      { _id: id },
      { access: 2 },
      { new: true }
    );

    if (!element) return null;
    return Networking.fromMongoObject(element);
  }

  static async setFractalUnpublishIntoDB({ id }) {
    await Networking.initialize();

    const element = await FractalModel.findOneAndUpdate(
      { _id: id },
      { access: 1 },
      { new: true }
    );

    if (!element) return null;
    return Networking.fromMongoObject(element);
  }

  static fromMongoObject(payload) {
    if (!payload) return null;
    const final = payload.toJSON();
    if (final._id) final.id = final._id;
    if (final.user) final.userId = final.user;
    return final;
  }
}

module.exports = Networking;
