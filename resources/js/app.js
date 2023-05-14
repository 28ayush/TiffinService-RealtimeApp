
import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin ';

let addToCart=document.querySelectorAll('.add-to-cart');
let cartCounter=document.querySelector('#cartCounter');
function updateCart(pizza)
{
    axios.post('/update-cart',pizza).then(res=>{
        cartCounter.innerText=res.data.totalQty;
        new Noty({
            type:'success',
            timeout: 700,
            text: "Item added successfully",
            progressBar:false
          }).show();

    }).catch(err=>{
        console.log(err);
    })
}

addToCart.forEach((btn)=>{
        btn.addEventListener('click',(e)=>{
                let pizza=JSON.parse(btn.dataset.pizza);
                updateCart(pizza);
        })
})

// remove alert message
const alertMsg=document.querySelector('#success-alert')

if(alertMsg)
{
    setTimeout(()=>{
        alertMsg.remove();
    },2000);
}
initAdmin()