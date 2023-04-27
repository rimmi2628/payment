const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()
 

const publishable_key='pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3';
const secret_key='sk_test_tR3PYbcVNZZ796tH88S4VQ2u';
 
const stripe = require('stripe')(secret_key)
 
const port = process.env.PORT || 3000
 
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
 
// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
 
app.get('/', function(req, res){
res.render('Home', {
key:publishable_key
})
});

app.post('/payment', function(req, res){
 
    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
    name: 'Rimzim',
    address: {
    line1: 'TC 9/4 Old MES colony',
    postal_code: '110092',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    }
    })
    .then((customer) => {
     
    return stripe.charges.create({
    amount: 7000, // Charing Rs 25
    description: 'Web Development Product',
    currency: 'INR',
    customer: customer.id
    });
    })
    .then((charge) => {
    res.send("Success") // If no error occurs
    })
    .catch((err) => {
        console.log(err);
    res.send(err) // If some error occurs
    });
    })
 
app.listen(port, function(error){
if(error) throw error
console.log("Server created Successfully")
})