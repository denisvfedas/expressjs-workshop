'use strict'
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use((req, res, next) => {
  next();
});

app.use(bodyParser.urlencoded({extended: true}));//

app.set('view engine', 'pug');//use pug template

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/hello', (req, res) => {
  if(req.query.name) {
    console.log(req.query);
    res.send("<h1>Hello " + req.query.name + "</h1>");
  }
  else {
    res.send('<h1>Hello World!</h1>');
  }
});

app.get('/calculator/:operation', (request, result) => {
  var operation = request.params.operation;
  var firstOperand = Number(request.query.num1);
  var secondOperand = Number(request.query.num2);
  //var result = req.query.result;
  
    if(operation === 'add') {
     result.send(
       {
         'operation' : operation,
         'firstOperand': firstOperand,
         'secondOperand': secondOperand,
         'result': firstOperand + secondOperand
        }
       );
    }
    else if(operation === 'multiply') {
      result.send(
        {
         'operation' : operation,
         'firstOperand': firstOperand,
         'secondOperand': secondOperand,
         'result': firstOperand * secondOperand
        }
      );
    }
    else {
      result.status(400);
    }

});

/////////////////////////////////////////////////////////////////////////////
//Exercise 4: Retrieving data from our database

// load the mysql library
var mysql = require('promise-mysql');

// create a connection to our Cloud9 server
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'denisvfedas', 
    password : '',
    database: 'reddit',
    connectionLimit: 10
});

// load our API and pass it the connection
var RedditAPI = require('./reddit');

var myReddit = new RedditAPI(connection);



app.get('/posts', (req, res) => {
   myReddit.getAllPosts()
    .then(posts => {
      res.render('post-list', {posts: posts});
      //   var htmlString = `
      //     <div id = "posts">
      //       <h1>List of post</h1>
      //       <ul class = post-list>
      //         ${posts.map(post => {
      //           return `
      //           <li class = post-item>
      //           <h2 class = post-item_${post.posts_title}>
      //             <a href = 'html://${post.posts_url}/'>${post.posts_title}</a>
      //           </h2>
      //           <p>Created by ${post.user.users_username}</p>
      //         </li>`;
      //         }).join("")}
      //       </ul>
      //     </div>`;

      // res.send(htmlString);
    });
});
  
/////////////////////////////////////////
//Exercise 5: Creating a "new post" HTML form

app.get('/new-post', (req, res) => {
  res.send(
    `<form action="/createPost" method="POST">
      <p>
        <input type="text" name="url" placeholder="Enter a URL to content">
      </p>
      <p>
        <input type="text" name="title" placeholder="Enter the title of your content">
      </p>
      <button type="submit">Create!</button>
    </form>`
    );
});


////////////////////////////////////////
//Exercise 6: Receiving data from our form
/*use the createPost function from RedditAPI to create a new post that has the 
URL and Title passed to you in the HTTP request. Since you don't have a user 
system yet, set the userId to 1 when you call createPost.*/

app.post('/createPost', (req, res) => {
  myReddit.createPost({
    userID: 1,
    title: req.body.title,
    url: req.body.url,
    subredditId: 1
  }).then(result => {
    res.redirect('posts');
  });
});

///////////////////////////////////////////
//Exercise 7: Using a template engine

app.get('/createContent', (req, res) => {
  res.render('create-content');
});


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});





