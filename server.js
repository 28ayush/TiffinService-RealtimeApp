require('dotenv').config();
const express=require('express');
const app=express();
const bodyParser = require('body-parser')
const ejs=require('ejs');
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const fs=require('fs');
const PORT=process.env.PORT || 3000;
const mongoose=require('mongoose');
const session =require('express-session');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo');
const passport= require('passport');
//database connection

const url='mongodb://localhost:27017/pizza';

const main=async ()=>{
    await mongoose.connect(url);
    console.log("connected...");
}
main(); 
 

//set template
app.set('view engine','ejs');
app.set('views',path.join(__dirname+'/resources/views'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:MongoDbStore.create({
        mongoUrl:url
    }),
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} //24hrs
}))
//passport config
const passportInit=require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())

//global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;
    next();
})
app.use(flash());
//assests
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(expressLayouts);
require('./routes/web')(app);


app.listen(3000,()=>{
    console.log(`Listening on Port ${PORT}`);
});