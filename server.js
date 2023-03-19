const express=require('express');
const app=express();
const ejs=require('ejs');
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const PORT=process.env.PORT || 3000;


app.set('view engine','ejs');
app.set('views',path.join(__dirname+'/resources/views'));
//assests
app.use(express.static("public"));
app.use(expressLayouts);

app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/login',(req,res)=>{
    res.render('auth/login');
})

app.get('/register',(req,res)=>{
    res.render('auth/register');
})
app.get('/cart',(req,res)=>{
    res.render('customers/cart');
})

app.listen(3000,()=>{
    console.log(`Listening on Port ${PORT}`);
});