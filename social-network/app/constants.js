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
  }
};
module.exports.PORT = process.env.PORT || 4001;
