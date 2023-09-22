//require the just installed express app
var express = require('express');
//then we call express
var app = express();
app.set('view engine', 'ejs')

var bodyParser = require("body-parser");
const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

// Configure session management
app.use(session({
  secret: 'your-secret-key', // Change this to a secure secret
  resave: false,
  saveUninitialized: true
}));

// Middleware to initialize session data
app.use(function(req, res, next) {
  if (!req.session.task) {
    req.session.task = [];
  }
  if (!req.session.complete) {
    req.session.complete = [];
  }
  if (!req.session.saved) {
    req.session.saved = [];
  }
  if (!req.session.currentList) {
    req.session.currentList = "Untitled List";
  }
  next();
});

const { MongoClient, ServerApiVersion } = require('mongodb')

const uri = "mongodb+srv://sasisekhar4817:lbS6GlqUXYJozNfN@todo.rzbkz5w.mongodb.net/?retryWrites=true&w=majority";
const _DB = "ToDo"
const _Collection = "Tasks"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', function (req, res) {
  res.render('index', { task: req.session.task, 
                        complete: req.session.complete, 
                        saved: req.session.saved,
                        currentList: req.session.currentList
                      });
});

app.post('/addtask', function (req, res) {

    var newTask = req.body.newtask;
    
    req.session.task.push(newTask);
    
    res.redirect('/');
});

app.get("/completetask", function(req, res) {
    var taskId = req.query.index;
    req.session.complete.push(req.session.task[taskId]);
    req.session.task.splice(taskId, 1);
    res.redirect("/");
});

app.get("/removetask", function(req, res) {
    var taskId = req.query.index;
    req.session.task.splice(taskId, 1);
    res.redirect("/");
});

app.get("/reverttask", function(req, res) {
    var taskId = req.query.index;
    req.session.task.push(req.session.complete[taskId]);
    req.session.complete.splice(taskId, 1);
    res.redirect("/");
});

app.post('/saveas', function (req, res) {

    async function run() {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
  
        var record = await client.db(_DB).collection(_Collection).findOne({name:req.body.name.trim()}, {projection: {_id:1}});

        if(record == null) {
          record = await client.db(_DB).collection(_Collection).insertOne({name:req.body.name.trim(), incomplete:req.session.task, complete:req.session.complete});
        } else {
          record = await client.db(_DB).collection(_Collection).updateOne({name:req.body.name.trim()}, {$set: {incomplete:req.session.task, complete:req.session.complete}});
        }
        
        client.close();

        res.status(200);
        res.end();
      }
      run();
});


app.get('/load', function (req, res) {
  var taskId = req.query.index;
  var taskName;
  if(!isNaN(taskId)){
    taskName = req.session.saved[taskId];
    req.session.currentList = taskName.trim();
  } else {
    taskName = taskId;
    req.session.currentList = taskName.trim();
  }

    async function run() {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
  
        var record = await client.db(_DB).collection(_Collection).findOne({name:taskName}, {projection: {incomplete:1, complete:1}});

        if(record === null) {
          res.status(404);
          res.end();
        } else {
          req.session.task = record.incomplete;
          req.session.complete = record.complete;
          res.redirect("/");
        }

        client.close();

      }
      run();
});

app.get('/delete', function (req, res) {
  var taskId = req.query.index;
  var taskName = req.session.saved[taskId];

    async function run() {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        var record = await client.db(_DB).collection(_Collection).deleteOne({name:taskName});

        client.close();

        res.redirect("/");
      }
      run();
});

app.post('/list', function (req, res) {

  async function run() {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      var records = await client.db(_DB).collection(_Collection).find({}).toArray();

      tempArr = [];

      for(const i of records){
        tempArr.push(i.name);
      }

      req.session.saved = tempArr;

      client.close();

      res.redirect("/");
    }
    run();
});

app.post('/nameEdit', function (req, res) {
  req.session.currentList = req.body.name.trim();
  res.redirect("/");
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.send('<html><body><h1>ERROR</h1></body></html>', 404);
});

//the server is listening on port 3000 for connections
app.listen(80, function () {
  console.log('App listening on port 80')
});