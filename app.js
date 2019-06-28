const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose');

//connect to db
var mongodbUri ="mongodb+srv://todo:Todo123321@todo-awncc.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  auth: {
    user: 'todo',
    password: 'Todo123321'
  }
})
var conn = mongoose.connection;    
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', () =>{
 console.log('connected to mongo database')                       
});

//create Todo schema
var TodoSchema = mongoose.Schema({
  // _id: mongoose.Types.ObjectId,
  _id: mongoose.Schema.Types.ObjectId,
  title : String ,
  completed: Boolean 
});

var TodoModel = mongoose.model('Todo', TodoSchema)

// //create a testing object
// var todo1 = new TodoModel({
//   _id: new mongoose.Types.ObjectId(),
//   title: 'sht',
//   completed: true
// })

// todo1.save()
//    .then(doc => {
//      console.log(doc)
//    })
//    .catch(err => {
//      console.error(err)
//    })

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())

app.get('/posts', (req, res) => {
  // console.log(TodoModel.find())
  // TodoModel.find()
    	// {
		   //    id: 1,
		   //    title: "Japan",
		   //    completed: false
    	// },
    	// {
		   //    id: 2,
		   //    title: "Travel",
		   //    completed: false
    	// }
    TodoModel.find()
    	.exec()
    	.then(docs => {
    		//console.log(docs)
    		res.status(200).json(docs);
    	})
    	.catch(err => {
    		console.log(err)
    		res.status(500).json({
    			error: err
    		})
    	})
})

app.post('/posts', (req, res) => {
  // const todo ={
  // 	title: req.body.title,
  // 	completed: req.body.completed
  // }

  const todo = new TodoModel({
  _id: new mongoose.Types.ObjectId(),
  title: req.body.title,
  completed: req.body.completed
	})

  todo.save()
   .then(doc => {
     res.json( 
  	 todo
  )
   })
   .catch(err => {
     console.error(err)
   })

  // res.status(201).json({ 
  // 	 todo
  // })
  // console.log(req.body)
  // res.send(req.body)
})

app.delete('/posts/:id', (req, res) => {
    // var deleteTodo = req.params.id
    var ObjectId = require('mongodb').ObjectID;
    TodoModel.remove({_id: req.params.id})
    	.exec()
    	.then(docs => {
    		//console.log(docs)
    		res.status(200).json(docs);
    	})
    	.catch(err => {
    		console.log(err)
    		res.status(500).json({
    			error: err
    		})
    	})
})

//update PUT
app.put('/posts/put/:id', (req, res) => {
    // var deleteTodo = req.params.id
    var ObjectId = require('mongodb').ObjectID;
    TodoModel.findOne({_id: req.params.id}, function(err, todo){
    	todo.completed = !todo.completed;
    	todo.save()
    })
    	// .exec()
    	// .then(docs => {
    	// 	//console.log(docs)
    	// 	res.status(200).json(docs);
    	// })
    	// .catch(err => {
    	// 	console.log(err)
    	// 	res.status(500).json({
    	// 		error: err
    	// 	})
    	// })
})

app.listen(process.env.PORT || 8081)