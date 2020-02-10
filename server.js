// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');

const twilioText = require("./apis/twilio");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

<<<<<<< HEAD
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));
=======
// Require API's

>>>>>>> 703e6cc4491fd33054aa159d65171d1c2a8743c5
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Mount all resource routes
// /user/endpoints
// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/userRoutes");
const apiRoutes = require("./routes/apiRoutes");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("routes/userRoutes", usersRoutes(db));
app.use("routes/apiRoutes", apiRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  // twilioText(); UNCOMMENT IF YOU WANT TO TEST WITH REAL #
  res.redirect("order");
});

app.get("/order", (req, res) => {
  res.render("order");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
