// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var Parse = require('parse/node');

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

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
<<<<<<< HEAD
app.get('/test', function(req, res) {
  var obj = new Parse.Object('GameScore');
  obj.set('score',1337);
  obj.save().then(function(obj) {
  console.log(obj.toJSON());
  var query = new Parse.Query('GameScore');
  query.get(obj.id).then(function(objAgain) {
    //console.log(objAgain.toJSON());
    res.send(objAgain);
  }, function(err) {console.log(err); });
  }, function(err) { console.log(err); });
});

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

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
=======
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
  
  user.set("name", "Daniel Maynez");
  user.set("username", "daniel123");
  user.set("email", "danielMay@miners.utep.edu");
  user.set("password", "daniel");
  user.set("access",0);
  
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



>>>>>>> master
});




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


app.listen(3000, () => console.log('express server is running at port # 3000'));

// This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);
