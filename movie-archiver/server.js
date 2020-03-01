const dotenv = require("dotenv");
dotenv.config();
//format("YYYY MM DD HH:mm:ss")
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const fs = require("fs");
const http = require("http");
const path = require("path");
const urllib = require("url");

const { logger } = require("./logger");
const { HTTP_METHOD, HTTP_STATUS, PORT } = require("./constants");
const { fetchLogs, fetchPDF, fetchMovie, fetchNews } = require("./networking");
const { t: typy } = require("typy");

const server = http.createServer(handle);
server.listen(PORT);

console.log(`Listening on http://localhost:${PORT}`);
logger.log(`Listening on http://localhost:${PORT}`);

function handle(request, response) {
  const { method, url } = request;
  console.log(method, url);

  logger.log(`Request received.`, { extra: { method, url } });

  try {
    switch (url) {
      case "/home": {
        handle_home({ request, response });
        break;
      }
      case "/metrics": {
        handle_metrics({ request, response });
        break;
      }
      case "/analysis.log": {
        handle_logs({ request, response });
        break;
      }
      default:
        if (url.startsWith("/file/")) {
          writeLocalPDF(response, url);
          break;
        }
        if (method === HTTP_METHOD.GET) {
          handle_search({ request, response });
        } else throw new Error("Method not supported for this endpoint.");
        break;
    }
  } catch (error) {
    writeJSONResponse(response, HTTP_STATUS.BAD_REQUEST, {
      error: error.message || "🚨"
    });
  }
}

function handle_search({ request, response }) {
  const parts = urllib.parse(request.url, true);

  if (typy(parts).Falsy || typy(parts, "query.title").isNullOrUndefined)
    throw new Error("Specify movie title");

  const title = typy(parts, "query.title").safeString;

  console.log(title);

  fetchMovie({ title })
    .then(movie => {
      fetchNews({ title }).then(news => {
        fetchPDF({ title, movie, news }).then(name => {
          writeJSONResponse(response, HTTP_STATUS.OK, { name });
        });
      });
    })
    .catch(e => {
      writeJSONResponse(response, HTTP_STATUS.BAD_REQUEST, {
        error: e.message
      });
    });
}

function handle_home({ request, response }) {
  let filePath = path.join(__dirname, "app/home.html");

  fs.readFile(filePath, "latin1", function(error, content) {
    if (error) {
      writeJSONResponse(response, HTTP_STATUS.BAD_REQUEST, {
        error: "Server-side rendering error."
      });
    } else {
      logger.log("Returning homepage.");
      writeHTMLResponse(response, HTTP_STATUS.OK, content);
    }
  });
}

function handle_logs({ request, response }) {
  fetchLogs()
    .then(content => {
      logger.log("Returning analysis logs.", {
        extra: { type: "file", target: "analysis" }
      });
      writeHTMLResponse(response, HTTP_STATUS.OK, content);
    })
    .catch(() => {
      logger.log("Returning analysis logs.", {
        level: "error",
        extra: { type: "file", target: "analysis" }
      });
      writeJSONResponse(response, HTTP_STATUS.BAD_REQUEST, {
        error: "Server-side rendering error."
      });
    });
}

function handle_metrics({ request, response }) {
  let filePath = path.join(__dirname, "app/metrics.html");

  logger.log("Fetching metrics", {
    extra: { type: "page", target: "metrics" }
  });

  fs.readFile(filePath, "latin1", function(error, content) {
    if (error) {
      writeJSONResponse(response, HTTP_STATUS.BAD_REQUEST, {
        error: "Server-side rendering error."
      });
    } else {
      logger.log("Fetching logs", { extra: { type: "fetch", target: "logs" } });

      let body = "🚨 Empty analysis logs.";
      let counter = {
        error: 0,
        info: {}
      };

      fetchLogs()
        .then(content => {
          if (content) {
            try {
              body = content
                .split("\n")
                .reverse()
                .map(row => {
                  try {
                    const log = JSON.parse(row.trim());

                    if (log.level === "info") {
                      if (counter.info[log.message] === undefined)
                        counter.info[log.message] = 0;

                      counter.info[log.message] += 1;
                      if (log.message == "Returning homepage.")
                        console.log(counter.info[log.message], "ALO");
                    } else if (log.level === "error") counter.error++;
                    else counter[log.level] = log;

                    return `
                    <div class="row">
                      <span class="label" data-type="${
                        typy(log.level).safeString
                      }">${typy(log.level).safeString} • <span>${dayjs(
                      log.timestamp
                    ).fromNow()}</span> </span>
                      <div class="content">
                        <p>${log.message}</p>
                        <span></span>
                      </div>
                    </div>
                    `;
                  } catch (e) {
                    return escape(row);
                  }
                })
                .join("");
            } catch (e) {
              body = content;
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          logger.log("Returning metrics.", { extra: { type: "page" } });

          console.log(counter);

          const header = `<div class="grid">
            <div class="box">
              <p>${typy(counter.error).safeNumber} errors</p>
            </div>
            <div class="box">
              <p>${
                typy(counter.info["Listening on http://localhost:1234"])
                  .safeNumber
              } server inits</p>
            </div>
            <div class="box">
            <p>${
              typy(counter.info["Fetching metrics"]).safeNumber
            } requests for metrics</p>
          </div>

          <div class="box">
          <p>${
            typy(counter.info["Returning homepage."]).safeNumber
          } requests for homepage</p>
        </div>
          </div>`;

          body = header + body;
          writeHTMLResponse(
            response,
            HTTP_STATUS.OK,
            content.replace("${body}", body)
          );
        });
    }
  });
}

function writeHTMLResponse(res, code, result) {
  res.writeHead(code, { "Content-Type": "text/html" });
  res.write(result);
  res.end();
}

function writeJSONResponse(res, code, result) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.write(JSON.stringify(result));
  res.end();
}

function writeLocalPDF(response, url) {
  console.log("static");

  let filePath = path.join(__dirname, url);

  const file = fs.readFileSync(filePath);
  response.writeHead(200, { "Content-Type": "application/pdf" });
  response.end(file, "binary");
}
