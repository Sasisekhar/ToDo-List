//require the just installed express app
var express = require('express');
//then we call express
var app = express();
app.set('view engine', 'ejs')

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

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

var task = [];
var complete = [];

app.get('/', function (req, res) {
  res.render('index', { task: task, complete : complete });
});

app.post('/addtask', function (req, res) {

    var newTask = req.body.newtask;
    
    task.push(newTask);
    
    res.redirect('/');
});

app.get("/completetask", function(req, res) {
    var taskId = req.query.index;
    complete.push(task[taskId]);
    task.splice(taskId, 1);
    res.redirect("/");
});

app.get("/removetask", function(req, res) {
    var taskId = req.query.index;
    task.splice(taskId, 1);
    res.redirect("/");
});

app.get("/reverttask", function(req, res) {
    var taskId = req.query.index;
    task.push(complete[taskId]);
    complete.splice(taskId, 1);
    res.redirect("/");
});

app.post('/save', function (req, res) {

    async function run() {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
  
        var record = await client.db(_DB).collection(_Collection).findOne({name:req.body.name}, {projection: {_id:1}});

        if(record == null) {
          console.log("Record doesn't exist");
          record = await client.db(_DB).collection(_Collection).insertOne({name:req.body.name, incomplete:task, complete:complete});
        } else {
          console.log("Record exists!");
          record = await client.db(_DB).collection(_Collection).updateOne({name:req.body.name}, {$set: {incomplete:task, complete:complete}});
        }
        
  
        res.status(200)
        res.end()
      }
      run()
});


app.post('/load', function (req, res) {

    async function run() {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
  
        var record = await client.db(_DB).collection(_Collection).findOne({name:req.body.name}, {projection: {_id:1}});

        if(record == null) {
          console.log("Record doesn't exist");
          res.status(404);
          res.end();
        } else {
          console.log("Record exists!");
          record = await client.db(_DB).collection(_Collection).find({name:req.body.name}).toArray();
          task = record[0].incomplete;
          complete = record[0].complete;
        }
        res.redirect("/");
      }
      run();
});

//the server is listening on port 3000 for connections
app.listen(80, function () {
  console.log('App listening on port 80')
});