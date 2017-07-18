'use strict';

var express = require('express');
var RedditAPI = require('../reddit-nodejs-api/reddit');
var request = require('request-promise');
var mysql = require('promise-mysql');
var app = express();

//Exercises 1,2
app.get('/hello', function(req, res) {
  if (req.query.name === "Jhon") {
    res.send("<h1>Hello Jhon!</h1>")
  }
    else {
    res.send(`<h1>Hello World!</h1>`);
  }
});

//Exercise 3
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
});

app.get('/posts', function(request, response) {
  var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: 'reddit',
    connectionLimit: 10
  });

  // create a RedditAPI object
  var myReddit = new RedditAPI(connection);
  var myHTMLString = `
  <div id="posts">
    <h1>List of posts</h1>
    <ul class="posts-list">
  `;
  myReddit.getAllPosts()
  .then(dbPosts => {
    dbPosts.forEach(post => {
      myHTMLString += `
      <li class="post-item">
      <h2 class="post-item__title">
      <a href=`+ post.url + `>`+ post.title + `</a>
      </h2>
      <p>Created by ` + post.user.name + `</p>
      </li>`;
    });
  })
  .then(result => {
    myHTMLString += `
    </ul>
    </div>`;
    response.end(myHTMLString);
  });
});


//example of listening http://decodemtl-tamyr.c9users.io/
app.listen(7777);



/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
