const dotenv = require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const { t: typy } = require("typy");

const utils = require("./utils");
const { ENDPOINTS, HTTP_METHOD, PORT } = require("./constants");
const { PersonRouter } = require("./router");

const server = http.createServer(handle);
mongoose.connect(
  process.env.MONGO_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to Mongo DB.")
);
server.listen(PORT);
console.log(`Listening on http://localhost:${PORT}.`);

function handle(request, response) {
  const { url } = request;
  const { parts } = utils.endpoint({ url });

  console.log(url, parts);

  if (typy(parts, "[0]").safeString === ENDPOINTS.PEOPLE.ROOT)
    handlePeople(request, response);
  else utils.exitWithMetodNotImplemented({ response });
}

async function handlePeople(request, response) {
  try {
    const { method, url } = request;
    const { parts } = utils.endpoint({ url });

    if (method === HTTP_METHOD.GET) {
      if (await PersonRouter.GET({ parts, request, response })) return;
    } else if (method === HTTP_METHOD.POST) {
      if (await PersonRouter.POST({ parts, request, response })) return;
    } else if (method === HTTP_METHOD.PATCH) {
      if (await PersonRouter.PATCH({ parts, request, response })) return;
    } else if (method === HTTP_METHOD.PUT) {
      if (await PersonRouter.PUT({ parts, request, response })) return;
    } else if (method === HTTP_METHOD.DELETE) {
      if (await PersonRouter.DELETE({ parts, request, response })) return;
    }

    utils.exitWithMetodNotAllowed({ response });
  } catch (error) {
    utils.exitWithBadRequest({ response, message: error.message });
  }
}
