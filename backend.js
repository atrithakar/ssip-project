const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('node:path');

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
app.post('/subscribe', (req, res) => {
    let mydata = new subscriber(req.body);
    mydata.save().then(() => {
        res.send('Subscribed')
    }).catch(() => {
        res.send('something went wrong')

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



app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});