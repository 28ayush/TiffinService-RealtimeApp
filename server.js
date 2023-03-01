const express=require('express');
const app=express();
const ejs=require('ejs');
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const PORT=process.env.PORT || 3000;


app.set('view engine','ejs');
app.set('views',path.join(__dirname+'/resources/views'));

app.get('/',(req,res)=>{
    res.render('home');
})
app.use(expressLayouts);

app.listen(3000,()=>{
    console.log(`Listening on Port ${PORT}`);
});