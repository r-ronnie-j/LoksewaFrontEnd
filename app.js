let express = require('express');
let session = require('express-session'); 
require("dotenv").config();
let mongoose= require('mongoose');
let MongoStore =  require('connect-mongo');

const app = express();

mongoose.connect("mongodb://localhost:27017/Loksewa",(er)=>{
    console.log("connection to the database has been made");
})

app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));


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