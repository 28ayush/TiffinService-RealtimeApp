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
//database connection
const url=process.env.MONGO_URL;

const main=async ()=>{
    try {
        const conn = await mongoose.connect(url);
        console.log(`Mongo db connected`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
main(); 
const session =require('express-session');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo');
const passport= require('passport');
const Emitter=require('events');

 

//set template
app.set('view engine','ejs');
app.set('views',path.join(__dirname+'/resources/views'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//event emiiter
const eventEmitter=new Emitter()
app.set('eventEmitter',eventEmitter);

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
app.use((req,res)=>{
    res.status(404).render('error/404')
})


const server=app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`);
});

// socket
const io=require('socket.io')(server);
io.on('connection',(socket)=>{
    //join 
    socket.on('join',(orderId)=>{
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})
eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})