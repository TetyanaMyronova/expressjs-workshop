var express = require('express');
var app = express();

app.get('/hello', function(req, res) {
  if (req.query.name === "Jhon") {
    res.send("<h1>Hello Jhon!</h1>")
  }
    else {
    res.send(`<h1>Hello World!</h1>`);
  }
});

app.get('/calculator/:operation', function(req, res) {
  var value1 = parseInt(req.query.num1);
  var value2 = parseInt(req.query.num2);

  if ((req.query.num1 === undefined) || ((req.query.num1 === ''))) {value1 = 0};
  if ((req.query.num2 === undefined) || ((req.query.num2 === ''))) {value2 = 0};
  
  var solution;
    switch(req.params.operation) {
    case 'add':
      solution = value1 + value2;
      break;
    case 'multiply':
      solution = value1 * value2;
      break;
    default:
      res.end("400 Bad Request");
  };
    
    var solutionObject = {
      operation: req.params.operation,
      firstOperand: req.query.num1,
      secondOperand: req.query.num2,
      solution: solution
    };
    
    res.end(JSON.stringify(solutionObject, null, 2));

  // if (req.params.operation === 'add') {

  //   var sum = value1 + value2;

  //   res.setHeader('200', 'Success');
  //   res.end(`{
  //     "operation": "add",
  //     "firstOperand": ${value1},
  //     "secondOperand": ${value2},
  //     "solution": ${sum}
  //   }`);
  // }
  // if (req.params.operation === 'multiply') {

  //   var multiply = value1 * value2;

  //   res.setHeader('200', 'Success');
  //   res.end(`{
  //     "operation": "multiply",
  //     "firstOperand": ${value1},
  //     "secondOperand": ${value2},
  //     "solution": ${multiply}
  //   }`);
  // }
  // else {
  //   res.status(400).send('Bad request!');
  // }
});


//example of listening http://decodemtl-tamyr.c9users.io/
app.listen(7777);



/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
