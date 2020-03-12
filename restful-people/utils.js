const urllib = require("url");
const { t: typy } = require("typy");
const { HTTP_STATUS } = require("./constants");

class utils {
  static async body({ request, response }) {
    const result = await new Promise((resolve, reject) => {
      let builder = [];
      request
        .on("error", error => reject(error))
        .on("data", chunk => {
          builder.push(chunk);
        })
        .on("end", () => {
          builder = Buffer.concat(builder).toString();
          try {
            const parsed = JSON.parse(builder || "{}");
            resolve(parsed);
          } catch (errorParser) {
            reject(errorParser);
          }
        });
    });
    return result;
  }

  static endpoint({ url }) {
    const endpoint = urllib.parse(url, true);
    const parts = endpoint.path.split("/");
    if (typy(parts, "[0]").isEmptyString) parts.shift();
    if (typy(parts, `[${parts.length - 1}]`).isEmptyString) parts.pop();
    return {
      endpoint,
      parts
    };
  }

  static exitWithOk({ result, response }) {
    utils.writeJSONResponse({
      response,
      code: HTTP_STATUS.OK,
      result: result || {
        message: `${HTTP_STATUS.OK}: 👌 Ok.`
      }
    });
  }

  static exitWith({ status, result, response }) {
    utils.writeJSONResponse({
      response,
      code: status || HTTP_STATUS.SERVER_ERROR,
      result: result || {
        message: `${status || HTTP_STATUS.SERVER_ERROR}: 🛠.`
      }
    });
  }

  static exitWithBadRequest({ message, response }) {
    utils.writeJSONResponse({
      response,
      code: HTTP_STATUS.BAD_REQUEST,
      result: {
        message: message || `${HTTP_STATUS.BAD_REQUEST}: 🚨 Bad Request.`
      }
    });
  }

  static exitWithMetodNotAllowed({ response }) {
    utils.writeJSONResponse({
      response,
      code: HTTP_STATUS.METHOD_NOT_ALLOWED,
      result: {
        message: `${HTTP_STATUS.METHOD_NOT_ALLOWED}: Method not allowed.`
      }
    });
  }

  static exitWithMetodNotImplemented({ response }) {
    utils.writeJSONResponse({
      response,
      code: HTTP_STATUS.NOT_IMPLEMENTED,
      result: {
        message: `${HTTP_STATUS.NOT_IMPLEMENTED}: Functionality not implemented.`
      }
    });
  }

  static writeJSONResponse({ response, code, result }) {
    response.writeHead(code, { "Content-Type": "application/json" });
    response.write(JSON.stringify(result));
    response.end();
  }
}

module.exports = utils;
