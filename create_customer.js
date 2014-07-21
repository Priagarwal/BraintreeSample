var braintree = require("braintree");
var express = require("express");
var app = express();

app.use(express.bodyParser());

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "sqkk4drs7c64y9wk",
  publicKey: "n2sgvym6bvksxgsm",
  privateKey: "75ce58a4b3224ce103b3e20bbbc635da"
});

app.get("/", function (req, res) {
  res.render("customer.ejs");
});

app.post("/create_transaction", function (req, res) {
  var saleRequest = {
    amount: "1000.00",
    creditCard: {
      number: req.body.number,
      cvv: req.body.cvv,
      expirationMonth: req.body.month,
      expirationYear: req.body.year
    },
    options: {
      submitForSettlement: true
    }
  };

  gateway.transaction.sale(saleRequest, function (err, result) {
    if (result.success) {
      res.send("<h1>Success! Transaction ID: " + result.transaction.id + "</h1>");
    } else {
      res.send("<h1>Error:  " + result.message + "</h1>");
    }
  });
});

app.post("/create_customer", function (req, res) {
  var customerRequest = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    creditCard: {
      number: req.body.number,
      cvv: req.body.cvv,
      expirationMonth: req.body.month,
      expirationYear: req.body.year,
      billingAddress: {
        postalCode: req.body.postal_code
      }
    }
  };

  gateway.customer.create(customerRequest, function (err, result) {
    if (result.success) {
      res.send("<h1>Customer created with name: " + result.customer.firstName + " " + result.customer.lastName + "</h1>");
    } else {
      res.send("<h1>Error: " + result.message + "</h1>");
    }
  });
});

app.listen(3000);