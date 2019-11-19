// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var Parse = require('parse/node');

Parse.initialize("constructionID");
//javascriptKey is required only if you have it on server.

Parse.serverURL = 'http://tinevra.herokuapp.com/parse'




var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'tinevra', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://tinevra.herokuapp.com',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('sam');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
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

app.post('/tickets/ticket', function (req, res) {
  const tickets = Parse.Object.extend("Tickets");
  const tickets = new Tickets();

  //var ticketObj = req.body;

  var ticketObj = '{ "tickets" : [' + 
    '{ "title": "title", ' +
    ' "status": "Open", ' +
    ' "priority": "High", ' +
    ' "serverity": "Critical", ' +
    ' "assigned_to": "Daniel", ' +
    ' "description": "Seems like my computer is not working. Halp", ' +
    ' "solution": "Banged on the computer for a bit", ' +
    ' "date": "01/01/1991", ' +
    ' "client": "Person1" }' +
  '] }';

  var title = ticketObj.title;
  var status = ticketObj.status;
  var priority = ticketObj.priority;
  var serverity = ticketObj.serverity;
  var assigned_to = ticketObj.assigned_to;
  var description = ticketObj.description;
  var solution = ticketObj.solution;
  var date = ticketObj.date;
  var client = ticketObj.client;

  userProfile.set("title", title);
  userProfile.set("status", status);
  userProfile.set("priority", priority);
  userProfile.set("serverity", serverity);
  userProfile.set("assigned_to", assigned_to);
  userProfile.set("description", description);
  userProfile.set("solution", solution);
  userProfile.set("date", date);
  userProfile.set("client", client);

  tickets.save();
  .then((userProfile) => {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + tickets.id);
    //res.status(200).send(userProfile.name);
  }, (userProfile) => {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    alert('Failed to create new object, with error code: ' + error.message);
  });
  //res.status(200).send('sam');
  
});

//returns all the users in the DB inside an array 
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

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
