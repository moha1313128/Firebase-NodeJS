const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

// Routes
app.get("/", (req, res) => {
  return res.status(200).send("Hello World");
});

// Export api to firebase cloud functions
exports.app = functions.https.onRequest(app);
