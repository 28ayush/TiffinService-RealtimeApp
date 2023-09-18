
import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin ';
import moment from 'moment';

let addToCart=document.querySelectorAll('.add-to-cart');
let cartCounter=document.querySelector('#cartCounter');
// let deleteCart=document.querySelector('.deleteCart');

function updateCart(pizza)
{
    axios.post('/update-cart',pizza).then(res=>{
       
        cartCounter.innerText=res.data.totalQty;
        new Noty({
            type:'success',
            timeout: 800,
            text: "Item added successfully ",
            layout:'topLeft',
            progressBar:true
          }).show();

    }).catch(err=>{
        console.log(err);
    })
}
// function dCart(pizza)
// {
//     axios.post('/delete-cart',pizza).then(res=>{
//         console.log(res.data);
//         cartCounter.innerText=res.data.totalQty;
//     }).catch(err=>{
//         console.log(err);
//     })
// }
addToCart.forEach((btn)=>{
        btn.addEventListener('click',(e)=>{
                let pizza=JSON.parse(btn.dataset.pizza);
                updateCart(pizza);
        })
})

// deleteCart.addEventListener('click',(e)=>{
//         let pizza=JSON.parse(deleteCart.dataset.pizza);
//         dCart(pizza);
// })

// remove alert message
const alertMsg=document.querySelector('#success-alert')

if(alertMsg)
{
    setTimeout(()=>{
        alertMsg.remove();
    },2000);
}


//change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order){
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
 let stepCompleted=true;
 statuses.forEach((status)=>{
    let dataProp=status.dataset.status;
    if(stepCompleted)
    {
        status.classList.add('step-completed');
    }
    if(dataProp===order.status)
    {
        stepCompleted=false;
        time.innerText=moment(order.updatedAt).format('hh:mm A');
        status.appendChild(time);
        if(status.nextElementSibling)
        status.nextElementSibling.classList.add('current');
    }
 })
   

}
updateStatus(order);

//socket
let socket=io()


if(order){
    socket.emit('join',`order_${order._id}`)
}
let adminAreaPath=window.location.pathname
if(adminAreaPath.includes('admin')){
    initAdmin(socket)
socket.emit('join','adminRoom');
}

socket.on('orderUpdated',(data)=>{
    const updateOrder={...order}
    updateOrder.updateAt=moment().format()
    updateOrder.status=data.status;
    updateStatus(updateOrder);
    new Noty({
        type:'success',
        timeout: 700,
        text: "Order Updated",
        progressBar:false
      }).show();
  
})
