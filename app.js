let express = require('express');
let session = require('express-session'); 
require("dotenv").config();
let mongoose= require('mongoose');
let MongoStore =  require('connect-mongo');

const app = express();


//This portion is to connect to the database
//For now we are just using local server in our local machine
mongoose.connect("mongodb://localhost:27017/Loksewa",(er)=>{
    console.log("connection to the database has been made");
})

app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));

//We are setting the express-session from here 
//This portion of the code is required to set up the session
app.use(session({
    cookie:{
        maxAge:86_400*1000,
        secure:true
    },
    resave:false,
    rolling:true,
    saveUninitialized:false,
    secret:process.env.SESSION_SECRET || "random secret is here",
    store:MongoStore.create({
        mongoUrl:'mongodb://localhost:27017/Loksewa_session',
        autoRemove:'interval',
        autoRemoveInterval:2*24*50,
    })
}))

//All the routes of the app goes here
let chapterRouter = require('./routes/chapterRoute')
app.use('/chapter',chapterRouter)

let questionRoute = require('./routes/questionRoute')
app.use('/question',questionRoute);

let loginRoute = require('./routes/loginRoute');
app.use('/login',loginRoute)

let signupRoute = require('./routes/signupRoute');
app.use('/signup',signupRoute)

let logoutRoute = require('./routes/logoutRoute');
app.use('/logout',logoutRoute);

let editorRoute = require('./routes/editorRoute');
app.use('/editor',editorRoute)

let adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute)

app.listen(process.env.PORT || 8080,()=>{
    console.log("We have started the connection in port",process.env.PORT || 8080);
})