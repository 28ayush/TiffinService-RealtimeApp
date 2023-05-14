const homeController=require('../app/http/controllers/homeController');
const authController=require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/cartController');
const guest=require('../app/http/middlewares/guest');
const orderController=require('../app/http/controllers/orderController')
const auth=require('../app/http/middlewares/auth')
const AdminOrderController=require('../app/http/controllers/admin/orderController')
const admin=require('../app/http/middlewares/admin')

function initRoutes(app){

    app.get('/',homeController().index)

    app.get('/login',guest,authController().login)
    app.post('/postLogin',authController().postLogin)
    
    app.get('/register',guest,authController().register);
    app.post('/postRegister',authController().postRegister);

     app.post('/logout',authController().logout);


     app.get('/cart',cartController().index)
     app.post('/update-cart',cartController().update);

     
     // customer routes
     app.post('/orders',auth,orderController().store);
     app.get('/customer/orders',auth,orderController().index);

     //admin routes
     app.get('/admin/orders',admin,AdminOrderController().index);

}
module.exports=initRoutes;