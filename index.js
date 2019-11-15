// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var Parse = require('parse/node');
var bodyParser = require('body-parser')

Parse.initialize("constructionID","tinevra");
//javascriptKey is required only if you have it on server.

Parse.serverURL = 'http://tinevra.herokuapp.com/parse'




// var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

// if (!databaseUri) {
//   console.log('DATABASE_URI not specified, falling back to localhost.');
// }

// var api = new ParseServer({
//   databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
//   cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
//   appId: process.env.APP_ID || 'myAppId',
//   masterKey: process.env.MASTER_KEY || 'tinevra', //Add your master key here. Keep it secret!
//   serverURL: process.env.SERVER_URL || 'https://tinevra.herokuapp.com',  // Don't forget to change to https if needed
//   liveQuery: {
//     classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
//   }
// });
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey




var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
// app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/user', function(req, res) {
  res.status(200).send('sam');
});


app.get('/tickets', function(req, res) {
  res.status(200).send('sam');
});


app.post('/tickets', function(req, res) {
  console.log(req.body);
  //res.send(req.body);

  // const ticket = Parse.Object.extend("Tickets");
  // const ticket = new GameScore();

  // ticket.set("score", 1337);
  // ticket.set("playerName", "Sean Plott");
  // ticket.set("cheatMode", false);

  // ticket.save(
  // .then((ticket) => {
  //   // Execute any logic that should take place after the object is saved.
  //   alert('New object created with objectId: ' + ticket.id);
  // }, (error) => {
  //   // Execute any logic that should take place if the save fails.
  //   // error is a Parse.Error with an error code and message.
  //   alert('Failed to create new object, with error code: ' + error.message);
  // });



  res.status(200).send(req.body);
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/testss', function(req, res) {
  // res.sendFile(path.join(__dirname, '/public/test.html'));

  const UserAccount = Parse.Object.extend("UserAccount");
  const query = new Parse.Query(UserAccount);
  query.equalTo("email", "test@email.com");
  // const object = await query.first();

  query.find()
  .then(function(results) {
    res.send(results);
  })
  .catch(function(error) {
    res.send(error)
  });


});

app.get('/userCreationTest', function(req, res) {
  res.send("1")

  const Users = Parse.Object.extend("Users");
  const user = new Users();
  
  user.set("name", "Kenneth Rodriguez");
  user.set("username", "kenneth");
  user.set("email", "kenneth@miners.utep.edu");
  user.set("password", "KennY");
  user.set("access",3);
  
  user.save()
  .then((user) => {
    res.send("2")
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + user.id);
  }, (error) => {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    alert('Failed to create new object, with error code: ' + error.message);
  });

});

app.get('/x', function(req, res) {
res.send("x")



});



//retrives user access level as a String based on username and passoword
//otherwise returns -1
app.get('/users/:username/:password/accesslvl', function (req, res) {
  var usernameQuery = new Parse.Query("Users");
  usernameQuery.equalTo("username", req.params.username);

  var passwordQuery = new Parse.Query("Users");
  passwordQuery.equalTo("password", req.params.password);

  var mainQuery = Parse.Query.and(usernameQuery,passwordQuery);
  mainQuery.find().then(function(user) {
    //gettting the acess level from the user JSON
    var accesslvl = user[0].get("access");
    console.log(typeof x);

    res.send(accesslvl+"");
    // res.sendStatus(status);

  })
  .catch(function(error) {
    res.send(error)
  });
})




//retrives user JSON based on username and password
//otherwise returns -1
app.get('/users/:username/:password', function (req, res) {
  var usernameQuery = new Parse.Query("Users");
  usernameQuery.equalTo("username", req.params.username);

  var passwordQuery = new Parse.Query("Users");
  passwordQuery.equalTo("password", req.params.password);

  var mainQuery = Parse.Query.and(usernameQuery,passwordQuery);
  mainQuery.find().then(function(results) {
    
    if(results.length == 0){
      res.send("-1")
    }
    res.send(results);

  })
  .catch(function(error) {
    res.send(error)
  });
})



//returns all the users ind the DB inside an array 
app.get('/usersList', function (req, res) {

  const Users = Parse.Object.extend("Users");
  const query = new Parse.Query(Users);
  var usersArr = [];

  query.find().then(function(users) {
    //populating the array with all the users 
    users.forEach(user => {
      usersArr.push(user.get("username"))
    });
    res.send(usersArr);
  })
  .catch(function(error) {
    res.send(error)
  });  
})

app.listen(3000, () => console.log('express server is running at port # 3000'));

// This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);
