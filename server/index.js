const { google } = require("googleapis");
const { smarthome } = require("actions-on-google");
const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();

const jwt = require("./key.json");

const app = express();
const port = 3000;

app.listen(port, () => console.log(`Listening on  http://localhost:${port}`));

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// https://github.com/googleapis/google-api-nodejs-client
// create oAuth credentials in google developer console and place in .env

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

const url = oauth2Client.generateAuthUrl({
  scope: scopes,
});

// TODO redirect client to this url on login
console.log(url);

app.post(`/code`, (req, res) => {
  // get tokens
  oauth2Client
    .getToken(req.body.code)
    .then(({ tokens }) => {
      oauth2Client.setCredentials(tokens);
    })
    .then(() => doRequestSync())
    .catch((err) => console.log(err));

  // Access tokens expire. This library will automatically use a refresh token to obtain a new access token if it is about to expire. An easy way to make sure you always store the most recent tokens is to use the tokens event:

  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      console.log("refresh token", tokens.refresh_token);
    }
    console.log("access token", tokens.access_token);
  });
});

const mySmarthome = smarthome({
  debug: true,
  jwt,
  key: process.env.CLIENT_SECRET,
});

// Register handlers for Smart Home intents

function doRequestSync() {
  console.log("request sync");

  // TODO
}

mySmarthome.onExecute((body, headers) => {
  console.log("onExecute");
});

mySmarthome.onQuery((body, headers) => {
  console.log("onQuery");
});

mySmarthome.onSync((body, headers) => {
  console.log("onSync");
});
