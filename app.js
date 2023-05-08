const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()
 const model=require('./models');
 const Customer=model.Stripe;

const publishable_key='pk_test_51N5NDcSJkVRa4K2hy306krOmNTChXdNLnYCwICk5BvOWQTvZWbykMvsrvfMDb7HCLTNFrv9N7fbepl2WIqQxcs9q00ST9yGHDy';
const secret_key='sk_test_51N5NDcSJkVRa4K2hnXRbAMawNsUA0jf7eXfroe3qfySxOd92Ead0Pp9T4nj27pspX7KufdqzMrjw84AshI9jEmz800doF75vs8';
 
const stripe = require('stripe')(secret_key)
 
const port = process.env.PORT || 2000
 
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


//   app.post('/payment', async (req, res) => {
//     const { email, cardNumber, expMonth, expYear, cvc } = req.body;
  
//     try {
//       let customer = await Customer.findOne({
//         where: { email },
//       });
  
//       if (!customer) {
//         // Step 1: Create a new customer in Stripe
//         const stripeCustomer = await stripe.customers.create({
//           email,
//         });
  
//         // Step 2: Store the customer in the database
//         customer = await Customer.create({
//           email,
//           stripe_id: stripeCustomer.id,
//         });
//       }
  
//       // Step 3: Retrieve customer data from Stripe
//       const stripeCustomer = await stripe.customers.retrieve(customer.stripe_id);
//     console.log("stripecustomers.....",stripeCustomer)
//       // Step 4: Check if the customer already has the new card
//       // const existingCards =  stripeCustomer.sources ? stripeCustomer.sources.data : [];
//       // console.log("existingCards",existingCards);
//       // const cardExists = existingCards.some(card => card.last4 === cardNumber.substr(-4));
//       // console.log("cardExists",cardExists);

  
//       // if (cardExists) {
//       //   const message = 'Card already exists for the customer.';
//       //   return res.status(400).json({ message });
//       // }

//       const token = await stripe.tokens.create({
//         card: {
//           number: cardNumber,
//           exp_month:expMonth ,
//           exp_year: expYear,
//           cvc: cvc,
//         },
//       });
//       console.log("token,,,,,",token)

//     const existingCards = token.card;
//   console.log("existingCards", existingCards);
//   const exist=existingCards.last4
//   console.log("cfjhbbvb",exist)
//  const card= cardNumber.substr(-4)
//  console.log("cbhjdsbvjub",card)
//   let cardExists = false;
//   if (existingCards && existingCards.last4 === cardNumber.substr(-4)) {

//     const str= await stripe.customers.createSource(customer.stripe_id, {
//       source:	'tok_visa'
     
      
      
//     });
//     console.log("v hbhjfbgv",str);

//     const message = 'New card added to the customer.';
//     return res.status(200).json({ message });
//     // console.log("bcfdshbgvushvjug")
//     // // cardExists = true;
//     // console.log("card existas")
//     // return res.status(400).json({ message:'Card already exists for the customer.' });
//   }
//   else{
//     cardExists = true;
//     console.log("card existas")
//     return res.status(400).json({ message:'Card already exists for the customer.' });
//     }
  

// console.log("cardExists", cardExists);
      // const existingCards =  token.card
      // console.log("existingCards",existingCards);
      
      // const cardExists = existingCards.some(card => card.last4 === cardNumber.substr(-4));
      // console.log("cardExists",cardExists);


      // if (cardExists) {
      //   const message = 'Card already exists for the customer.';
      //   console.log("card existas")
      //   return res.status(400).json({ message });
      // }


      // Step 5: Create a new card for the customer in Stripe
    //  const str= await stripe.customers.createSource(customer.stripe_id, {
    //     source:	'tok_visa'
       
        
        
    //   });
    //   console.log("v hbhjfbgv",str);
  
    //   const message = 'New card added to the customer.';
    //   return res.status(200).json({ message });

    // console.log("bcfdshbgvushvjug");
  
  // }catch (error) {
  //     console.error('Error:', error);
  //     return res.status(500).json({ error });
  //   }
  // });


  app.post('/payment', async (req, res) => {
    const { email, cardNumber, expMonth, expYear, cvc } = req.body;
  
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
        const message = 'Card already exists for the customer.';
        return res.status(400).json({ message });
      }
  
      await stripe.customers.createSource(customer.stripe_id, {
        source: token.id,
      });
  
      const message = 'New card added to the customer.';
      return res.status(200).json({ message });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error });
    }
  });
  
app.listen(port, function(error){
if(error) throw error
console.log("Server created Successfully")
})