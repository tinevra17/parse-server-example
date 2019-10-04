// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var Parse = require('parse/node');

Parse.initialize("constructionID");
//javascriptKey is required only if you have it on server.

Parse.serverURL = 'http://tinevra.herokuapp.com/parse'


// const User = Parse.Object.extend("User");
// const user = new GameScore();

// user.set("username", "");
// user.set("pasword", "Sean Plott");
// user.set("email", "false");
// user.set("persmission", 0);

// user.save()
// .then((user) => {
//   // Execute any logic that should take place after the object is saved.
//   alert('New object created with objectId: ' + user.id);
// }, (error) => {
//   // Execute any logic that should take place if the save fails.
//   // error is a Parse.Error with an error code and message.
//   alert('Failed to create new object, with error code: ' + error.message);
// });






// app.use('/parse', api);

// var port = 1337;
// app.listen(port, function() {
//     console.log('parse-server running on port ' + port);
// });



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
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
