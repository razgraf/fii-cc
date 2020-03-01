const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const urllib = require("url");
const { t: typy } = require("typy");

module.exports.fetchMovie = ({ title }) => {
  const endpoint = `http://www.omdbapi.com/?apikey=${process.env.API_KEY_OMDB}&t=${title}`;

  return fetch(endpoint)
    .then(res => res.json())
    .then(res => {
      if (res.Response === "True") return res;
      throw new Error("Movie title doesn't match any movies.");
    });
};

module.exports.fetchNews = ({ title }) => {
  const format = `Movie ${title}`;
  const endpoint = `http://newsapi.org/v2/everything?apiKey=${process.env.API_KEY_NEWS}&q=${format}&sortBy=popularity&pageSize=1`;

  return fetch(endpoint)
    .then(res => res.json())
    .then(res => {
      if (res.status === "ok") {
        if (typy(res, "articles[0]").isFalsy)
          throw new Error("Movie title doesn't have any news for it.");
        else return typy(res, "articles[0]").safeObject;
      }
      throw new Error("Movie title doesn't have any news for it.");
    });
};

module.exports.fetchPDF = ({ title, movie, news }) => {
  const html = `
    <h1 color="blue">${title}</h1>
    <h3>About</h3>
    <ul style="font-size: 10pt; line-height: 2">
        ${Object.keys(movie)
          .filter(key => typeof movie[key] === "string")
          .map(key => `<li><b>${escape(key)}:</b> ${escape(movie[key])}</li>`)
          .join("")}
    </ul>
    <h3>In the news</h3>
    <ul style="font-size: 10pt; line-height: 2">
    ${Object.keys(news)
      .filter(
        key =>
          typeof news[key] === "string" &&
          ["author", "title", "description", "content"].includes(key)
      )
      .map(key => `<li><b>${escape(key)}:</b>${news[key]}</li>`)
      .join("")}
    </ul>
 `;

  console.log(html);

  const endpoint = new urllib.URL(
    `https://api.html2pdf.app/v1/generate?apiKey=${process.env.API_KEY_HTML2PDF}&html=${html}`
  );

  const name = `file/${title
    .replace(/[^a-zA-Z ]/g, "")
    .replace(" ", "")}-${Date.now()}.pdf`;

  return fetch(endpoint).then(res => {
    const fileStream = fs.createWriteStream(name);

    return new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", err => {
        reject(err);
      });
      fileStream.on("finish", function() {
        resolve(name);
      });
    });
  });
};

module.exports.fetchLogs = () => {
  let filePath = path.join(__dirname, "/analysis.log");
  console.log(filePath);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "latin1", function(error, content) {
      if (error) {
        reject();
      } else {
        resolve(content);
      }
    });
  });
};
