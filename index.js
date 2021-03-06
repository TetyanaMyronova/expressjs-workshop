'use strict';

var express = require('express');
var RedditAPI = require('../reddit-nodejs-api/reddit');
var request = require('request-promise');
var mysql = require('promise-mysql');
var bodyParser = require('body-parser');
var pug = require('pug');
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'pug');

app.use('/files', express.static('static_files'));

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
  var op = req.params.operation;
  
  var solution;
    switch(req.params.operation) {
    case 'add':
      solution = value1 + value2;
      break;
    case 'multiply':
      solution = value1 * value2;
      break;
    default:
      //res.end("400 Bad Request");
      res.status(400).json({error: "Operation must be add or multiply"})
      return;//important
  };
    
    var solutionObject = {
      operation: req.params.operation,
      firstOperand: +req.query.num1,
      secondOperand: +req.query.num2,
      solution: solution
      //solution: req.params.operation === 'add' ? req.query.num1 + req.query.num2 : req.query.num1 * req.query.num2
    };
    
    res.end(JSON.stringify(solutionObject, null, 2));
    // another way to send a JSON response
    //res.json(response);
});

//Get all posts (create a connection)
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
  //get all posts and create a new li per each post
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
    response.send(myHTMLString);
  });
});

app.get('/post-list', function (request, response) {
  var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: 'reddit',
    connectionLimit: 10
  });
  var myReddit = new RedditAPI(connection);
  myReddit.getAllPosts()
  .then(posts => {
    response.render('post-list', {posts: posts});
  });
});

//Exercise 5: Creating a "new post" HTML form
app.get('/new-post', function(request, response) {
  var formHTML = `<!DOCTYPE html>
  <form action="/createPost" method="POST"><!-- why does it say method="POST" ?? -->
    <p>
      <input type="text" name="url" placeholder="Enter a URL to content">
    </p>
    <p>
      <input type="text" name="title" placeholder="Enter the title of your content">
    </p>
    <button type="submit">Create!</button>
  </form>`;
  response.send(formHTML);
});

app.get('/createContent', function(request, response) {
  response.render('create-content');
});

app.post('/createPost', urlencodedParser, function(request, response) {
  if (request.body) {
    var connection = mysql.createPool({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database: 'reddit',
      connectionLimit: 10
    });

    // create a RedditAPI object. we will use it to insert new data
    var myReddit = new RedditAPI(connection);
    var myPost = {
      subredditId: 15,
      userId: 1,
      title: request.body.title,
      url: request.body.url
    };
   myReddit.createPost(myPost)
    .then(response.redirect('/posts'));
  }
});


//example of listening http://decodemtl-tamyr.c9users.io/
app.listen(7777);



/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
