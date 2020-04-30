const insights = require("applicationinsights");
insights.setup(process.env.INSIGHTS_KEY).start();
let client = insights.defaultClient;

module.exports.client = client;
