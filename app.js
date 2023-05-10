const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()
 const model=require('./models');
 const Customer=model.Stripe;

const publishable_key='pk_test_51N5ovJCYs14LSkHCfF6EOO0TwkT7p3n3GgLPJEfOiGXoHGZdQiftj51mweO9RBpbf5O4Sg1aWrPPXsLQHeuTNFwG00stlBKsll';
const secret_key='sk_test_51N5ovJCYs14LSkHCOvv0GjZB6xB7EkJYeENG7PCBsIIU4kWK79S13CQLyiRwIyIoV6rxS6lRcG9Vjc53LV5mTsFk00uNiCR9gW';
 
const stripe = require('stripe')(secret_key)
 
const port = process.env.PORT || 3000
 
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
 
// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
 
// app.get('/', function(req, res){
// res.render('Home', {
// key:publishable_key
// })
// });

// app.post('/payment', function(req, res){
 
//     // Moreover you can take more details from user
//     // like Address, Name, etc from form
//     stripe.customers.create({
//     email: req.body.stripeEmail,
//     source: req.body.stripeToken,
//     name: 'Rimzim',
//     address: {
//     line1: 'TC 9/4 Old MES colony',
//     postal_code: '110092',
//     city: 'New Delhi',
//     state: 'Delhi',
//     country: 'India',
//     }
//     })
//     .then((customer) => {
     
//     return stripe.charges.create({
//     amount: 7000, // Charing Rs 25
//     description: 'Web Development Product',
//     currency: 'INR',
//     customer: customer.id
//     });
//     })
//     .then((charge) => {
//     res.send("Success") // If no error occurs
//     })
//     .catch((err) => {
//         console.log(err);
//     res.send(err) // If some error occurs
//     });
//     })






app.get('/', (req, res) => {
    res.render('index', { message: null, currentYear: new Date().getFullYear() ,key:publishable_key,req});
  });




  app.post('/payment', async (req, res) => {
    const { email, cardNumber, expMonth, expYear, cvc,ammount} = req.body;
  
    try {
      let customer = await Customer.findOne({
        where: { email },
      });
  
      if (!customer) {
        // Step 1: Create a new customer in Stripe
        const stripeCustomer = await stripe.customers.create({
          email,
        });
  
        // Step 2: Store the customer in the database
        customer = await Customer.create({
          email,
          stripe_id: stripeCustomer.id,
        });
      }
  
      const token = await stripe.tokens.create({
        card: {
          number: cardNumber,
          exp_month: expMonth,
          exp_year: expYear,
          cvc,
        },
      });
  
      const existingCards = await stripe.customers.listSources(customer.stripe_id, { object: 'card' });
  
      const cardExists = existingCards.data.some((card) => card.last4 === cardNumber.substr(-4));
  
      if (cardExists) {
      console.log("card already exist")
      }
  
      await stripe.customers.createSource(customer.stripe_id, {
        source: token.id,
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: ammount,
        currency: 'USD',
        customer: customer.stripe_id,
        payment_method: token.card.id,
        confirm: true,
      });
      if (paymentIntent.status === 'succeeded') {
        const message = 'Payment successful.';
        return res.status(200).json({ message });
      } else {
        const message = 'Payment failed.';
        return res.status(400).json({ message });
      }
    
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error });
    }
  });
  
app.listen(port, function(error){
if(error) throw error
console.log("Server created Successfully")
})