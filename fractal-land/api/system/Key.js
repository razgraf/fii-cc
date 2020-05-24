"use strict";

const KeyGenerator = require("uuid-apikey");
const { t: typy } = require("typy");

const Networking = require("./Networking");
const { ERRORS } = require("./../constants");

class Key {
  constructor(payload) {
    this.bind(payload);
  }

  bind({ _id, id, token, userId, quota, createdAt }) {
    this.id = _id || id;
    this.token = typy(token).safeString;
    this.userId = userId;
    this.quota = parseInt(quota);
    this.createdAt = String(createdAt);
  }

  toObject(clean = true) {
    const result = {};
    result.token = typy(this.token).safeString;
    result.quota = parseInt(this.quota);
    result.createdAt = typy(this.createdAt).safeString;

    if (!clean) {
      result.id = this.id;
      result.userId = this.userId;
    }
    return result;
  }

  static async create({ userId, userUuid, platform = 0 }) {
    console.log({ userId, userUuid });
    if (typy(userId).isFalsy && typy(userUuid).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    const user = await Networking.getUserFromDB({ id: userId, uuid: userUuid });
    if (!user) throw new Error(ERRORS.MISSING_USER);

    const token = await KeyGenerator.create().apiKey;
    const key = await Networking.insertKeyIntoDB({
      userId: user.id,
      token,
      platform,
    });

    if (!key) throw new Error(ERRORS.NETWORKING);

    return new Key(key);
  }

  static async get({ id }) {
    if (typy(id).isFalsy) throw new Error(ERRORS.INVALID_PARAMS);

    const key = await Networking.getKeyFromDB({ id });
    if (!key) throw new Error(ERRORS.MISSING_KEY);

    return new Key(key);
  }

  static async getList({ userId, userUuid }) {
    if (typy(userId).isFalsy && typy(userUuid).isFalsy)
      throw new Error(ERRORS.INVALID_PARAMS);

    const payload = {
      id: userId,
      uuid: typy(userUuid).safeString,
    };

    const user = await Networking.getUserFromDB({ ...payload });
    if (!user) throw new Error(ERRORS.MISSING_USER);

    const list = await Networking.getKeyListFromDB({ userId: user.id });

    if (!list || list.length === 0) return [];

    return list.map((e) => new Key(e));
  }
}

module.exports = Key;
