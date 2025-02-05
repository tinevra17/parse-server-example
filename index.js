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
// app.get('/test', function(req, res) {
//   var obj = new Parse.Object('GameScore');
//   obj.set('score',1337);
//   obj.save().then(function(obj) {
//   console.log(obj.toJSON());
//   var query = new Parse.Query('GameScore');
//   query.get(obj.id).then(function(objAgain) {
//     //console.log(objAgain.toJSON());
//     res.send(objAgain);
//   }, function(err) {console.log(err); });
//   }, function(err) { console.log(err); });
// });


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

//Create a new user and returns a 1 if it is successful
//otherwise returns -1
app.get('/users/:name/:username/:email/:password/:access', function (req, res) {
  var Users = new Parse.Query("Users");
  var newUser = new Parse.Object('Users');

  var name = req.params.name;
  var username = req.params.username;
  var email = req.params.email;
  var password = req.params.password;
  var access = parseInt(req.params.access, 10);

  newUser.set('name', name);
  newUser.set('username', username);
  newUser.set('email', email);
  newUser.set('password',password);
  newUser.set('access', access);

  newUser.save()
  .then((newUserObj) => {
    // Execute any logic that should take place after the object is saved.
    res.status(200).send("1");
  }, (newUserObj) => {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    res.status(200).send("-1");
  });
  
});

// Create a new ticket using all the info needed. Return an id if successful
// returns a -1 otherwise
app.get('/tickets/:title/:status/:priority/:severity/:assignedTo/:description/:solution/:date/:client', function (req, res) {
  var Tickets = new Parse.Query("Tickets");
  var ticket = new Parse.Object('Tickets');

  var ticketObj = req.params;

  var title = ticketObj.title;
  var status = ticketObj.status;
  var priority = ticketObj.priority;
  var severity = ticketObj.severity;
  var assignedTo = ticketObj.assignedTo;
  var description = ticketObj.description;
  var solution = ticketObj.solution;
  var date = ticketObj.date;
  var dateEnd = "-1";
  var client = ticketObj.client;

  ticket.set("title", title);
  ticket.set("status", status);
  ticket.set("priority", priority);
  ticket.set("severity", severity);
  ticket.set("assignedTo", assignedTo);
  ticket.set("description", description);
  ticket.set("solution", solution);
  ticket.set("date", date);
  ticket.set("dateEnd", dateEnd);
  ticket.set("client", client);
  ticket.set("is_someone_using_ticket", false);

  ticket.save()
  .then((ticket) => {
    // Execute any logic that should take place after the object is saved.
    var id = ticket.id
    res.status(200).send(id);
  }, (ticket) => {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    res.status(200).send("-1");
  });
  
});

// Edit an existing ticket using all the info needed plus the id. Return a 1 if successful
// returns a -1 otherwise
app.get('/update-tickets/:id/:title/:status/:priority/:severity/:assignedTo/:description/:solution/:date/:dateEnd/:client', function (req, res) {
  var Tickets = Parse.Object.extend("Tickets");
  var ticketsQuery = new Parse.Query(Tickets);
  ticketsQuery.get(req.params.id)
  .then((ticket) => {
    // The object was retrieved successfully.
    var ticketObj = req.params;

    var title = ticketObj.title;
    var status = ticketObj.status;
    var priority = ticketObj.priority;
    var severity = ticketObj.severity;
    var assignedTo = ticketObj.assignedTo;
    var description = ticketObj.description;
    var solution = ticketObj.solution;
    var date = ticketObj.date;
    var dateEnd = ticketObj.dateEnd;
    var client = ticketObj.client;

    ticket.set("title", title);
    ticket.set("status", status);
    ticket.set("priority", priority);
    ticket.set("severity", severity);
    ticket.set("assignedTo", assignedTo);
    ticket.set("description", description);
    ticket.set("solution", solution);
    ticket.set("date", date);
    ticket.set("dateEnd", dateEnd);
    ticket.set("client", client);

    ticket.save()
    .then((newUserObj) => {
      // Execute any logic that should take place after the object is saved.
      var id = newUserObj.id;
      res.status(200).send(id);
    }, (newUserObj) => {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      res.status(200).send("-2");
    });

  }, (error) => {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
    res.send("-1")
  });

});

// Toggle for is_someone_using_ticket. If it is true make it false
// If it is false make it true
app.get('/ticket-toggle-open/:id', function (req, res) {
  var Tickets = Parse.Object.extend("Tickets");
  var ticketsQuery = new Parse.Query(Tickets);
  ticketsQuery.get(req.params.id)
  .then((ticket) => {
    // The object was retrieved successfully.
    var ticket_in_use = ticket.get("is_someone_using_ticket");

    // Toggle the bool
    if(ticket_in_use){
      ticket_in_use = false;
    } else{
      ticket_in_use = true;
    }

    ticket.set("is_someone_using_ticket", ticket_in_use);

    ticket.save()
    .then((newUserObj) => {
      // Execute any logic that should take place after the object is saved.
      res.status(200).send("1");
    }, (newUserObj) => {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      res.status(200).send("-2");
    });

  }, (error) => {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
    res.send("-1")
  });

});

// Check ticket for is_someone_using_ticket. 
// Return it's value
app.get('/ticket-check-if-open/:id', function (req, res) {
  var Tickets = Parse.Object.extend("Tickets");
  var ticketsQuery = new Parse.Query(Tickets);
  ticketsQuery.get(req.params.id)
  .then((ticket) => {
    // The object was retrieved successfully.
    var ticket_in_use = ticket.get("is_someone_using_ticket");
    // Return the bool
    res.status(200).send(ticket_in_use);
  }, (error) => {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
    res.send("-1")
  });

});

//returns all the tickets in the DB inside an array 
app.get('/ticketsList', function (req, res) {

  const Tickets = Parse.Object.extend("Tickets");
  const query = new Parse.Query(Tickets);
  var ticketsArr = [];

  query.descending("date").find().then(function(Tickets) {
    //populating the array with all the users 
    Tickets.forEach(ticket => {
      ticketsArr.push(ticket)
    });
    res.send(ticketsArr);
  })
  .catch(function(error) {
    res.send(error)
  });  
})

//returns all the tickets in the DB inside an array based off the status
app.get('/ticketsList-status/:status', function (req, res) {

  const Tickets = Parse.Object.extend("Tickets");
  const query = new Parse.Query(Tickets);
  var ticketsArr = [];

  //Get all the status'
  query.equalTo("status", req.params.status);

  query.descending("date").find().then(function(Tickets) {
    //populating the array with all the users 
    Tickets.forEach(ticket => {
      ticketsArr.push(ticket)
    });
    res.send(ticketsArr);
  })
  .catch(function(error) {
    res.send(error)
  });
})

//returns all the users in the DB inside an array 
app.get('/usersList', function (req, res) {

  const Users = Parse.Object.extend("Users");
  const query = new Parse.Query(Users);
  var usersArr = [];

  query.find().then(function(users) {
    //populating the array with all the users 
    users.forEach(user => {
      usersArr.push(user.get("name"))
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
