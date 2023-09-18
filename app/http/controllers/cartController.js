
function cartController(){
    return {
        index(req,res){
            res.render('customers/cart');
        },
        update(req,res){
            if(!req.session.cart)
            {
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }
            }
            let cart=req.session.cart

            //check if item doesn't exists in cart
         
            if(!cart.items[req.body._id]){
                cart.items[req.body._id]={
                    item:req.body,
                    qty:1
                }
                cart.totalQty=cart.totalQty+1;
                cart.totalPrice=cart.totalPrice+req.body.price;
            }
            else{
                cart.items[req.body._id].qty=cart.items[req.body._id].qty+1;
                cart.totalQty=cart.totalQty+1;
                cart.totalPrice=cart.totalPrice+req.body.price;
                
            }
            return res.json({totalQty:req.session.cart.totalQty})
        },
        delete(req,res){
            let cart=req.session.cart;
            cart.totalQty=cart.totalQty-cart.items[req.body.prodId].qty;
            cart.totalPrice=cart.totalPrice-(cart.items[req.body.prodId].item.price*cart.items[req.body.prodId].qty);
            delete cart.items[req.body.prodId];

            if(Object.values(cart.items).length==0)
            {
              delete req.session.cart;
            }
          
            res.redirect('/cart');
          
        }
     }
}

module.exports=cartController