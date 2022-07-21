//Declare Variables
const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const TodoTask = require("./models/todotask");
require('dotenv').config()

//Set Middleware
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

//Connect to Mongo
mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true }, 
    () => {console.log("Connected to db!");}
)

// GET METHOD
app.get('/', async (req, res) => {
    try {
        TodoTask.find({}, (err, tasks) => {
            console.log(res.render("index.ejs", { todoTasks: tasks }));
        });
    } catch (error) {
        response.status(500).send({message: error.message})
    }
}) 
//Post method 
app.post('/', async (req, res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        });
    try {
        await todoTask.save();
        console.log(todoTask)
        res.redirect("/");
    } catch (err) {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    }
});
//Update Method
app
    .route("/edit/:id")
    .get((req,res)=>{
        const id = req.params.id
        TodoTask.find({}, (err,tasks)=>{
            res.render('edit.ejs',{
                todoTasks:tasks, idTask:id
            })
        })
    .post((req,res)=>{
        const id = req.params.id
        TodoTask.findByIdAndUpdate(
            id,
            {
                title:req.body.title,
                content: req.body.content
            },
            err => {
                if (err) return res.status(500).send(err)
                res.redirect("/")
            }
        )
    })    
})


//Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));