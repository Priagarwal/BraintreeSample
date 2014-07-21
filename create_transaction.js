var braintree = require("braintree");
var express = require("express");
//var bodyParser = require('body-parser');
var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "sqkk4drs7c64y9wk",
  publicKey: "n2sgvym6bvksxgsm",
  privateKey: "75ce58a4b3224ce103b3e20bbbc635da"
});

app.get("/", function (req, res) {
  res.render("get_paid.ejs");
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

console.log(saleRequest);
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
/*
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
      res.send(
        "<h1>Customer created with name: " + result.customer.firstName + " " + result.customer.lastName + "</h1>" +
         "<a href=\"/subscriptions?id=" + result.customer.id + "\">Click here to sign this Customer up for a recurring payment</a>"
      );
    } else {
      res.send("<h1>Error: " + result.message + "</h1>");
    }
  });
});
*/
app.get("/subscriptions", function (req, res) {
  //var customerId = req.query.id;
   var customerId = "c1";
  gateway.customer.find(customerId, function (err, customer) {
    if (err) {
        res.send("<h1>No customer found for id: " + req.query.id + "</h1>");
    } else {
      var subscriptionRequest = {
        paymentMethodToken: customer.creditCards[0].token,
        planId: "p1"
      };

      gateway.subscription.create(subscriptionRequest, function (err, result) {
		console.log(result);
        res.send("<h1>Subscription Status " + result.subscription.status + "</h1>");
	});
    }
  });
});

app.listen(3000);