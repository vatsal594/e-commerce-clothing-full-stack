const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "add here",
  client_secret: "add here",
});

module.exports = paypal;
