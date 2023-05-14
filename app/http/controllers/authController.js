const User=require('../../models/user');
const bcrypt=require('bcrypt');
const passport=require('passport')


function authController(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    return {
        login(req,res){
            res.render('auth/login');
        },
        postLogin(req,res,next){
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error',info.message);
                    return next(err)
                }
                if(!user)
                {
                    req.flash('error',info.message)
                    return res.redirect('/login');
                }
                req.logIn(user,(err)=>{
                    if(err){
                        req.flash('error',info.message);
                        return next(err)
                    }
                    req.flash('success',"Welcome ! You are successfully logged in.")
                    return res.redirect(_getRedirectUrl(req));
                })
            })(req,res,next)
        },

        register(req,res){
            res.render('auth/register');
        },
        
       async postRegister(req,res){
            const {name,email,password}=req.body;
            //validate email
    
            //hash password
            const hashed=await bcrypt.hash(password,10)

        //create a user
            const user=new User({
                name:name,
                email:email,
                password:hashed

            })

            user.save().then(()=>{
                return res.redirect('/login')
            }).catch(err=>{
                req.flash('error','Something went wrong');
                return res.redirect('/register');
            })
       
        }
        ,logout(req,res){
            req.logout(function(err) {
                if (err) { return next(err); }
                res.redirect('/login');
              });
        }
    }
}
module.exports=authController