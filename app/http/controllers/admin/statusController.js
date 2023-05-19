const Order=require('../../../models/order')

function statusController(){

    return{
        update(req,res){
            const eventEmitter=req.app.get('eventEmitter');
            eventEmitter.emit('orderUpdated',{id:req.body.orderId,status:req.body.status});
            Order.updateOne({_id:req.body.orderId},{status:req.body.status}).then(
                res.redirect('/admin/orders')
            ).catch(err=>{
                res.redirect('/admin/orders')
            })
        }

    }
}
module.exports=statusController;