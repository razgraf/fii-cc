"use strict";

module.exports.method = {
  GET: "GET",
  DELETE: "DELETE",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT"
};

module.exports.status = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUHTORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405, // reference from https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501
};

module.exports.endpoints = {
  home: {
    root: "/"
  },
  connect: {
    root: "/connect"
  },
  createPost: {
    root: "/createPost"
  },

  api: {
    manage: {
      root: "/api/manage/:token"
    },
    disconnect: {
      root: "/api/disconnect"
    }
  }
};
module.exports.PORT = process.env.PORT || 4001;
module.exports.ROOT =
  process.env.STAGE_PRODUCTION == "true"
    ? process.env.ROOT_PRODUCTION
    : process.env.ROOT;

module.exports.vendors = {
  firebase: {
    config: {
      apiKey: process.env.ENV_FIREBASE_API_KEY,
      authDomain: process.env.ENV_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.ENV_FIREBASE_DATABASE_URL,
      projectId: process.env.ENV_FIREBASE_PROJECT_ID,
      storageBucket: process.env.ENV_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.ENV_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.ENV_FIREBASE_APP_ID,
      measurementId: process.env.ENV_FIREBASE_MEASUREMENT_ID
    }
  }
};
