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
	res.render("pay_submerchant.ejs");
});

app.post("/pay_submerchant", function (req, res) {
gateway.transaction.sale({
  amount: req.body.amount,
  merchantAccountId: req.body.id,
  creditCard: {
    number: "4111111111111111",
    expirationDate: "12/20",
  },
  options: {
    submitForSettlement: true,
    holdInEscrow: true,
  },
  serviceFeeAmount: "10.00"
}, function (err, result) {
		console.log(result);
		if (result.success) {
      res.send("<h1>Merchant with id: " + req.body.id + " paid amount " + req.body.amount + "</h1>");
    } else {
      res.send("<h1>Error: " + result.message + "</h1>");
    }
});
});






app.listen(3000);