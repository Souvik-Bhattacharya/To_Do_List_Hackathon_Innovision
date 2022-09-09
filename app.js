const express = require('express');
const path = require('path');
const app = express();
var bodyParser = require('body-parser');
const port = process.env.PORT || 80;
const { stringify } = require('querystring');
const mongoose = require('mongoose');
const url = process.env.MONGODB;
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true});

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error...'));
db.once('open',function() {
    console.log("MongoDB connected...")    
});

var taskSchema = new mongoose.Schema({name:'string',time:'string'});
var task = mongoose.model('task',taskSchema);

app.use('/static',express.static('static'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded());

app.get('/',(req,res)=>{
    task.find({},function(error,d){
        res.status(200).render('body.ejs',{newTask:d});
    });
});

app.post('/',(req,res)=>{
    const nt = req.body.taskName;
    let T = new Date();
    let t = ' @ ' + T
    console.log(t);
    const item = new task({
    name: nt,
    time: t,
    });
    item.save();
    res.redirect('/');
});

app.post('/delete',function(req,res){
    const t = req.body.del;
    task.findByIdAndRemove(t,function(error){
        if(!error){
            console.log('Deleted...');
            res.redirect('/');
        }
    });
});

// app.post('/update',function(req,res){
//     const n = req.body.update;
//     console.log(n);
//     let r = req.body.real;
//     console.log(r);
//     task.updateOne({name:r},{$set:{name:n}});
//     res.redirect('/');
// });

app.listen(port,()=>{
    console.log(`started on port ${port}`);
});