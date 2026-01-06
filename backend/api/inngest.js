const { serve } = require("inngest/express");
const { inngest, functions } = require("../inngest/index.js");

module.exports = serve({
  client: inngest,
  functions: functions,
});
