const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('node:path');
// const { Server } = require("socket.io");
// const io = new Server(server);

let applicationStatus = {
    "status": "Applied Successfully<br>",
    "link": "<a href=\"../index.html\">Go to Home</a>"
}

mongoose.connect('mongodb://127.0.0.1:27017/project');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connection Successful');
})
var userresp = new mongoose.Schema({
    email: String,
    password: String
});
var user = mongoose.model('user', userresp);

var subscriberresp = new mongoose.Schema({
    email: String
})
var subscriber = mongoose.model('subscriber', subscriberresp)

var jobseekerresp = new mongoose.Schema({
    keywords: String,
    location: String,
    jobrole: String
})
var jobseeker = mongoose.model('jobseeker', jobseekerresp)

var applicationresp = new mongoose.Schema({
    name: String,
    age: Number,
    qualification: String,
    degree: String,
    resume: String
})
var application = mongoose.model('application', applicationresp)

const hostname = '127.0.0.1';
const port = 3000;


app.get('/',(req,res)=>{
    let p = path.join(__dirname,'public','html')
    res.sendFile(p+'/login.html')
})

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/apply', (req, res) => {
    let p = path.join(__dirname, 'public', 'html')
    res.sendFile(p + '/jobApplication.html')
})

app.post('/', (req, res) => {
    let p = path.join(__dirname, 'public')
    res.sendFile(p + '/index.html')
})
app.post('/findjob', (req, res) => {
    let mydata = new jobseeker(req.body);
    mydata.save().then(() => {

        res.send('ok')

    }).catch(() => {
        res.send('not ok')

    })

})

var subscribeStatus={}
app.post('/subscribe', (req, res) => {
    let mydata = new subscriber(req.body);
    mydata.save().then(() => {
        subscribeStatus ={
            "status":"Subscribed!"
        }
        let p = path.join(__dirname,'public')
        res.sendFile(p+'/index.html')
    }).catch(() => {
        subscribeStatus ={
            "status":"Oops! Something went wrong. Please try again."
        }
        let p = path.join(__dirname,'public')
        res.sendFile(p+'/index.html')

    })

})
app.post('/application', (req, res) => {

    let mydata = new application(req.body);
    mydata.save().then(()=>{

        let p = path.join(__dirname, 'public', 'html')
        res.sendFile(p + '/jobApplication.html')
    }).catch()
})
app.get('/api', (req, res) => {

    res.json(applicationStatus)
})

app.get('/api/subscribed',(req,res)=>{
    res.json(subscribeStatus)
    // console.log(subscribeStatus.status)
})
app.get('/api/signup',(req,res)=>{
    res.json(signupStatus)
    // console.log(subscribeStatus.status)
})
let signupStatus = {}
app.post('/signup',(req, res)=>{
    let mydata = new user(req.body)
    mydata.save().then(() => {
        let p = path.join(__dirname,'public','html')
        res.sendFile(p+'/login.html')
    }).catch(() => {
        signupStatus = {
            "status":"Oops! Something went wrong!! Please try again later!!!"
        }
        res.json(signupStatus)
    })
    
})

app.post('/login',async (req, res)=>{

    try {
        let check = await user.findOne({ email: req.body.email })
        if (check.password === req.body.password) {
            let p = path.join(__dirname,'public')
            res.sendFile(p+'/'+'index.html')
        }
        else {
            let p = path.join(__dirname,'public','html')
            res.sendFile(p+'/'+'login.html')
            
        }
    }
    catch{
        let p = path.join(__dirname,'public','html')
            res.sendFile(p+'/'+'login.html')
    }

})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});