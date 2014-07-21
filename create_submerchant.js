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
	res.render("submerchant.ejs");
});

app.post("/create_submerchant", function (req, res) {
  var merchantAccountParams = {
  individual: {
	firstName: req.body.first_name,
    lastName: req.body.last_name,
	email: req.body.email,
	phone: req.body.phone,
	dateOfBirth: req.body.dob,
	ssn: req.body.ssn,
	address: {
		streetAddress: req.body.street,
		locality: req.body.locality,
		region: req.body.region,
		postalcode: req.body.postalcode
	}
  },
  funding: {
    destination: braintree.MerchantAccount.FundingDestination.Bank,
	email: req.body.funding_email,
    mobilePhone: "5555555505",
    accountNumber: "1124581321",
    routingNumber: req.body.funding_routing_num
  },
  tosAccepted: true,
  masterMerchantAccountId: "cg86n9ybwx8f8x7z"
  //id: "blueLaddersStore"
  };
  console.log(merchantAccountParams);
  gateway.merchantAccount.create(merchantAccountParams, function (err, result) {
	console.log(result);
	if(result.success) {
		res.send("<h1>Sub Merchant created </h1>");// + result.customer.firstName + " " + result.customer.lastName + "</h1>");
	} else {
		res.send("<h1>Error: " + result.message + "</h1>");
	}
   });
});

app.listen(3000);