const { t: typy } = require("typy");

const utils = require("../utils");
const { HTTP_METHOD, HTTP_STATUS } = require("../constants");
const { Person } = require("../model");

class PersonRouter {
  static async GET({ parts, request, response }) {
    if (parts.length <= 2) {
      // only ...people and .../people/id
      if (typy(parts, "[1]").isTruthy) {
        const data = await Person.findIfExists({
          id: typy(parts, "[1]").safeString
        });

        if (!data) {
          utils.exitWith({
            status: HTTP_STATUS.NOT_FOUND,
            response,
            result: {
              message: "The description doesn't match any person."
            }
          });
        } else {
          utils.exitWithOk({
            response,
            result: {
              data
            }
          });
        }
      } else {
        const data = await Person.find({});
        utils.exitWithOk({
          response,
          result: {
            data
          }
        });
      }
      return true;
    }
    return false;
  }

  static async POST({ parts, request, response }) {
    if (parts.length === 3) {
      // only .../people/id/id

      const id1 = typy(parts, "[1]").safeString;
      const id2 = typy(parts, "[2]").safeString;

      const body = await utils.body({ request, response });
      const status = typy(body, "status").safeString;

      if (typy(status).isFalsy) throw new Error("Missing parameters: status");

      const people = await Person.connect({
        id1,
        id2,
        status
      });

      if (typy(people).isFalsy) {
        utils.exitWith({
          status: HTTP_STATUS.NO_CONTENT,
          response,
          result: {
            message: `A '${status}' connection is already present between these 2.`
          }
        });
        return true;
      }

      utils.exitWith({
        status: HTTP_STATUS.CREATED,
        response,
        result: {
          message: `Connected ${people[0].firstName} and ${people[1].firstName} : ${status}`
        }
      });

      return true;
    } else if (parts.length === 1) {
      // only .../people

      const body = await utils.body({ request, response });
      const data = await Person.create(typy(body).safeObjectOrEmpty);

      utils.exitWith({
        status: HTTP_STATUS.CREATED,
        response,
        result: {
          data
        }
      });

      return true;
    }

    return false;
  }

  static async PATCH({ parts, request, response }) {
    if (parts.length <= 2) {
      //only .../people/id -- edit
      if (typy(parts, "[1]").isTruthy) {
        const id = typy(parts, "[1]").safeString;
        const data = await Person.findIfExists({ id });

        if (!data) {
          utils.exitWith({
            status: HTTP_STATUS.NOT_FOUND,
            response,
            result: {
              message: "The description doesn't match any person."
            }
          });
          return true;
        }

        const body = await utils.body({ request, response });
        const edited = await Person.edit({
          ...typy(body).safeObjectOrEmpty,
          id
        });

        utils.exitWith({
          status: HTTP_STATUS.OK,
          response,
          result: {
            message: "This person has brand new details. Edit 👌.",
            data: edited
          }
        });

        return true;
      }
    }
    if (parts.length === 3) {
      // only .../people/id/kill
      if (
        typy(parts, "[1]").isTruthy &&
        typy(parts, "[2]").safeString === "kill"
      ) {
        const id = typy(parts, "[1]").safeString;
        const data = await Person.findIfExists({ id });

        if (!data) {
          utils.exitWith({
            status: HTTP_STATUS.NOT_FOUND,
            response,
            result: {
              message: "The description doesn't match any person."
            }
          });
          return true;
        }

        if (!typy(data, "isAlive").safeBoolean) {
          utils.exitWith({
            status: HTTP_STATUS.OK,
            response,
            result: {
              message:
                "This person is already dead 😰. No additional actions needed."
            }
          });
          return true;
        }

        const newData = await Person.kill({ id });

        utils.exitWith({
          status: HTTP_STATUS.OK,
          response,
          result: {
            message:
              "This person was unfortunately and successfully murdered 🔪.",
            data: newData
          }
        });

        return true;
      }
    }
    return false;
  }

  static async DELETE({ parts, request, response }) {
    if (parts.length === 3) {
      // only .../people/id/id - disconnect

      const id1 = typy(parts, "[1]").safeString;
      const id2 = typy(parts, "[2]").safeString;

      const body = await utils.body({ request, response });
      const status = typy(body, "status").safeString;

      if (typy(status).isFalsy) throw new Error("Missing parameters: status");

      const people = await Person.disconnect({
        id1,
        id2,
        status
      });

      if (typy(people).isFalsy) {
        utils.exitWith({
          status: HTTP_STATUS.NOT_FOUND,
          response,
          result: {
            message: `No connection '${status}' found between those 2.`
          }
        });
        return true;
      }

      utils.exitWith({
        status: HTTP_STATUS.CREATED,
        response,
        result: {
          message: `Disconnected ${people[0].firstName} and ${people[1].firstName} : ${status}`
        }
      });

      return true;
    }

    if (parts.length === 2) {
      //only .../people/id -- edit
      if (typy(parts, "[1]").isTruthy) {
        const id = typy(parts, "[1]").safeString;
        const data = await Person.findIfExists({ id });

        if (!data) {
          utils.exitWith({
            status: HTTP_STATUS.NOT_FOUND,
            response,
            result: {
              message: "The description doesn't match any person."
            }
          });
          return true;
        }

        const removed = await Person.remove({
          id
        });

        utils.exitWith({
          status: HTTP_STATUS.OK,
          response,
          result: {
            message: "The person has been removed 🏴‍."
          }
        });

        return true;
      }
    }
    return false;
  }

  static async PUT({ parts, request, response }) {
    if (parts.length === 3) {
      // only .../people/id/id - replace relationships between 2 people

      const id1 = typy(parts, "[1]").safeString;
      const id2 = typy(parts, "[2]").safeString;

      const body = await utils.body({ request, response });
      const { relationships } = body;

      if (typy(relationships).isNullOrUndefined || !typy(relationships).isArray)
        throw new Error("Missing or wrong parameters: relationships");

      const respect = typy(relationships).safeArray.every(
        rel => typy(rel, "status").isTruthy
      );

      if (!respect)
        throw new Error("Format not respected (status): relationships");

      const disconnect = await Person.disconnect({
        id1,
        id2,
        force: true
      });

      for (let i = 0; i < relationships.length; i++) {
        const rel = relationships[i];
        Person.connect({
          id1,
          id2,
          status: typy(rel, "status").safeString
        });
      }

      utils.exitWith({
        status: HTTP_STATUS.OK,
        response,
        result: {
          message: "Replaced relationships 🙌."
        }
      });

      return true;
    }

    return false;
  }
}

module.exports = PersonRouter;
